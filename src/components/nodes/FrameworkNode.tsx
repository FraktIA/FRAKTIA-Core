"use client";

import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Cpu } from "lucide-react";
import { Checkmark } from "../Checkmark";
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
      className={`relative bg-gradient-to-br ${info.name} p-[2px] rounded-xl ${
        selected
          ? "ring-2 ring-lime-400 ring-opacity-80 shadow-lg shadow-lime-400/20"
          : ""
      } transition-all duration-200 hover:scale-105`}
    >
      <div className="bg-black rounded-xl p-4 min-w-[200px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <Cpu className="w-4 h-4 text-gray-500" />
          <Checkmark />
        </div>

        {/* Title */}
        <h3 className="text-white font-bold text-sm mb-1 tracking-wide">
          {displayName}
        </h3>
        <p className="text-gray-500 text-xs mb-3 font-mono">{displayType}</p>

        {/* Character Info - Show if character is configured or if it's a character node */}
        {(data.configured && data.characterName) || isCharacterNode ? (
          <div className="mb-3 p-2 bg-gray-900 rounded-lg border border-gray-800">
            <div className="text-lime-400 text-xs font-bold tracking-wide uppercase">
              {data.characterName || data.label}
            </div>
            {data.personality && (
              <div className="text-gray-400 max-w-[200px] text-xs line-clamp-2">
                {data.personality}
              </div>
            )}
            {/* Show character adjectives if available */}
            {data.character?.adjectives && (
              <div className="flex flex-wrap gap-1 mt-2">
                {data.character.adjectives
                  .slice(0, 2)
                  .map((adj: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-[8px] px-1.5 py-0.5 bg-lime-400/20 text-lime-400 rounded-full"
                    >
                      {adj}
                    </span>
                  ))}
              </div>
            )}
          </div>
        ) : null}

        {/* Status */}
        {/* <div className="flex items-center space-x-2 mt-2">
          <Checkmark />
          <span className="text-xs text-primary font-bold uppercase">
            Configured
          </span>
        </div> */}

        {/* Handles */}
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-lime-400 border-2 border-black shadow-lg shadow-lime-400/20"
        />
      </div>
    </div>
  );
}
