'use client';

import { useState, useCallback, useRef } from 'react';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import type {
  AssistantChatMessage,
  AssistantChatMessageResponse,
  AssistantChatSession,
} from '@/lib/types';

export function useChat() {
  const [chat, setChat] = useState<AssistantChatSession>({
    messages: [],
    loading: false,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || chat.loading) return;

    const userMessage: AssistantChatMessage = {
      role: 'user',
      content: content.trim(),
    };

    // Add user message and create empty assistant message
    setChat((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage, { role: 'assistant', content: '' }],
      loading: true,
      error: null,
    }));

    // Abort any existing stream
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    try {
      let currentContent = '';

      await fetchEventSource('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...chat.messages, userMessage],
        }),
        signal: abortController.signal,
        onmessage(event) {
          try {
            const data: AssistantChatMessageResponse = JSON.parse(event.data);

            switch (data.type) {
              case 'message_start':
                // Message start event - no action needed
                break;

              case 'content_chunk':
                if (data.delta?.content) {
                  currentContent += data.delta.content;
                  setChat((prev) => {
                    const newMessages = [...prev.messages];
                    // Find the last assistant message (should be the empty one we added)
                    const lastIndex = newMessages.length - 1;
                    const assistantMessage = newMessages[lastIndex];
                    if (assistantMessage && assistantMessage.role === 'assistant') {
                      newMessages[lastIndex] = {
                        ...assistantMessage,
                        content: currentContent,
                      };
                    }
                    return {
                      ...prev,
                      messages: newMessages,
                    };
                  });
                }
                break;

              case 'citation':
                // Handle citations if needed
                setChat((prev) => {
                  const newMessages = [...prev.messages];
                  const lastIndex = newMessages.length - 1;
                  const assistantMessage = newMessages[lastIndex];
                  if (assistantMessage && assistantMessage.role === 'assistant') {
                    if (!assistantMessage.citations) {
                      assistantMessage.citations = [];
                    }
                    // Deduplicate citations by position to avoid adding the same citation twice
                    const existingCitation = assistantMessage.citations.find(
                      (c) => c.position === data.citation.position
                    );
                    if (!existingCitation) {
                      assistantMessage.citations.push(data.citation);
                    }
                    newMessages[lastIndex] = { ...assistantMessage };
                  }
                  return {
                    ...prev,
                    messages: newMessages,
                  };
                });
                break;

              case 'message_end':
                setChat((prev) => ({
                  ...prev,
                  loading: false,
                  error: null, // Clear any previous errors on successful completion
                }));
                break;

              case 'error':
                setChat((prev) => {
                  const newMessages = [...prev.messages];
                  // Remove the empty assistant message that was added at the start
                  const lastIndex = newMessages.length - 1;
                  if (newMessages[lastIndex]?.role === 'assistant' && newMessages[lastIndex]?.content === '') {
                    newMessages.pop();
                  }
                  return {
                    ...prev,
                    messages: newMessages,
                    loading: false,
                    error: data.message || 'An error occurred',
                  };
                });
                break;
            }
          } catch (error) {
            console.error('Error parsing SSE message:', error);
          }
        },
        onopen: async (res) => {
          // Validate response status
          if (!res.ok || res.status !== 200) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
        },
        onerror(error) {
          console.error('SSE error:', error);
          setChat((prev) => {
            const newMessages = [...prev.messages];
            // Remove the empty assistant message that was added at the start
            const lastIndex = newMessages.length - 1;
            if (newMessages[lastIndex]?.role === 'assistant' && newMessages[lastIndex]?.content === '') {
              newMessages.pop();
            }
            return {
              ...prev,
              messages: newMessages,
              loading: false,
              error: error.message || 'Failed to fetch response',
            };
          });
          // Don't retry on error
          throw error;
        },
        onclose() {
          setChat((prev) => ({
            ...prev,
            loading: false,
          }));
        },
      });
    } catch (error: any) {
      if (error.name === 'AbortError') {
        // Stream was aborted, don't update state
        return;
      }
      console.error('Error sending message:', error);
      setChat((prev) => {
        const newMessages = [...prev.messages];
        // Remove the empty assistant message that was added at the start
        const lastIndex = newMessages.length - 1;
        if (newMessages[lastIndex]?.role === 'assistant' && newMessages[lastIndex]?.content === '') {
          newMessages.pop();
        }
        return {
          ...prev,
          messages: newMessages,
          loading: false,
          error: error.message || 'Failed to send message',
        };
      });
    }
  }, [chat.messages, chat.loading]);

  const clearChat = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setChat({
      messages: [],
      loading: false,
    });
  }, []);

  return {
    chat,
    sendMessage,
    clearChat,
  };
}

