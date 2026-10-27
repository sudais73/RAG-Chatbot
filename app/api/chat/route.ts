import { streamText, UIMessage, convertToModelMessages, tool, InferUITools, UIDataTypes, stepCountIs } from 'ai'
import { groq } from '@ai-sdk/groq'
import { z } from 'zod'
import { searchDocuments } from '@/lib/search'

const tools = {
    searchKnowledgeBase: tool({
        description: "Search The knowledge base for relevant information",
        inputSchema: z.object({
            query: z.string().describe("The search query to find relevant documents")
        }),
        execute: async ({ query }) => {
            try {
                const results = await searchDocuments(query, 3)
                if (results.length === 0) {
                    return "No relevant information found in the knowledge base"
                }
                const formattedResult = results.map((r, i) => `${i + 1} ${r.content}`).join("\n\n");
                return formattedResult;
            } catch (error) {
                console.error("Search error")
                return "Error Searching knowledge base"
            }
        }
    })
}

export type ChatTools = InferUITools<typeof tools>
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>
export async function POST(req: Request) {
    try {
        const { messages }: { messages: ChatMessage[] } = await req.json()

        const result = streamText({
            model: groq('openai/gpt-oss-20b'), // Free, fast, and extremely powerful model on Groq
            messages: await convertToModelMessages(messages), // Added 'await' here!
            tools,
            system: `You are a professional AI assistant and career representative for Sudais Aliyi Suleyman. 
You have access to a specific knowledge base containing Sudais's resume and documents.

CRITICAL RULES:
1. ONLY answer questions using the information found in the knowledge base.
2. If a user asks a question that is NOT contained in or related to the knowledge base (such as general knowledge, trivia, geography, capital cities, etc.), you MUST respond with exactly: "I don't have this knowledge". Do not attempt to answer or guess.
3. Keep your answers professional, concise, and structured.`,
            stopWhen: stepCountIs(2)
        });

        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error('Error processing chat request:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}