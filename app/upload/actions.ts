'use server'
import { PDFParse } from 'pdf-parse'
import { db } from '@/lib/db_config'
import { documents } from '@/lib/db_schema'
import { generateEmbeddings } from '@/lib/embeddings'
import { chunkContent } from '@/lib/chunking'

export async function processPdfFile(formData: FormData) {
    try {
        const file = formData.get('pdf') as File;
        if (!file) {
            return { success: false, error: 'No file uploaded' };
        }

        const byte = await file.arrayBuffer();
        const buffer = Buffer.from(byte);

        const parser = new PDFParse({ data: buffer });
        const data = await parser.getText();

        if (!data.text || data.text.trim().length === 0) {
            return {
                success: false,
                error: 'No text found in the pdf'
            };
        }

        const chunks = await chunkContent(data.text);
        const embeddings = await generateEmbeddings(chunks);

        // Fixed double curly braces to standard object literal parentheses + braces
        const records = chunks.map((chunk, index) => ({
            content: chunk,
            embedding: embeddings[index]
        }));
        for (const record of records) {
            await db.insert(documents).values(record);
        }

        return {
            success: true,
            message: `Created ${records.length} chunks successfully`
        };
    } catch (error) {
        console.error('Error processing PDF:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Internal Server Error'
        };
    }
}