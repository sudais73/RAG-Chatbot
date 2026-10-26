'use client';

import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { PromptInput, PromptInputBody, PromptInputMessage, PromptInputSubmit, PromptInputTextarea, PromptInputTools } from "@/components/ai-elements/prompt-input";
import { Fragment, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { Message } from "@/components/ui/message";
import { MessageContent } from "@/components/ai-elements/message";
import { Loader } from "lucide-react";

export default function RAGPage() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat();

  const handleSubmit = (message: PromptInputMessage) => {
    if (message.text.trim() !== '') {
      sendMessage({ text: message.text });
      setInput('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full h-[calc(100vh)]">
      <div className="flex flex-col h-full">

        <Conversation className="h-full">
          <ConversationContent>
            {
              messages.map((mesage) => (
                <div key={mesage.id} className="flex flex-col gap-2">
                  {
                    mesage.parts.map((part, index) => {
                      switch (part.type) {
                        case 'text':
                          return (
                            <Fragment key={`message-${mesage.id}-part-${index}`}>
                              <Message role={mesage.role} className="max-w-full">
                                <MessageContent>
                                  {part.text}
                                </MessageContent>
                              </Message>
                            </Fragment>
                          );

                        default:
                          return null;
                      }
                    })
                  }
                </div>
              ))
            }
            {(status === "submitted" || status === "streaming") && <Loader />}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <PromptInput onSubmit={handleSubmit} className="mt-4">
          <PromptInputBody>
            <PromptInputTextarea value={input} onChange={(e) => setInput(e.target.value)} />
          </PromptInputBody>

          <PromptInputTools>
            <PromptInputSubmit />
          </PromptInputTools>
        </PromptInput>

      </div>
    </div>
  );
}