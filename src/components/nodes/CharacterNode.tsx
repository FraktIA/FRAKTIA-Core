import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { User, CheckCircle, AlertCircle } from "lucide-react";
import { characterConfigs } from "@/constants/characters";

type CharacterNodeData = {
  label: string;
  configured: boolean;
  characterId?: string;
  name?: string;
  system?: string;
  customPersonality?: string;
  customAdjectives?: string[];
  customTopics?: string[];
  characterVoice?: {
    model: string;
    language?: string;
    speed?: number;
  };
  behavior?: {
    temperature: number;
    responseStyle: string;
  };
  plugins?: {
    enabled: string[];
  };
};

export const CharacterNode: React.FC<
  NodeProps & { data: CharacterNodeData }
> = ({ data, selected }) => {
  const characterConfig = data.characterId
    ? characterConfigs[data.characterId as keyof typeof characterConfigs]
    : null;

  const displayName = data.name || data.label;
  const personality =
    data.system ||
    characterConfig?.system ||
    "Character personality not configured";
  const adjectives = data.customAdjectives || characterConfig?.adjectives || [];

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
              <User className="w-4 h-4 text-black" />
            </div>
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
          CHARACTER • AI AGENT
        </p>

        {/* Character Details */}
        <div className="mb-3 p-2 bg-gray-900 rounded-lg border border-gray-800">
          <div className="text-lime-400 text-xs font-bold tracking-wide uppercase mb-1">
            {personality.length > 20
              ? `${personality.substring(0, 20)}...`
              : personality}
          </div>
          {adjectives.length > 0 && (
            <div className="text-gray-400 text-xs">
              Traits: {adjectives.slice(0, 2).join(", ")}
              {adjectives.length > 2 && ` +${adjectives.length - 2}`}
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
            {data.configured ? "READY" : "CONFIGURE PROFILE"}
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
};
