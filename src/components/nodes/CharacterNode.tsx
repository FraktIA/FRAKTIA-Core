import React from "react";
import { Handle, Position } from "@xyflow/react";
import { characterConfigs } from "@/constants/characters";

interface CharacterNodeProps {
  data: {
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
}

export const CharacterNode: React.FC<CharacterNodeProps> = ({ data }) => {
  const characterConfig = data.characterId
    ? characterConfigs[data.characterId as keyof typeof characterConfigs]
    : null;

  const displayName = data.name || data.label;
  const personality =
    data.system ||
    characterConfig?.system ||
    "Character personality not configured";
  const adjectives = data.customAdjectives || characterConfig?.adjectives || [];
  const topics = data.customTopics || characterConfig?.topics || [];
  const enabledPlugins =
    data.plugins?.enabled || characterConfig?.plugins || [];

  return (
    <div className="bg-gradient-to-br from-purple-900 to-indigo-900 border-2 border-purple-400 rounded-lg p-4 min-w-[200px] shadow-lg">
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 bg-purple-400"
      />

      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-400 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">👤</span>
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">{displayName}</h3>
              <p className="text-purple-200 text-xs">Character Node</p>
            </div>
          </div>
          <div
            className={`w-3 h-3 rounded-full ${
              data.configured ? "bg-green-400" : "bg-yellow-400"
            }`}
          />
        </div>

        {/* Personality Preview */}
        <div className="bg-purple-800/50 rounded p-2">
          <p className="text-purple-100 text-xs leading-relaxed line-clamp-2">
            {personality.length > 100
              ? `${personality.substring(0, 100)}...`
              : personality}
          </p>
        </div>

        {/* Character Traits */}
        {adjectives.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {adjectives.slice(0, 3).map((adj, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-purple-700 text-purple-100 text-xs rounded-full"
              >
                {adj}
              </span>
            ))}
            {adjectives.length > 3 && (
              <span className="px-2 py-1 bg-purple-700 text-purple-100 text-xs rounded-full">
                +{adjectives.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Topics */}
        {topics.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {topics.slice(0, 2).map((topic, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-indigo-700 text-indigo-100 text-xs rounded-full"
              >
                {topic}
              </span>
            ))}
            {topics.length > 2 && (
              <span className="px-2 py-1 bg-indigo-700 text-indigo-100 text-xs rounded-full">
                +{topics.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Configuration Status */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span
              className={`w-2 h-2 rounded-full ${
                data.configured ? "bg-green-400" : "bg-yellow-400"
              }`}
            />
            <span className="text-purple-200">
              {data.configured ? "Configured" : "Needs Setup"}
            </span>
          </div>

          {/* Voice and Behavior Info */}
          <div className="text-right text-purple-200">
            {data.characterVoice && (
              <div className="text-xs">
                <span className="text-purple-300">Voice:</span>{" "}
                {data.characterVoice.model}
              </div>
            )}
            {data.behavior && (
              <div className="text-xs">
                <span className="text-purple-300">Style:</span>{" "}
                {data.behavior.responseStyle}
              </div>
            )}
          </div>
        </div>

        {/* Plugins */}
        {enabledPlugins.length > 0 && (
          <div className="flex items-center space-x-1">
            <span className="text-purple-300 text-xs">Plugins:</span>
            <div className="flex space-x-1">
              {enabledPlugins.slice(0, 2).map((plugin, index) => (
                <span
                  key={index}
                  className="w-2 h-2 bg-purple-400 rounded-full"
                  title={plugin}
                />
              ))}
              {enabledPlugins.length > 2 && (
                <span className="text-purple-300 text-xs">
                  +{enabledPlugins.length - 2}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-purple-400"
      />
    </div>
  );
};
