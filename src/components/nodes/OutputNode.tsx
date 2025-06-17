"use client";

import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

type OutputNodeData = {
  label: string;
  type: string;
  configured: boolean;
};

export function OutputNode({
  data,
  selected,
}: NodeProps & { data: OutputNodeData }) {
  const outputInfo: Record<string, { name: string; icon: string }> = {
    text: { name: "Text Response", icon: "💬" },
    voice: { name: "Voice Response", icon: "🎵" },
    action: { name: "Action", icon: "⚡" },
    file: { name: "File Output", icon: "📄" },
    api: { name: "API Call", icon: "🔌" },
  };

  const info = outputInfo[data.type] || outputInfo.text;

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
              <Send className="w-4 h-4 text-black" />
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
          {info.name}
        </h3>
        <p className="text-gray-400 text-xs mb-3 font-mono">Output</p>

        {/* Status */}
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              data.configured ? "bg-lime-400" : "bg-yellow-400"
            }`}
          ></div>
          <span className="text-xs text-gray-300 font-medium tracking-wide">
            {data.configured ? "READY" : "CONFIGURE OUTPUT"}
          </span>
        </div>

        {/* Handles */}
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-lime-400 border-2 border-black"
        />
      </div>
    </div>
  );
}
