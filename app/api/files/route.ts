import { NextResponse } from 'next/server';
import { getAssistant } from '@/lib/pinecone';
import type { AssistantFile } from '@/lib/types';

export const runtime = 'nodejs';

// Transform SDK camelCase response to snake_case format expected by frontend
function transformFile(file: any): AssistantFile {
  // SDK returns camelCase (updatedOn, createdOn, percentDone, etc.) where dates are Date objects
  // Transform to snake_case (updated_on, created_on, percent_done, etc.) where dates are ISO strings
  
  // Helper to convert Date object or string to ISO string
  const toDateString = (date: Date | string | undefined): string => {
    if (!date) return '';
    if (date instanceof Date) return date.toISOString();
    if (typeof date === 'string') return date;
    return '';
  };
  
  return {
    status: file.status || file.Status,
    id: file.id || file.Id,
    name: file.name || file.Name,
    metadata: file.metadata || file.Metadata || null,
    updated_on: toDateString(file.updatedOn || file.updated_on || file.UpdatedOn),
    created_on: toDateString(file.createdOn || file.created_on || file.CreatedOn),
    percent_done: file.percentDone || file.percent_done || file.PercentDone || 0,
    signed_url: file.signedUrl || file.signed_url || file.SignedUrl || null,
    error_message: file.errorMessage || file.error_message || file.ErrorMessage || null,
  };
}

export async function GET() {
  try {
    const assistantName = process.env.PINECONE_ASSISTANT_NAME;
    
    if (!assistantName) {
      return NextResponse.json(
        { error: 'PINECONE_ASSISTANT_NAME environment variable is not set' },
        { status: 500 }
      );
    }

    const assistant = getAssistant(assistantName);
    const result = await assistant.listFiles();
    
    // SDK returns { files: [...] } with camelCase properties
    let files: any[] = [];
    if (result && typeof result === 'object' && 'files' in result) {
      files = (result.files as any[]) || [];
    } else if (Array.isArray(result)) {
      files = result;
    }
    
    // Transform files and fetch signed_url for each
    const filesWithDetails = await Promise.all(
      files.map(async (file: any) => {
        const fileId = file.id || file.Id;
        if (!fileId) {
          return transformFile(file);
        }
        
        // Fetch individual file details to get signed_url
        try {
          const fileDetails = await assistant.describeFile(fileId, true);
          const details = fileDetails as any;
          
          return transformFile({
            ...file,
            ...details,
            signedUrl: details.signedUrl ?? details.signed_url ?? null,
          });
        } catch (error) {
          console.error(`Error fetching details for file ${fileId}:`, error);
          return transformFile(file);
        }
      })
    );
    
    return NextResponse.json({ files: filesWithDetails });
  } catch (error: any) {
    console.error('Error fetching files:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

