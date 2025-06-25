"use client";

import { useState, useRef, useEffect } from "react";
import { Settings } from "lucide-react";
import Image from "next/image";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface AgentChatProps {
  onSettingsClick?: () => void;
}

export default function AgentChat({ onSettingsClick }: AgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI agent. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate agent response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I received your message: "${userMessage.content}". This is a basic chat interface. You can implement actual agent logic here.`,
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-dark">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-primary/60 bg-dark">
        <div>
          <h2 className="text-lg font-bold text-white tracking-wide uppercase">
            Agent Chat
          </h2>
          <p className="text-sm text-gray-400">Interact with your AI agent</p>
        </div>
        <button
          onClick={onSettingsClick}
          className="p-2 text-gray-400 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded transition-colors"
          title="Agent Settings"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark/50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.role === "user"
                  ? "bg-primary text-black"
                  : "bg-dark border border-primary/30 text-white"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-dark border border-primary/30 text-white rounded-lg p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-primary/60 bg-dark">
        <div className="flex focus:ring-primary bg-dark border border-primary/30 rounded-[10px] pl-4 pr-1.5 justify-between items-center min-h-[56px] ">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Example : “Explain quantum computing in simple terms”"
            className="flex-1  text-white  py-3 resize-none focus:outline-none  font-medium  placeholder:text-[#e5e5e5]/30 flex items-center"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-primary w-11 h-11 rounded-[10px] hover:bg-primary/90 flex items-center justify-center disabled:cursor-not-allowed "
          >
            <Image src={"/icons/send.svg"} alt="Send" width={20} height={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
