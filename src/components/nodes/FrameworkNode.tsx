"use client";

import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { AlertCircle, CheckCircle, Cpu } from "lucide-react";
import { CharacterConfig } from "@/types/nodes";

type FrameworkNodeData = {
  label: string;
  framework: "elizaos" | "copilot" | "crewai" | "langgraph";
  configured: boolean;
  characterName?: string;
  personality?: string;
  character?: CharacterConfig; // Character configuration object
};

export function FrameworkNode({
  data,
  selected,
}: NodeProps & { data: FrameworkNodeData }) {
  const frameworkInfo = {
    elizaos: {
      name: "ELIZAOS",
      color: "from-lime-400 to-green-500",
      icon: "🤖",
    },
    copilot: {
      name: "COPILOT",
      color: "from-blue-400 to-cyan-500",
      icon: "🔄",
    },
    crewai: {
      name: "CREWAI",
      color: "from-purple-400 to-pink-500",
      icon: "👥",
    },
    langgraph: {
      name: "LANGGRAPH",
      color: "from-orange-400 to-red-500",
      icon: "🔗",
    },
  };

  const info = frameworkInfo[data.framework];

  // Check if this is a character node
  const isCharacterNode = data.character || data.characterName;
  const displayName = isCharacterNode
    ? data.characterName || data.label
    : info.name;
  const displayType = isCharacterNode ? "AI CHARACTER" : "AI FRAMEWORK";

  return (
    <div
      className={`relative bg-black border-2 ${
        selected ? "border-lime-400 shadow-glow" : "border-gray-800"
      } rounded-lg transition-all duration-300 hover:border-lime-400/50`}
    >
      <div className="p-4 w-[240px] h-[220px] 5xl:w-[280px] 5xl:h-[260px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center">
              <Cpu className="w-4 h-4 text-black" />
            </div>
            <span className="text-lg">{info.icon}</span>
          </div>
          {data.configured ? (
            <CheckCircle className="w-5 h-5 text-lime-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-yellow-400" />
          )}
        </div>

        {/* Title */}
        <h3 className="text-white font-bold text-sm mb-1 tracking-wide">
          {displayName}
        </h3>
        <p className="text-gray-400 text-xs mb-3 font-mono">
          {displayType} • {info.name}
        </p>

        {/* Framework Details */}
        <div className="mb-3 p-2 bg-gray-900 rounded-lg border border-gray-800">
          <div className="text-lime-400 text-xs font-bold tracking-wide uppercase mb-1">
            {info.name}
          </div>
          {data.personality && (
            <div className="text-gray-400 text-xs">
              {data.personality.length > 40
                ? `${data.personality.substring(0, 40)}...`
                : data.personality}
            </div>
          )}
          {data.character?.adjectives && (
            <div className="text-gray-400 text-xs">
              Traits: {data.character.adjectives.slice(0, 2).join(", ")}
            </div>
          )}
        </div>

        {/* Status */}
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              data.configured ? "bg-lime-400" : "bg-yellow-400"
            }`}
          ></div>
          <span className="text-xs text-gray-300 font-medium tracking-wide">
            {data.configured ? "READY" : "SETUP REQUIRED"}
          </span>
        </div>

        {/* Handles */}
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-lime-400 border-2 border-black"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-lime-400 border-2 border-black"
        />
      </div>
    </div>
  );
}
