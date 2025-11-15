import { Pinecone } from '@pinecone-database/pinecone';

let pinecone: Pinecone | null = null;

function getPineconeClient(): Pinecone {
  if (!pinecone) {
    const apiKey = process.env.PINECONE_API_KEY;
    if (!apiKey) {
      throw new Error('PINECONE_API_KEY environment variable is not set');
    }
    pinecone = new Pinecone({
      apiKey: apiKey,
    });
  }
  return pinecone;
}

export function getAssistant(assistantName: string) {
  if (!assistantName) {
    throw new Error('Assistant name is required');
  }
  const client = getPineconeClient();
  return client.Assistant(assistantName);
}

