import Image from "next/image";
import React from "react";
import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectNodesPanelCategory,
  setShowNodesPanel,
} from "@/redux/slices/uiSlice";
import { characterConfigs } from "@/constants/characters";
import { CharacterConfig } from "@/types/nodes";

interface NodePanelProps {
  onAddNode?: (nodeType: string, position?: { x: number; y: number }) => void;
  onOpenTemplates?: () => void;
  currentReactFlowNodes?: Array<{ type?: string; data?: { label?: string } }>; // Add current nodes from ReactFlow
}

// Define node structure with character support
interface NodeItem {
  name: string;
  description: string;
  highlight: boolean;
  icon: string;
  type: "Framework" | "AI Model" | "Voice" | "Character" | "Plugins";
  character?: CharacterConfig;
}

// Node data organized by category
const nodeData: Record<string, NodeItem[]> = {
  Framework: [
    {
      name: "Eliza OS",
      description:
        "A powerful extensible framework designed for building conversational AI agents with advanced",
      highlight: !true,
      icon: "/icons/eliza.svg",
      type: "Framework" as const,
    },
    {
      name: "LangGraph",
      description:
        "Build resilient language agents as graphs with built-in persistence and human-in-the-loop capabilities",
      highlight: false,
      icon: "/icons/langraph.svg",
      type: "Framework" as const,
    },
    {
      name: "Copilot",
      description:
        "A framework for developing applications powered by language models with chain-of-thought reasoning",
      highlight: false,
      icon: "/icons/copilot.svg",
      type: "Framework" as const,
    },
    // {
    //   name: "AutoGen",
    //   description:
    //     "Multi-agent conversation framework enabling multiple AI agents to collaborate and solve complex tasks",
    //   highlight: false,
    //   icon: "/icons/framework.svg",
    //   type: "Framework" as const,
    // },
  ],
  "AI Model": [
    {
      name: "Claude",
      description:
        "Anthropic's advanced AI assistant with superior reasoning and safety capabilities for complex tasks",
      highlight: true,
      icon: "/icons/claude.svg",
      type: "AI Model" as const,
    },
    {
      name: "OpenAI",
      description:
        "OpenAI's most capable multimodal model with enhanced reasoning and creative problem-solving abilities",
      highlight: false,
      icon: "/icons/openai.svg",
      type: "AI Model" as const,
    },
    {
      name: "DeepSeek",
      description:
        "High-performance AI model optimized for code generation and mathematical reasoning tasks",
      highlight: false,
      icon: "/icons/deepseek.png",
      type: "AI Model" as const,
    },
    {
      name: "Gemini",
      description:
        "Google's advanced AI model with multimodal capabilities and strong performance across diverse domains",
      highlight: false,
      icon: "/icons/gemini.svg",
      type: "AI Model" as const,
    },
  ],
  Voice: [
    {
      name: "Eleven Labs",
      description:
        "Premium AI voice synthesis with natural intonation and emotion for realistic speech generation",
      highlight: true,
      icon: "/icons/voice.svg",
      type: "Voice" as const,
    },
    // {
    //   name: "OpenAI Whisper",
    //   description:
    //     "Robust speech recognition system with multilingual support and high accuracy transcription",
    //   highlight: false,
    //   icon: "/icons/voice.svg",
    //   type: "Voice" as const,
    // },
    // {
    //   name: "Azure Speech",
    //   description:
    //     "Microsoft's cloud-based speech services with real-time transcription and text-to-speech capabilities",
    //   highlight: false,
    //   icon: "/icons/voice.svg",
    //   type: "Voice" as const,
    // },
    // {
    //   name: "Google Cloud Speech",
    //   description:
    //     "Advanced speech recognition and synthesis with support for 125+ languages and variants",
    //   highlight: false,
    //   icon: "/icons/voice.svg",
    //   type: "Voice" as const,
    // },
  ],
  Character: [
    {
      name: characterConfigs.aiAssistant.name,
      description:
        "Professional AI assistant focused on accuracy and helpful responses across various domains",
      highlight: true,
      icon: "/icons/character.svg",
      type: "Character" as const,
      character: characterConfigs.aiAssistant,
    },
    {
      name: characterConfigs.creativeCompanion.name,
      description:
        "Imaginative companion for artistic projects and creative brainstorming sessions",
      highlight: false,
      icon: "/icons/character.svg",
      type: "Character" as const,
      character: characterConfigs.creativeCompanion,
    },
    {
      name: characterConfigs.technicalMentor.name,
      description:
        "Experienced developer mentor providing guidance on best practices and architecture",
      highlight: false,
      icon: "/icons/character.svg",
      type: "Character" as const,
      character: characterConfigs.technicalMentor,
    },
    {
      name: characterConfigs.empatheticFriend.name,
      description:
        "Caring companion offering emotional support and genuine understanding",
      highlight: false,
      icon: "/icons/character.svg",
      type: "Character" as const,
      character: characterConfigs.empatheticFriend,
    },
    {
      name: characterConfigs.gamingBuddy.name,
      description:
        "Enthusiastic gaming companion for strategy discussions and gaming community engagement",
      highlight: false,
      icon: "/icons/character.svg",
      type: "Character" as const,
      character: characterConfigs.gamingBuddy,
    },
    {
      name: characterConfigs.caseyBlack.name,
      description:
        "Mysterious secret agent who shares insider tips and life hacks from the shadows",
      highlight: false,
      icon: "/icons/character.svg",
      type: "Character" as const,
      character: characterConfigs.caseyBlack,
    },
  ],
  Plugins: [
    {
      name: "Twitter Client",
      description:
        "Run your agent 24/7 on twitter to automatically post and reply  tweets",
      highlight: !true,
      icon: "/icons/x.svg",
      type: "Plugins" as const,
    },
    // {
    //   name: "Database Connector",
    //   description:
    //     "Connect to various databases for data retrieval, storage, and management capabilities",
    //   highlight: false,
    //   icon: "/icons/add-ons.svg",
    //   type: "Plugins" as const,
    // },
    // {
    //   name: "API Gateway",
    //   description:
    //     "Manage external API integrations and handle authentication for third-party services",
    //   highlight: false,
    //   icon: "/icons/add-ons.svg",
    //   type: "Plugins" as const,
    // },
    // {
    //   name: "Analytics Dashboard",
    //   description:
    //     "Monitor agent performance, track conversations, and analyze user interaction patterns",
    //   highlight: false,
    //   icon: "/icons/add-ons.svg",
    //   type: "Plugins" as const,
    // },
  ],
};

const Nodes = ({ onAddNode, currentReactFlowNodes }: NodePanelProps) => {
  const dispatch = useAppDispatch();
  const nodesPanelCategory = useAppSelector(selectNodesPanelCategory);

  // Helper function to check if a node is currently selected/active in ReactFlow
  const isNodeActiveInBoard = (nodeName: string): boolean => {
    if (!currentReactFlowNodes) return false;
    return currentReactFlowNodes.some(
      (rfNode) => rfNode.data?.label === nodeName
    );
  };

  // Get the current nodes based on nodes panel category with dynamic highlighting
  const currentNodes: NodeItem[] = (
    nodeData[nodesPanelCategory as keyof typeof nodeData] || []
  ).map((node) => ({
    ...node,
    highlight: isNodeActiveInBoard(node.name), // Dynamic highlighting based on ReactFlow board
  }));

  return (
    <section className="min-w-[26%] rounded-tl-[20px]  bg-dark  pl-5 h-[100%]   flex flex-col">
      <div className="flex  py-5  flex-col gap-1">
        <h1 className="text-[20px] text-white">{nodesPanelCategory}</h1>
        <p className="text-white/70 text-xs font-light">
          {`Select Your preferred ${nodesPanelCategory?.toLowerCase()} `}
        </p>
      </div>
      <div className="flex relative scrollbar-hide overflow-y-scroll pt-10 pb-10  flex-col gap-6">
        <button
          onClick={() => dispatch(setShowNodesPanel(false))}
          className="text-gray-500 absolute top-0 right-1 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        {currentNodes.map((node, idx) => (
          <button
            key={node.name + idx}
            className={`rounded-3xl border-1 ${
              node.highlight
                ? "border-[#F8FF99]"
                : "border-transparent ring-[0px] ring-inset ring-white/8"
            } bg-bg w-[270px] h-[196px] p-5  flex flex-col gap-4 shadow-lg hover:border-[#F8FF99]/50 transition-all duration-200`}
            onClick={() => onAddNode && onAddNode(node.name)}
            title={
              node.character
                ? `Character: ${node.character.bio.join(" ")}`
                : undefined
            }
          >
            <div className="flex items-start justify-between">
              {/* Dynamic icon based on node type */}
              <Image
                src={node.icon}
                className="rounded-full"
                width={32}
                height={32}
                alt={node.name}
              />
              {/* 3-dot menu with character indicator */}
              <span className="flex items-center justify-center w-8 h-8 relative">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="6" r="1.5" fill="#fff" />
                  <circle cx="12" cy="12" r="1.5" fill="#fff" />
                  <circle cx="12" cy="18" r="1.5" fill="#fff" />
                </svg>
                {/* Character configuration indicator */}
                {node.character && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#F8FF99] rounded-full border border-bg"></div>
                )}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className=" font-semibold text-white leading-tight">
                {node.name}
              </span>
              <p className="text-xs font-light text-white leading-snug break-words">
                {node.description}
              </p>
              {/* Character-specific tags */}
              {node.character && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {node.character.adjectives
                    ?.slice(0, 2)
                    .map((adj: string, adjIdx: number) => (
                      <span
                        key={adjIdx}
                        className="text-[10px] px-2 py-1 bg-[#F8FF99]/20 text-[#F8FF99] rounded-full"
                      >
                        {adj}
                      </span>
                    ))}
                </div>
              )}
            </div>
          </button>
        ))}

        {/* Show empty state if no nodes available */}
        {currentNodes.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-white/50">
            <p className="text-lg mb-2">
              No {nodesPanelCategory?.toLowerCase()} available
            </p>
            <p className="text-sm">Check back later for more options</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Nodes;
