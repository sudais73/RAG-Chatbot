import { embed, embedMany } from 'ai'
import { google } from '@ai-sdk/google'

export async function generateEmbedding(text: string) {
    const input = text.replace(/\n/g, " ");
    const { embedding } = await embed({
        model: google.embedding('gemini-embedding-001'),
        value: input,
        dimensions: 384
    });
    return embedding;
}

export async function generateEmbeddings(texts: string[]) {
    const input = texts.map((t) => t.replace(/\n/g, " "));
    const { embeddings } = await embedMany({
        model: google.embedding('gemini-embedding-001'),
        values: input,
        dimensions: 384
    });
    return embeddings;
}