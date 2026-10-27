import { embed, embedMany } from 'ai';
import { google } from '@ai-sdk/google';

// 1. Single embedding function for chat search queries
export async function generateEmbedding(text: string) {
  const input = text.replace(/\n/g, " ");
  const { embedding } = await embed({
    model: google.embedding('gemini-embedding-001'),
    value: input,
    dimensions: 384,
  });
  return embedding;
}

// 2. Batched multi-embedding function for processing PDFs safely within rate limits
export async function generateEmbeddings(texts: string[]) {
  const input = texts.map((t) => t.replace(/\n/g, " "));
  const batchSize = 5; // Process 5 chunks at a time to stay under free tier rate limits
  const allEmbeddings: number[][] = [];

  for (let i = 0; i < input.length; i += batchSize) {
    const batch = input.slice(i, i + batchSize);
    
    const { embeddings } = await embedMany({
      model: google.embedding('gemini-embedding-001'),
      values: batch,
      dimensions: 384,
    });

    allEmbeddings.push(...embeddings);

    if (i + batchSize < input.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return allEmbeddings;
}