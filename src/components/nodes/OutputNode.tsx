"use client";

import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Send, CheckCircle, AlertCircle } from "lucide-react";

type OutputNodeData = {
  label: string;
  type: string;
  configured: boolean;
  template?: string;
};

export function OutputNode({
  data,
  selected,
}: NodeProps & { data: OutputNodeData }) {
  // Use the label (which contains the actual output type name) instead of generic type
  const displayName = data.label || data.type;

  // Get output type icon based on the label
  const getOutputIcon = (name: string) => {
    if (name.includes("Chat Output")) return "💬";
    if (name.includes("API Output")) return "🔌";
    if (name.includes("File Output")) return "📄";
    if (name.includes("Voice Response")) return "🎵";
    if (name.includes("Action")) return "⚡";
    return "📤";
  };

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
            <span className="text-lg">{getOutputIcon(displayName)}</span>
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
        <p className="text-gray-400 text-xs mb-3 font-mono">OUTPUT CHANNEL</p>

        {/* Output Details */}
        <div className="mb-3 p-2 bg-gray-900 rounded-lg border border-gray-800">
          <div className="text-lime-400 text-xs font-bold tracking-wide uppercase mb-1">
            Type: {data.type}
          </div>
          {data.template && (
            <div className="text-gray-400 text-xs font-mono">
              Template: {data.template.substring(0, 30)}...
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
