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
        selected ? "border-lime-400 shadow-glow" : "border-gray-800"
      } rounded-lg transition-all duration-300 hover:border-lime-400/50`}
    >
      <div className="p-4 w-[240px] h-[220px] 5xl:w-[280px] 5xl:h-[260px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center">
              <Image
                src={"/icons/voice.svg"}
                alt={`${displayName} icon`}
                width={16}
                height={16}
                className="rounded"
              />
            </div>
          </div>
          {data.configured ? (
            <div className="w-5 h-5 text-lime-400">✓</div>
          ) : (
            <div className="w-5 h-5 text-yellow-400">!</div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-white font-bold text-sm mb-1 tracking-wide">
          {getVoiceDisplayName(data.voice)}
        </h3>
        <p className="text-gray-400 text-xs mb-3 font-mono">
          VOICE SYNTHESIS • AI AUDIO
        </p>

        {/* Voice Details */}
        <div className="mb-3 p-2 bg-gray-900 rounded-lg border border-gray-800">
          <div className="text-lime-400 text-xs font-bold tracking-wide uppercase mb-1">
            {data.voice || "en_US-hfc_male-medium"}
          </div>
          <div className="text-gray-400 text-xs">
            Language: {data.language || "en"} • Speed: {data.speed || 1.0}x
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
            {data.configured ? "READY" : "CONFIGURE VOICE"}
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
