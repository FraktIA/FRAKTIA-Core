"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { sendMessageToAgent, getMessageHistory } from "@/actions/agent";
import { AgentDetails, ChannelMessage } from "@/types/agent";
import { addressToUuid } from "@/lib/utils";
import { useAppKitAccount } from "@reown/appkit/react";

interface AgentChatProps {
  agent: AgentDetails;
  roomId?: string | null;
}

export default function AgentChat({ agent, roomId }: AgentChatProps) {
  console.log("AgentChat - agent:", agent?.id, "roomId:", roomId);

  const [messages, setMessages] = useState<ChannelMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { address } = useAppKitAccount();

  // Convert AgentMemory to Message format
  // const convertMemoryToMessage = (
  //   memory: AgentMemory,
  //   agentId: string
  // ): Message => {
  //   // Determine role based on entityId vs agentId
  //   // If entityId matches agentId, it's an agent message
  //   // If entityId is different or has source 'client_chat', it's a user message
  //   const isAgentMessage = memory.entityId === agentId;
  //   const isUserMessage =
  //     memory.content.source === "client_chat" || !isAgentMessage;

  //   return {
  //     id: memory.id,
  //     content: memory.content.text,
  //     role: isUserMessage ? "user" : "assistant",
  //     timestamp: new Date(
  //       typeof memory.createdAt === "string"
  //         ? memory.createdAt
  //         : memory.createdAt
  //     ),
  //   };
  // };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChannelMessage = {
      id: Date.now().toString(),
      content: inputValue,
      author_id: addressToUuid(address as string),
      server_id: "00000000-0000-0000-0000-000000000000",
      sourceType: "fraktia_client", // Fixed: should be sourceType
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Send message using the extracted API function
      const response = await sendMessageToAgent({
        agentId: agent?.id,
        text: userMessage.content,
        authorId: address as string,
        roomId: roomId || "default-room", // Use the provided roomId or fallback
        currentMessageCount: messages.length, // Pass current message count
      });

      console.log("Response from sendMessageToAgent:", response);

      if (response.success && response.data) {
        // Don't reverse here - messages should come in chronological order
        setMessages(response.data);
      } else {
        throw new Error(response.error || "Invalid response format");
      }
    } catch (error) {
      console.error("Error sending message:", error);

      // Fallback error message
      const errorMessage: ChannelMessage = {
        id: (Date.now() + 1).toString(),
        author_id: addressToUuid(address as string),
        server_id: "00000000-0000-0000-0000-0000000000",
        content:
          "Sorry, I'm having trouble connecting right now. Please try again later.",
        sourceType: "agent_response", // Fixed: should be sourceType
        created_at: new Date().toISOString(),
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
          const historyMessages = response.data;
          // Don't reverse here - messages should come in chronological order
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

  console.log(messages);

  return (
    <div className="flex  flex-col h-[80vh]  w-full  relative     rounded-[15px]  bg-dark">
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
        <div className="rounded-[15px] h-[90.5%] 5xl:h-[94%]   max-h-[90.5%] 5xl:max-h-[94%] scroll-smooth flex flex-col overflow-y-scroll  p-4 lg:p-6 gap-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex   w-max max-w-[500px] relative ${
                message.sourceType === "fraktia_client"
                  ? "self-end"
                  : "self-start"
              }`}
            >
              <div
                className={`rounded-md p-4 ${
                  message.sourceType === "fraktia_client"
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
