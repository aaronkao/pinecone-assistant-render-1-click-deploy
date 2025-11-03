// Assistant File Types
export enum AssistantFileStatus {
  AVAILABLE = 'Available',
  DELETING = 'Deleting',
  PROCESSING = 'Processing',
  PROCESSING_FAILED = 'ProcessingFailed',
  DELETED = 'Deleted',
}

export interface AssistantFile {
  status: AssistantFileStatus | string; // SDK returns string like "Available"
  id: string;
  name: string;
  metadata: null | Record<string, any>;
  updated_on: string;
  created_on: string;
  percent_done: number;
  signed_url: string | null;
  error_message?: string | null; // From API response
}

// Chat Types
export type AssistantChatMessageRole = 'assistant' | 'user' | 'error';

export type AssistantCitationHighlight = {
  type: 'text';
  content: string;
};

export type AssistantCitationReference = {
  file: AssistantFile;
  highlight: AssistantCitationHighlight | null;
  pages: number[];
};

export type AssistantChatMessageCitation = {
  position: number;
  references: AssistantCitationReference[];
};

export type AssistantChatMessage = {
  role: AssistantChatMessageRole;
  content: string;
  citations?: AssistantChatMessageCitation[];
};

export type AssistantChatSession = {
  messages: AssistantChatMessage[];
  loading: boolean;
  error?: string | null;
};

// Streaming Event Types
export type AssistantChatMessageStart = {
  type: 'message_start';
  id: string;
  model: string;
  role: AssistantChatMessageRole;
};

export type AssistantChatMessageContent = {
  type: 'content_chunk';
  delta: {
    content: string;
  };
};

export type AssistantChatCitation = {
  type: 'citation';
  citation: AssistantChatMessageCitation;
};

export type AssistantChatMessageEnd = {
  type: 'message_end';
  finish_reason: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export type AssistantChatError = {
  type: 'error';
  message: string;
};

export type AssistantChatMessageResponse =
  | AssistantChatMessageStart
  | AssistantChatMessageContent
  | AssistantChatCitation
  | AssistantChatMessageEnd
  | AssistantChatError;

