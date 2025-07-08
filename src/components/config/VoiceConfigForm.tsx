import React, { useState, useCallback, useEffect } from "react";
import { Mic, Settings } from "lucide-react";
// import { Checkmark } from "../Checkmark";
import { VoiceConfigFormProps } from "@/types/configForms";
import SectionHeader from "./SectionHeader";
import FormSelect from "../form/FormSelect";

const VoiceConfigForm: React.FC<VoiceConfigFormProps> = ({
  localNodeData,
  handleInputChange,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    voice: true,
    settings: false,
  });

  // Validation function to check if the voice node should be marked as configured
  const isVoiceConfigured = useCallback(() => {
    return !!(localNodeData.voice && localNodeData.voice.trim() !== "");
  }, [localNodeData.voice]);

  // Effect to update configured status whenever validation criteria changes
  useEffect(() => {
    const configured = isVoiceConfigured();
    if (localNodeData.configured !== configured) {
      handleInputChange("configured", configured);
    }
  }, [
    localNodeData.voice,
    localNodeData.configured,
    handleInputChange,
    isVoiceConfigured,
  ]);

  const toggleSection = useCallback((section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section as keyof typeof prev]: !prev[section as keyof typeof prev],
    }));
  }, []);

  return (
    <div className="space-y-6 h-full p-6 relative">
      {/* Status Indicator */}
      {/* <div className="absolute top-4 right-4 flex items-center gap-2">
        <Checkmark className="w-4 h-4 text-green-400 drop-shadow-lg" />
        <span className="text-green-400 text-[10px] font-bold capitalize">
          Ready
        </span>
      </div> */}

      {/* Voice Selection */}
      <div className="space-y-4">
        <SectionHeader
          title="Voice Selection"
          icon={Mic}
          section="voice"
          isExpanded={expandedSections.voice}
          onToggle={toggleSection}
        />

        {expandedSections.voice && (
          <div className="space-y-4 pl-6">
            <FormSelect
              label="Voice Model"
              value={String(localNodeData.voice || "en_US-hfc_male-medium")}
              onChange={(value) => handleInputChange("voice", value)}
              options={[
                {
                  value: "en_US-hfc_male-medium",
                  label: "en_US-hfc_male-medium",
                },
                {
                  value: "en_US-hfc_female-medium",
                  label: "en_US-hfc_female-medium",
                },
              ]}
            />

            <FormSelect
              label="Language"
              value={String(localNodeData.language || "en")}
              onChange={(value) => handleInputChange("language", value)}
              options={[
                { value: "en", label: "English" },
                // { value: "es", label: "Spanish" },
                // { value: "fr", label: "French" },
                // { value: "de", label: "German" },
                // { value: "it", label: "Italian" },
                // { value: "pt", label: "Portuguese" },
                // { value: "zh", label: "Chinese" },
                // { value: "ja", label: "Japanese" },
              ]}
            />
          </div>
        )}
      </div>

      {/* Voice Settings */}
      <div className="space-y-4">
        <SectionHeader
          title="Voice Settings"
          icon={Settings}
          section="settings"
          isExpanded={expandedSections.settings}
          onToggle={toggleSection}
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
                max="2"
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
