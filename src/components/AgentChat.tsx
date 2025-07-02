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
  const [showRefreshButton, setShowRefreshButton] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { address } = useAppKitAccount();

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
        // Clear any previous errors on successful response
        setLastError(null);
        setShowRefreshButton(false);
      } else {
        // Handle case where message was sent but agent didn't respond
        if (response.data) {
          // Update messages with what we have (user's message)
          setMessages(response.data);
        }

        // Show error message and refresh button
        const errorContent =
          response.error ||
          "Agent did not respond. Please try sending your message again.";
        setLastError(errorContent);
        setShowRefreshButton(true);

        throw new Error(errorContent);
      }
    } catch (error) {
      console.error("Error sending message:", error);

      // Check if it's a timeout error after retries
      const isTimeoutError =
        error instanceof Error &&
        (error.name === "TimeoutError" ||
          (error as Error & { code?: string }).code ===
            "TIMEOUT_AFTER_RETRIES");

      // Check if this is an agent response timeout (not a network timeout)
      const isAgentTimeout =
        error instanceof Error &&
        error.message.includes(
          "Agent did not respond within the expected time"
        );

      let errorContent: string;

      if (isTimeoutError) {
        errorContent =
          "⏱️ The request timed out after multiple attempts. Please check your internet connection and try again.";
      } else if (isAgentTimeout) {
        errorContent =
          "🤖 The agent didn't respond to your message. This might be temporary - please try again.";
      } else {
        errorContent =
          "Sorry, I'm having trouble connecting right now. Please try again later.";
      }

      // Only add error message to chat if it's not already handled above
      if (!isAgentTimeout || !lastError) {
        const errorMessage: ChannelMessage = {
          id: (Date.now() + 1).toString(),
          author_id: addressToUuid(address as string),
          server_id: "00000000-0000-0000-0000-0000000000",
          content: errorContent,
          sourceType: "agent_response", // Fixed: should be sourceType
          created_at: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }

      // Show refresh button after error (if not already set)
      if (!showRefreshButton) {
        setLastError(errorContent);
        setShowRefreshButton(true);
      }
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
          console.error("Failed to load message history:", response.error);
          setMessages([]);
          setLastError(response.error || "Failed to load conversation history");
          setShowRefreshButton(true);
        }
      } catch (error) {
        console.error("Error loading message history:", error);

        // Check if it's a timeout error after retries
        const isTimeoutError =
          error instanceof Error &&
          (error.name === "TimeoutError" ||
            (error as Error & { code?: string }).code ===
              "TIMEOUT_AFTER_RETRIES");

        if (isTimeoutError) {
          // Show timeout message in chat
          const timeoutMessage: ChannelMessage = {
            id: "timeout-" + Date.now().toString(),
            author_id: "system",
            server_id: "00000000-0000-0000-0000-000000000000",
            content:
              "⏱️ Unable to load conversation history due to connection timeout. You can still send new messages.",
            sourceType: "system",
            created_at: new Date().toISOString(),
          };
          setMessages([timeoutMessage]);
          setLastError("Connection timeout while loading history");
          setShowRefreshButton(true);
        } else {
          // Fallback to default welcome message for other errors
          setMessages([]);
          setLastError("Failed to load conversation history");
          setShowRefreshButton(true);
        }
      } finally {
        setIsLoadingHistory(false);
      }
    };

    loadMessageHistory();
  }, [agent?.id, roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // console.log(messages);

  return (
    <div className="flex  flex-col h-[80vh]  w-full  relative     rounded-[15px]  bg-dark">
      {/* Intro Message - Show when no history or only default welcome message */}
      {!isLoadingHistory && messages.length < 1 && (
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
          {messages.map((message, index, arr) => (
            <div
              key={message.id}
              className={`flex   w-max max-w-[500px] relative ${
                message.sourceType === "fraktia_client"
                  ? "self-end"
                  : message.sourceType === "system"
                  ? "self-center"
                  : "self-start"
              }`}
            >
              <div
                className={`rounded-md p-4 ${
                  message.sourceType === "fraktia_client"
                    ? "bg-primary text-black"
                    : message.sourceType === "system"
                    ? "bg-yellow-500/20 border border-yellow-500/30 text-yellow-200"
                    : "bg-bg borde border-primary/30 text-white"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                {/* <span className="text-[8px] absolute bottom-1 left-1 opacity-70 mt-2 block">
                {formatMessageTimestamp(message.timestamp)}
              </span> */}
                {/* Error Message and Refresh Button - Show when there's an error */}
                {message.sourceType === "fraktia_client" &&
                  index === arr.length - 1 && (
                    <button
                      onClick={() => {
                        setInputValue(message.content);
                        handleSendMessage();
                      }}
                      className="w-4 h-4 cursor-pointer  absolute -bottom-[20px] right-0  flex items-center justify-center  hover:bg-primary/30   rounded-full text-primary transition-colors hover:rotate-180 duration-300"
                      title="Refresh chat"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </button>
                  )}
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
