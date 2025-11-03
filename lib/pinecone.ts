import { Pinecone } from '@pinecone-database/pinecone';

if (!process.env.PINECONE_API_KEY) {
  throw new Error('PINECONE_API_KEY environment variable is not set');
}

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

export function getAssistant(assistantName: string) {
  if (!assistantName) {
    throw new Error('Assistant name is required');
  }
  return pinecone.Assistant(assistantName);
}

