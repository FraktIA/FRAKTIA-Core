import React, { useState, useCallback, memo, useEffect } from "react";
import { Key, Target } from "lucide-react";
import { DiscordPluginFormProps } from "@/types/configForms";
import FormInput from "../form/FormInput";
import SectionHeader from "./SectionHeader";
import Link from "next/link";

const DiscordPluginForm: React.FC<DiscordPluginFormProps> = ({
  localNodeData,
  handleInputChange,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    auth: true,
    basic: false,
    messaging: false,
    moderation: false,
  });

  // Validation function to check if the Discord plugin is configured
  const isDiscordConfigured = useCallback(() => {
    return !!(
      localNodeData.discordApplicationId &&
      localNodeData.discordApplicationId.trim() !== "" &&
      localNodeData.discordApiToken &&
      localNodeData.discordApiToken.trim() !== ""
    );
  }, [localNodeData.discordApplicationId, localNodeData.discordApiToken]);

  // Effect to update configured status whenever validation criteria changes
  useEffect(() => {
    const configured = isDiscordConfigured();
    if (localNodeData.configured !== configured) {
      handleInputChange("configured", configured);
    }
  }, [
    localNodeData.discordApplicationId,
    localNodeData.discordApiToken,
    localNodeData.configured,
    handleInputChange,
    isDiscordConfigured,
  ]);

  const toggleSection = useCallback((section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section as keyof typeof prev]: !prev[section as keyof typeof prev],
    }));
  }, []);

  return (
    <div className="space-y-6 h-full p-1 relative">
      {/* Instructions */}
      <p className="text-sm mb-4 ">
        <Link
          className="text-primary underline"
          target="_blank"
          href={"https://github.com/elizaos-plugins/plugin-discord"}
        >
          -Instructions
        </Link>
      </p>
      {/* Discord Authentication */}
      <div className="space-y-4">
        <SectionHeader
          title="Authentication"
          icon={Key}
          section="auth"
          isExpanded={expandedSections.auth}
          onToggle={toggleSection}
        />

        {expandedSections.auth && (
          <div className="space-y-4 pl-6">
            <FormInput
              label="Discord Application ID"
              value={localNodeData.discordApplicationId || ""}
              onChange={(value) =>
                handleInputChange("discordApplicationId", value)
              }
              type="text"
              placeholder="Your Discord Application ID"
              required
            />
            <FormInput
              label="Discord API Token"
              value={localNodeData.discordApiToken || ""}
              onChange={(value) => handleInputChange("discordApiToken", value)}
              type="password"
              placeholder="Your Discord Bot Token"
              required
            />
          </div>
        )}
      </div>

      {/* Discord Moderation Settings */}
      <div className="space-y-4">
        <SectionHeader
          title="Moderation & Access"
          icon={Target}
          section="moderation"
          isExpanded={expandedSections.moderation}
          onToggle={toggleSection}
        />

        {expandedSections.moderation && (
          <div className="space-y-4 pl-6">
            <FormInput
              label="Channel IDs (Optional)"
              value={localNodeData.discordTargetChannels || ""}
              onChange={(value) =>
                handleInputChange("discordTargetChannels", value)
              }
              type="text"
              placeholder="123456789012345678,987654321098765432"
              helpText="Comma-separated list of Discord channel IDs to restrict the bot to. If not set, the bot operates in all channels."
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(DiscordPluginForm);
