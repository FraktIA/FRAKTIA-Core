"use client";

import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Brain, CheckCircle, AlertCircle } from "lucide-react";

type ModelNodeData = {
  label: string;
  model: string;
  provider: "openai" | "anthropic" | "google" | "meta" | "local";
  configured: boolean;
};

export function ModelNode({
  data,
  selected,
}: NodeProps & { data: ModelNodeData }) {
  const providerInfo = {
    openai: { name: "OpenAI", accent: "lime-400", icon: "🤖" },
    anthropic: { name: "Anthropic", accent: "lime-400", icon: "🧠" },
    google: { name: "Google", accent: "lime-400", icon: "🔍" },
    meta: { name: "Meta", accent: "lime-400", icon: "🦙" },
    local: { name: "Local", accent: "lime-400", icon: "💻" },
  };

  const info = providerInfo[data.provider];

  return (
    <div
      className={`relative bg-black border-2 ${
        selected ? "border-lime-400 shadow-glow" : "border-gray-800"
      } rounded-lg transition-all duration-300 hover:border-lime-400/50`}
    >
      <div className="p-4 min-w-[200px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-black" />
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
        <h3 className="text-white font-bold text-sm mb-1 tracking-wide uppercase">
          {data.model}
        </h3>
        <p className="text-gray-400 text-xs mb-3 font-mono">{info.name}</p>

        {/* Status */}
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              data.configured ? "bg-lime-400" : "bg-yellow-400"
            }`}
          ></div>
          <span className="text-xs text-gray-300 font-medium tracking-wide">
            {data.configured ? "READY" : "CONFIGURE API"}
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
