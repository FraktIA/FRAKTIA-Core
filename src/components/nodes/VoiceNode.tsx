"use client";

import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import Image from "next/image";

type VoiceNodeData = {
  label: string;
  voice: string;
  configured: boolean;
  description?: string;
};

export function VoiceNode({
  data,
  selected,
}: NodeProps & { data: VoiceNodeData }) {
  const displayName = data.label || data.voice;

  const getVoiceIcon = (name: string) => {
    if (name.includes("ElevenLabs"))
      return "https://elevenlabs.io/images/favicon.png";
    return "/icons/voice.min.svg";
  };

  return (
    <div
      className={`relative bg-dark border-2 ${
        selected
          ? "border-primary shadow-glow-primary"
          : "border-gray-800 hover:border-primary/50"
      } rounded-xl transition-all duration-300 w-[240px] shadow-lg`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900/50 rounded-lg flex items-center justify-center p-1 border border-gray-700">
              <Image
                src={getVoiceIcon(displayName)}
                alt={`${displayName} icon`}
                width={28}
                height={28}
                className="rounded"
              />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm tracking-wide">
                {displayName}
              </h3>
              <p className="text-gray-400 text-xs font-mono">VOICE NODE</p>
            </div>
          </div>
          <div
            className={`w-3 h-3 rounded-full ${
              data.configured ? "bg-green-400" : "bg-yellow-400"
            } shadow-md border-2 border-dark`}
          />
        </div>

        {/* Description */}
        <p className="text-gray-300 text-xs leading-relaxed mb-4 min-h-[30px]">
          {data.description || "High-quality text-to-speech synthesis."}
        </p>

        {/* Configuration Status */}
        <div className="flex items-center space-x-2 text-xs font-mono text-gray-500">
          <div
            className={`w-2 h-2 rounded-full ${
              data.configured ? "bg-green-400" : "bg-yellow-400"
            }`}
          />
          <span>{data.configured ? "Configured" : "Needs Setup"}</span>
        </div>

        {/* Handles */}
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 !bg-primary border-2 border-dark"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 !bg-primary border-2 border-dark"
        />
      </div>
    </div>
  );
}
