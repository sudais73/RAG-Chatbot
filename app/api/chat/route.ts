import { streamText, UIMessage, convertToModelMessages } from 'ai'
import { groq } from '@ai-sdk/groq'

export async function POST(req: Request) {
    try {
        const { messages }: { messages: UIMessage[] } = await req.json()

        const result = streamText({
            model: groq('openai/gpt-oss-20b'), // Free, fast, and extremely powerful model on Groq
            messages: await convertToModelMessages(messages), // Added 'await' here!
        });
        
        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error('Error processing chat request:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}