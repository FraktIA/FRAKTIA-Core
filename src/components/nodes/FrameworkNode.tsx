"use client";

import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Cpu, CheckCircle, AlertCircle } from "lucide-react";

type FrameworkNodeData = {
  label: string;
  framework: "elizaos" | "autogen" | "crewai" | "langchain";
  configured: boolean;
  characterName?: string;
  personality?: string;
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
    autogen: {
      name: "AUTOGEN",
      color: "from-blue-400 to-cyan-500",
      icon: "🔄",
    },
    crewai: {
      name: "CREWAI",
      color: "from-purple-400 to-pink-500",
      icon: "👥",
    },
    langchain: {
      name: "LANGCHAIN",
      color: "from-orange-400 to-red-500",
      icon: "🔗",
    },
  };

  const info = frameworkInfo[data.framework];

  return (
    <div
      className={`relative bg-gradient-to-br ${info.color} p-[2px] rounded-xl ${
        selected
          ? "ring-2 ring-lime-400 ring-opacity-80 shadow-lg shadow-lime-400/20"
          : ""
      } transition-all duration-200 hover:scale-105`}
    >
      <div className="bg-black rounded-xl p-4 min-w-[200px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{info.icon}</span>
            <Cpu className="w-4 h-4 text-gray-500" />
          </div>
          {data.configured ? (
            <CheckCircle className="w-4 h-4 text-lime-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-yellow-400" />
          )}
        </div>

        {/* Title */}
        <h3 className="text-white font-bold text-sm mb-1 tracking-wide">
          {info.name}
        </h3>
        <p className="text-gray-500 text-xs mb-3 font-mono">AI FRAMEWORK</p>

        {/* Character Info - Only show if configured and has characterName */}
        {data.configured && data.characterName && (
          <div className="mb-3 p-2 bg-gray-900 rounded-lg border border-gray-800">
            <div className="text-lime-400 text-xs font-bold tracking-wide uppercase mb-1">
              {data.characterName}
            </div>
            {data.personality && (
              <div className="text-gray-400 max-w-[200px]  text-xs line-clamp-2">
                {data.personality}
              </div>
            )}
          </div>
        )}

        {/* Status */}
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              data.configured ? "bg-lime-400" : "bg-yellow-400"
            }`}
          ></div>
          <span className="text-xs text-gray-400 font-mono">
            {data.configured ? "CONFIGURED" : "NEEDS SETUP"}
          </span>
        </div>

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
