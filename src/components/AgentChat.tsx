"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  AgentDetails,
  sendMessageToAgent,
  getMessageHistory,
  AgentMemory,
} from "@/actions/agent";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface AgentChatProps {
  agent: AgentDetails;
  roomId?: string | null;
}

export default function AgentChat({ agent, roomId }: AgentChatProps) {
  console.log("AgentChat - agent:", agent?.id, "roomId:", roomId);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Convert AgentMemory to Message format
  const convertMemoryToMessage = (
    memory: AgentMemory,
    agentId: string
  ): Message => {
    // Determine role based on entityId vs agentId
    // If entityId matches agentId, it's an agent message
    // If entityId is different or has source 'client_chat', it's a user message
    const isAgentMessage = memory.entityId === agentId;
    const isUserMessage =
      memory.content.source === "client_chat" || !isAgentMessage;

    return {
      id: memory.id,
      content: memory.content.text,
      role: isUserMessage ? "user" : "assistant",
      timestamp: new Date(
        typeof memory.createdAt === "string"
          ? memory.createdAt
          : memory.createdAt
      ),
    };
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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

    try {
      // Send message using the extracted API function
      const response = await sendMessageToAgent({
        agentId: agent?.id,
        text: userMessage.content,
        senderId: "user",
        roomId: roomId || "default-room", // Use the provided roomId or fallback
        source: "web",
      });

      if (response.success && response.data?.message?.text) {
        const assistantMessage: Message = {
          id: response.data.messageId || (Date.now() + 1).toString(),
          content: response.data.message.text,
          role: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error(response.error || "Invalid response format");
      }
    } catch (error) {
      console.error("Error sending message:", error);

      // Fallback error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Sorry, I'm having trouble connecting right now. Please try again later.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Load message history on component mount
  useEffect(() => {
    const loadMessageHistory = async () => {
      try {
        const response = await getMessageHistory({
          agentId: agent?.id,
          roomId: roomId || "default-room", // Use the provided roomId or fallback
          limit: 50,
        });

        if (response.success && response.data) {
          const historyMessages = response.data
            .map((memory) => convertMemoryToMessage(memory, agent.id))
            .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

          setMessages(historyMessages);
        } else {
          // If no history or error, show default welcome message
          setMessages([]);
        }
      } catch (error) {
        console.error("Error loading message history:", error);
        // Fallback to default welcome message
        setMessages([]);
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadMessageHistory();
  }, [agent?.id, roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col w-full  relative flex-1  overflow-scroll mt-10 rounded-[15px]  bg-dark">
      {/* Intro Message - Show when no history or only default welcome message */}
      {!isLoadingHistory && messages.length <= 1 && (
        <div className="flex flex-col relative bottom-[10%] m-auto items-center justify-center gap-4">
          <h3 className="text-[48px] text-white font-semibold">
            Hi, I am {agent?.name || "An Assistant"}!
          </h3>
          <p className="text-[#e5e5e5]">Let&apos;s get started</p>
        </div>
      )}

      {/* Loading History Indicator */}
      {isLoadingHistory && (
        <div className="flex flex-col relative bottom-[10%] m-auto items-center justify-center gap-4">
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
          <p className="text-[#e5e5e5]">Loading conversation history...</p>
        </div>
      )}

      {/* Messages */}
      {messages.length > 0 && (
        <div className="flex-1 flex flex-col overflow-y-auto p-4 lg:p-6 space-y-4 bg-dark/50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex   w-max max-w-[400px] relative ${
                message.role === "user" ? "self-end" : "self-start"
              }`}
            >
              <div
                className={`rounded-md p-4 ${
                  message.role === "user"
                    ? "bg-primary text-black"
                    : "bg-bg borde border-primary/30 text-white"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                {/* <span className="text-[8px] absolute bottom-1 left-1 opacity-70 mt-2 block">
                {formatMessageTimestamp(message.timestamp)}
              </span> */}
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
      )}

      {/* Input */}
      <div className="flex absolute w-[98%] bottom-2 left-1/2 -translate-x-1/2 focus:ring-primary bg-bg border border-primary/30 rounded-[10px]  pr-1.5 justify-between items-center  min-h-[56px] ">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Example : “Explain quantum computing in simple terms”"
          className="flex-1  text-white/90  py-3 resize-none focus:outline-none h-full bg-bg pl-4 rounded-[10px]   font-medium  placeholder:text-[#e5e5e5]/30 flex items-center"
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
  );
}
