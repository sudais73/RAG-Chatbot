'use client';

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { Loader2, User, Bot, Sparkles } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function RAGPage() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() !== '') {
      sendMessage({ text: input });
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-slate-50 font-sans overflow-hidden">
      {/* Header - Fixed Top */}
      <header className="border-b bg-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between shadow-sm shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-50 p-2 rounded-full text-indigo-600 shrink-0">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-semibold text-slate-800 text-sm sm:text-base">Sudais's AI Assistant</h1>
            <p className="text-[11px] sm:text-xs text-slate-500">Ask anything about his career, projects, and background</p>
          </div>
        </div>
      </header>

      {/* Chat Conversation Area - Internal Scrollable Container */}
      <main className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12 sm:py-16 space-y-3 px-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
                <Sparkles className="h-6 w-6" />
              </div>
              <h2 className="text-base sm:text-lg font-medium text-slate-700">Welcome! How can I help you?</h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Try asking about Sudais's work experience, his projects like GetEduTrack, or his education background.
              </p>
            </div>
          )}

          {messages.map((message) => {
            const isUser = message.role === 'user';
            return (
              <div
                key={message.id}
                className={`flex items-start gap-2.5 sm:gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isUser ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {isUser ? <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[88%] sm:max-w-[80%] rounded-2xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm shadow-sm leading-relaxed break-words overflow-hidden ${
                  isUser 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                }`}>
                  {message.parts.map((part, index) => {
                    if (part.type === 'text') {
                      return (
                        <div key={index} className={`max-w-none text-xs sm:text-sm [&>p]:mb-2 [&>ul]:list-disc [&>ul]:ml-4 [&>ol]:list-decimal [&>ol]:ml-4 overflow-x-auto ${isUser ? 'text-white' : 'text-slate-800'}`}>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {part.text}
                          </ReactMarkdown>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {(status === "submitted" || status === "streaming") && (
            <div className="flex items-start gap-2.5 sm:gap-3">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none px-3.5 sm:px-4 py-2.5 sm:py-3 shadow-sm flex items-center gap-2 text-slate-500 text-xs sm:text-sm">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                <span>Thinking...</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </main>

      {/* Input Footer - Locked & Fixed at Bottom */}
      <footer className="border-t bg-white px-3 sm:px-6 py-3 sm:py-4 shadow-lg shrink-0 z-10">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Sudais's experience, projects, or skills..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3.5 sm:pl-4 pr-12 py-2.5 sm:py-3 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || status === "streaming"}
              className="absolute right-2 bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 transition-all cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}