"use client";

import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Brain, CheckCircle, AlertCircle } from "lucide-react";
import { ModelNodeData } from "@/types/nodeData";

// type ModelNodeData = {
//   label: string;
//   model: string;
//   provider: "openai" | "anthropic" | "google" | "meta" | "local" | "deepseek";
//   configured: boolean;
// };

export function ModelNode({
  data,
  selected,
}: NodeProps & { data: ModelNodeData }) {
  const providerInfo = {
    openai: { name: "OpenAI", accent: "lime-400", icon: "🤖" },
    anthropic: { name: "Anthropic", accent: "lime-400", icon: "🧠" },
    google: { name: "Google", accent: "lime-400", icon: "🔍" },
    meta: { name: "Meta", accent: "lime-400", icon: "🦙" },
    deepseek: { name: "Deepseek", accent: "lime-400", icon: "💻" },
    local: { name: "Local", accent: "lime-400", icon: "💻" },
  };

  const info = providerInfo[data.provider];

  // Use the label (which contains the actual model name) instead of data.model
  const displayName = data.label || data.model;

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
              <Brain className="w-4 h-4 text-black" />
            </div>
          </div>
          {data.configured ? (
            <CheckCircle className="w-5 h-5 text-lime-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-yellow-400" />
          )}
        </div>

        {/* Title */}
        <h3 className="text-white capitalize font-bold text-sm mb-1 tracking-wide">
          {displayName}
        </h3>
        <p className="text-gray-400 text-xs mb-3 font-mono">
          AI MODEL • {info.name}
        </p>

        {/* Model Details */}
        <div className="mb-3 p-2 bg-gray-900 rounded-lg border border-gray-800">
          <div className="text-lime-400 text-xs font-bold tracking-wide uppercase mb-1">
            {data.model_small && data.model_small.length > 18
              ? `${data.model_small.substring(0, 18)}...`
              : data.model_small}
          </div>
          <div className="text-lime-400 text-xs font-bold tracking-wide uppercase mb-1">
            {data.model_large && data.model_large.length > 18
              ? `${data.model_large.substring(0, 18)}...`
              : data.model_large}
          </div>
        </div>

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
