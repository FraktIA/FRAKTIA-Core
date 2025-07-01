"use client";

import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Puzzle, CheckCircle, AlertCircle } from "lucide-react";

type PluginNodeData = {
  label: string;
  service: string;
  configured: boolean;
  endpoint?: string;
};

export function PluginNode({
  data,
  selected,
}: NodeProps & { data: PluginNodeData }) {
  // Use the label (which contains the actual plugin service name) instead of generic service
  const displayName = data.label || data.service;

  // Get plugin service icon based on the label
  const getPluginIcon = (name: string) => {
    if (name.includes("Web Scraper")) return "🕷️";
    if (name.includes("Database")) return "🗄️";
    if (name.includes("API Gateway")) return "🚪";
    if (name.includes("Analytics")) return "📊";
    if (name.includes("Twitter")) return "🐦";
    if (name.includes("Discord")) return "💬";
    if (name.includes("Telegram")) return "📱";
    if (name.includes("Blockchain")) return "⛓️";
    return "🔌";
  };

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
              <Puzzle className="w-4 h-4 text-black" />
            </div>
            <span className="text-lg">{getPluginIcon(displayName)}</span>
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
          PLUGIN SERVICE • INTEGRATION
        </p>

        {/* Plugin Details */}
        <div className="mb-3 p-2 bg-gray-900 rounded-lg border border-gray-800">
          <div className="text-lime-400 text-xs font-bold tracking-wide uppercase mb-1">
            {data.service}
          </div>
          <div className="text-gray-400 text-xs">
            {data.endpoint
              ? `Endpoint: ${data.endpoint.substring(0, 20)}...`
              : "No endpoint configured"}
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
            {data.configured ? "CONNECTED" : "SETUP REQUIRED"}
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
