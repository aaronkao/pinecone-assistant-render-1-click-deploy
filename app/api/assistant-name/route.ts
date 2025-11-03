import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  // Check NEXT_PUBLIC_ASSISTANT_NAME first, then fall back to PINECONE_ASSISTANT_NAME
  const assistantName = process.env.NEXT_PUBLIC_ASSISTANT_NAME || process.env.PINECONE_ASSISTANT_NAME;
  
  if (!assistantName) {
    return NextResponse.json(
      { error: 'Assistant name environment variable is not set. Please set NEXT_PUBLIC_ASSISTANT_NAME or PINECONE_ASSISTANT_NAME' },
      { status: 500 }
    );
  }

  return NextResponse.json({ assistantName });
}

