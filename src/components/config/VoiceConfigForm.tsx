import React, { useState, useCallback } from "react";
import { ChevronDown, ChevronUp, Mic, Settings } from "lucide-react";
import { Checkmark } from "../Checkmark";
import { VoiceNodeData } from "@/types/nodeData";

interface VoiceConfigFormProps {
  localNodeData: VoiceNodeData;
  handleInputChange: (field: string, value: string) => void;
}

const VoiceConfigForm: React.FC<VoiceConfigFormProps> = ({
  localNodeData,
  handleInputChange,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    voice: true,
    settings: false,
  });

  const toggleSection = useCallback((section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section as keyof typeof prev]: !prev[section as keyof typeof prev],
    }));
  }, []);

  const SectionHeader = useCallback(
    ({
      title,
      icon: Icon,
      section,
    }: {
      title: string;
      icon: React.ComponentType<{ size?: number; className?: string }>;
      section: string;
    }) => (
      <div
        className="flex items-center justify-between cursor-pointer group"
        onClick={() => toggleSection(section)}
      >
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-primary" />
          <h3 className="text-sm font-semibold text-white tracking-wide">
            {title}
          </h3>
        </div>
        {expandedSections[section as keyof typeof expandedSections] ? (
          <ChevronUp
            size={16}
            className="text-white/50 group-hover:text-white/70 transition-colors"
          />
        ) : (
          <ChevronDown
            size={16}
            className="text-white/50 group-hover:text-white/70 transition-colors"
          />
        )}
      </div>
    ),
    [expandedSections, toggleSection]
  );

  return (
    <div className="space-y-6 h-full p-6 relative">
      {/* Status Indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Checkmark className="w-4 h-4 text-green-400 drop-shadow-lg" />
        <span className="text-green-400 text-[10px] font-bold capitalize">
          Ready
        </span>
      </div>

      {/* Voice Selection */}
      <div className="space-y-4">
        <SectionHeader title="Voice Selection" icon={Mic} section="voice" />

        {expandedSections.voice && (
          <div className="space-y-4 pl-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                Voice Model
              </label>
              <select
                value={String(localNodeData.voice || "en_US-hfc_male-medium")}
                onChange={(e) => handleInputChange("voice", e.target.value)}
                className="w-full p-3 bg-bg border border-bg rounded-sm text-white focus:outline-none focus:ring-[0.5px] focus:ring-primary text-sm transition-all duration-300"
              >
                <option value="en_US-hfc_male-medium">
                  en_US-hfc_male-medium
                </option>
                <option value="en_US-hfc_female-medium">
                  en_US-hfc_female-medium
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                Language
              </label>
              <select
                value={String(localNodeData.language || "en")}
                onChange={(e) => handleInputChange("language", e.target.value)}
                className="w-full p-3 bg-bg border border-bg rounded-sm text-white focus:outline-none focus:ring-[0.5px] focus:ring-primary text-sm transition-all duration-300"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
                <option value="pt">Portuguese</option>
                <option value="zh">Chinese</option>
                <option value="ja">Japanese</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Voice Settings */}
      <div className="space-y-4">
        <SectionHeader
          title="Voice Settings"
          icon={Settings}
          section="settings"
        />

        {expandedSections.settings && (
          <div className="space-y-4 pl-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                Speed ({localNodeData.speed || 1.0})
              </label>
              <input
                type="range"
                min="0.25"
                max="4.0"
                step="0.25"
                value={localNodeData.speed || 1.0}
                onChange={(e) => handleInputChange("speed", e.target.value)}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-xs text-white/50 mt-1">
                <span>Slow</span>
                <span>Normal</span>
                <span>Fast</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceConfigForm;
