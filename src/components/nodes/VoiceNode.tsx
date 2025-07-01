"use client";

import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import Image from "next/image";

type VoiceNodeData = {
  label: string;
  voice: string;
  language?: string;
  speed?: number;
  configured: boolean;
  description?: string;
};

export function VoiceNode({
  data,
  selected,
}: NodeProps & { data: VoiceNodeData }) {
  const displayName = data.label || "Voice Synthesis";

  const getVoiceDisplayName = (voice: string) => {
    if (!voice) return "Default Voice";
    if (voice === "en_US-hfc_male-medium") return "Piper Male";
    if (voice === "en_US-hfc_female-medium") return "Piper Female";
    if (voice === "elevenlabs") return "ElevenLabs";
    return voice;
  };

  return (
    <div
      className={`relative bg-black border-2 ${
        selected
          ? "border-primary shadow-glow-primary"
          : "border-gray-800 hover:border-primary/50"
      } rounded-lg transition-all duration-300 min-w-[200px] shadow-lg`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-900/50 rounded-lg flex items-center justify-center p-1 border border-gray-700">
              <Image
                src={"/icons/voice.svg"}
                alt={`${displayName} icon`}
                width={28}
                height={28}
                className="rounded"
              />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm tracking-wide">
                {getVoiceDisplayName(data.voice)}
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
          {data.description || "AI-powered voice synthesis"}
        </p>

        {/* Voice Details */}
        <div className="mb-3 p-2 bg-gray-900 rounded-lg border border-gray-800">
          <div className="text-primary text-xs font-bold tracking-wide uppercase mb-1">
            {data.voice || "en_US-hfc_male-medium"}
          </div>
          <div className="text-gray-400 text-xs">
            Language: {data.language || "en"} • Speed: {data.speed || 1.0}x
          </div>
        </div>

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
          className="w-3 h-3 bg-primary border-2 border-black"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-primary border-2 border-black"
        />
      </div>
    </div>
  );
}
