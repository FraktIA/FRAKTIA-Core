import Image from "next/image";
import React from "react";
import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectActiveNav, setShowNodesPanel } from "@/redux/slices/uiSlice";

interface NodePanelProps {
  onAddNode?: (nodeType: string, position?: { x: number; y: number }) => void;
  onOpenTemplates?: () => void;
}

// Node data organized by category
const nodeData = {
  Framework: [
    {
      name: "Eliza OS",
      description:
        "A powerful extensible framework designed for building conversational AI agents with advanced",
      highlight: true,
      icon: "/icons/framework.svg",
    },
    {
      name: "LangGraph",
      description:
        "Build resilient language agents as graphs with built-in persistence and human-in-the-loop capabilities",
      highlight: false,
      icon: "/icons/framework.svg",
    },
    {
      name: "LangChain",
      description:
        "A framework for developing applications powered by language models with chain-of-thought reasoning",
      highlight: false,
      icon: "/icons/framework.svg",
    },
    {
      name: "AutoGen",
      description:
        "Multi-agent conversation framework enabling multiple AI agents to collaborate and solve complex tasks",
      highlight: false,
      icon: "/icons/framework.svg",
    },
  ],
  "AI Model": [
    {
      name: "Claude",
      description:
        "Anthropic's advanced AI assistant with superior reasoning and safety capabilities for complex tasks",
      highlight: true,
      icon: "/icons/brain.svg",
    },
    {
      name: "OpenAI GPT-4",
      description:
        "OpenAI's most capable multimodal model with enhanced reasoning and creative problem-solving abilities",
      highlight: false,
      icon: "/icons/brain.svg",
    },
    {
      name: "DeepSeek",
      description:
        "High-performance AI model optimized for code generation and mathematical reasoning tasks",
      highlight: false,
      icon: "/icons/brain.svg",
    },
    {
      name: "Gemini Pro",
      description:
        "Google's advanced AI model with multimodal capabilities and strong performance across diverse domains",
      highlight: false,
      icon: "/icons/brain.svg",
    },
  ],
  Voice: [
    {
      name: "ElevenLabs",
      description:
        "Premium AI voice synthesis with natural intonation and emotion for realistic speech generation",
      highlight: true,
      icon: "/icons/voice.svg",
    },
    {
      name: "OpenAI Whisper",
      description:
        "Robust speech recognition system with multilingual support and high accuracy transcription",
      highlight: false,
      icon: "/icons/voice.svg",
    },
    {
      name: "Azure Speech",
      description:
        "Microsoft's cloud-based speech services with real-time transcription and text-to-speech capabilities",
      highlight: false,
      icon: "/icons/voice.svg",
    },
    {
      name: "Google Cloud Speech",
      description:
        "Advanced speech recognition and synthesis with support for 125+ languages and variants",
      highlight: false,
      icon: "/icons/voice.svg",
    },
  ],
  Character: [
    {
      name: "Personality Core",
      description:
        "Define unique character traits, behaviors, and communication styles for your AI agent",
      highlight: true,
      icon: "/icons/character.svg",
    },
    {
      name: "Memory System",
      description:
        "Advanced memory management for maintaining context and learning from past interactions",
      highlight: false,
      icon: "/icons/character.svg",
    },
    {
      name: "Emotion Engine",
      description:
        "Emotional intelligence system for natural and empathetic conversational responses",
      highlight: false,
      icon: "/icons/character.svg",
    },
    {
      name: "Backstory Builder",
      description:
        "Create rich character backgrounds and histories to enhance authenticity and depth",
      highlight: false,
      icon: "/icons/character.svg",
    },
  ],
  "Add-ons": [
    {
      name: "Web Scraper",
      description:
        "Extract and process web content for real-time information gathering and analysis",
      highlight: true,
      icon: "/icons/add-ons.svg",
    },
    {
      name: "Database Connector",
      description:
        "Connect to various databases for data retrieval, storage, and management capabilities",
      highlight: false,
      icon: "/icons/add-ons.svg",
    },
    {
      name: "API Gateway",
      description:
        "Manage external API integrations and handle authentication for third-party services",
      highlight: false,
      icon: "/icons/add-ons.svg",
    },
    {
      name: "Analytics Dashboard",
      description:
        "Monitor agent performance, track conversations, and analyze user interaction patterns",
      highlight: false,
      icon: "/icons/add-ons.svg",
    },
  ],
};

const Nodes = ({ onAddNode }: NodePanelProps) => {
  const dispatch = useAppDispatch();
  const activeNav = useAppSelector(selectActiveNav);

  // Get the current nodes based on active navigation
  const currentNodes = nodeData[activeNav as keyof typeof nodeData] || [];

  return (
    <section className="min-w-[26%] rounded-tl-[20px]  bg-dark  pl-5 h-[100%]   flex flex-col">
      <div className="flex  py-5  flex-col gap-1">
        <h1 className="text-[20px] text-white">{activeNav}</h1>
        <p className="text-white/70 text-xs font-light">
          {`Select Your preferred ${activeNav?.toLowerCase()} `}
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
            className={`rounded-3xl border-4 ${
              node.highlight
                ? "border-[#F8FF99]"
                : "border-transparent ring-[1px] ring-inset ring-white/8"
            } bg-bg w-[270px] h-[196px] p-6  flex flex-col gap-4 shadow-lg hover:border-[#F8FF99]/50 transition-all duration-200`}
            onClick={() =>
              onAddNode && onAddNode(node.name, { x: 100, y: 100 })
            }
          >
            <div className="flex items-start justify-between">
              {/* Dynamic icon based on node type */}
              <Image src={node.icon} width={32} height={32} alt={node.name} />
              {/* 3-dot menu */}
              <span className="flex items-center justify-center w-8 h-8">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="6" r="1.5" fill="#fff" />
                  <circle cx="12" cy="12" r="1.5" fill="#fff" />
                  <circle cx="12" cy="18" r="1.5" fill="#fff" />
                </svg>
              </span>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <span className=" font-semibold text-white leading-tight">
                {node.name}
              </span>
              <p className="text-xs font-light text-white leading-snug break-words">
                {node.description}
              </p>
            </div>
          </button>
        ))}

        {/* Show empty state if no nodes available */}
        {currentNodes.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-white/50">
            <p className="text-lg mb-2">
              No {activeNav?.toLowerCase()} available
            </p>
            <p className="text-sm">Check back later for more options</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Nodes;
