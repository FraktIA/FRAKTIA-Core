"use client";

import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { GitBranch, CheckCircle, AlertCircle } from "lucide-react";

type LogicNodeData = {
  label: string;
  condition: string;
  configured: boolean;
  expression?: string;
};

export function LogicNode({
  data,
  selected,
}: NodeProps & { data: LogicNodeData }) {
  // Use the label (which contains the actual logic type name) instead of generic condition
  const displayName = data.label || data.condition;

  // Get logic type icon based on the label
  const getLogicIcon = (name: string) => {
    if (name.includes("If/Then")) return "🔀";
    if (name.includes("Switch/Case")) return "🔀";
    if (name.includes("Loop")) return "🔄";
    if (name.includes("Filter")) return "🔍";
    if (name.includes("Transform")) return "⚡";
    if (name.includes("Delay")) return "⏱️";
    return "🔀";
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
              <GitBranch className="w-4 h-4 text-black" />
            </div>
            <span className="text-lg">{getLogicIcon(displayName)}</span>
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
        <p className="text-gray-400 text-xs mb-3 font-mono">LOGIC CONTROL</p>

        {/* Logic Details */}
        <div className="mb-3 p-2 bg-gray-900 rounded-lg border border-gray-800">
          <div className="text-lime-400 text-xs font-bold tracking-wide uppercase mb-1">
            Condition: {data.condition}
          </div>
          {data.expression && (
            <div className="text-gray-400 text-xs font-mono">
              Expression: {data.expression}
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
            {data.configured ? "CONFIGURED" : "SETUP LOGIC"}
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
          id="true"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 bg-red-500 border-2 border-black"
          id="false"
        />
      </div>
    </div>
  );
}
