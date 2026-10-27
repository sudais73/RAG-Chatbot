import { streamText, UIMessage, convertToModelMessages, tool,InferUITools,UIDataTypes, stepCountIs } from 'ai'
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
export type ChatMessage = UIMessage<never,UIDataTypes,ChatTools>
export async function POST(req: Request) {
    try {
        const { messages }: { messages: ChatMessage[] } = await req.json()

        const result = streamText({
            model: groq('openai/gpt-oss-20b'), // Free, fast, and extremely powerful model on Groq
            messages: await convertToModelMessages(messages), // Added 'await' here!
            tools,
            system:`You are the a helpful assistant with access to a knowledge base.
            when users ask questions, search the knowledge base for relevant information Always search before answering if the question might related to uploaded documents. Base your answers on the search results when available. Give concise answers that correctly answers that correctly answer what user is asking for. do not flood them with all the information from the search results
            `,
            stopWhen:stepCountIs(2)
        });

        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error('Error processing chat request:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}