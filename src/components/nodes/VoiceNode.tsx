"use client";

import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Mic, CheckCircle, AlertCircle } from "lucide-react";

type VoiceNodeData = {
  label: string;
  voice: string;
  language: string;
  configured: boolean;
};

export function VoiceNode({
  data,
  selected,
}: NodeProps & { data: VoiceNodeData }) {
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
              <Mic className="w-4 h-4 text-black" />
            </div>
            <span className="text-lg">🎙️</span>
          </div>
          {data.configured ? (
            <CheckCircle className="w-5 h-5 text-lime-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-yellow-400" />
          )}
        </div>

        {/* Title */}
        <h3 className="text-white font-bold text-sm mb-1 tracking-wide uppercase">
          VOICE: {data.voice}
        </h3>
        <p className="text-gray-400 text-xs mb-3 font-mono">
          Language: {data.language}
        </p>

        {/* Status */}
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              data.configured ? "bg-lime-400" : "bg-yellow-400"
            }`}
          ></div>
          <span className="text-xs text-gray-300 font-medium tracking-wide">
            {data.configured ? "VOICE READY" : "SETUP VOICE"}
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
