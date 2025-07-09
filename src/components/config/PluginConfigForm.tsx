import React, { useState, useCallback, memo, useEffect, useMemo } from "react";
import { Puzzle, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { PluginConfigFormProps } from "@/types/configForms";
import { IndividualPluginConfig } from "@/types/nodeData";
import TwitterPluginForm from "./TwitterPluginForm";
import DiscordPluginForm from "./DiscordPluginForm";
import FormSelect from "../form/FormSelect";

const PluginConfigForm: React.FC<PluginConfigFormProps> = ({
  localNodeData,
  handleInputChange,
}) => {
  // Track which individual plugins are expanded
  const [expandedPlugins, setExpandedPlugins] = useState<
    Record<number, boolean>
  >({});

  // Ensure plugins is always an array using useMemo to prevent re-renders
  const plugins = useMemo(
    () => (Array.isArray(localNodeData.plugins) ? localNodeData.plugins : []),
    [localNodeData.plugins]
  );

  const maxPlugins = 2;

  // Get available plugin options (excluding already selected ones)
  const getAvailablePluginOptions = useCallback(
    (currentIndex: number) => {
      const allOptions = [
        { value: "twitter", label: "Twitter" },
        { value: "discord", label: "Discord" },
      ];

      const usedServices = plugins
        .map((plugin, index) =>
          index !== currentIndex ? plugin.service : null
        )
        .filter(Boolean);

      return allOptions.filter(
        (option) => !usedServices.includes(option.value)
      );
    },
    [plugins]
  );

  // Toggle plugin expansion
  const togglePlugin = useCallback((index: number) => {
    setExpandedPlugins((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }, []);

  // Add a new plugin
  const addPlugin = useCallback(() => {
    if (plugins.length < maxPlugins) {
      // Get available options for the new plugin
      const availableOptions = getAvailablePluginOptions(plugins.length);
      const defaultService =
        availableOptions.length > 0 ? availableOptions[0].value : "twitter";

      // Create new plugin with default configuration based on service type
      let newPlugin: IndividualPluginConfig = {
        service: defaultService,
        configured: false,
      };

      // Add default configuration for Twitter
      if (defaultService === "twitter") {
        newPlugin = {
          ...newPlugin,
          // Twitter Authentication (required)
          twitterApiKey: "",
          twitterApiSecretKey: "",
          twitterAccessToken: "",
          twitterAccessTokenSecret: "",

          // Twitter Basic Configuration
          twitterDryRun: false,
          twitterTargetUsers: "",
          twitterRetryLimit: 5,
          twitterPollInterval: 3600, // 1 hour instead of 30 minutes
          twitterPostEnable: true,
          twitterPostIntervalMin: 180, // 3 hours instead of 90 minutes
          twitterPostIntervalMax: 360, // 6 hours instead of 3 hours
          twitterPostImmediately: false, // Don't post immediately on startup
          twitterPostIntervalVariance: 0.2,
          twitterSearchEnable: false,

          // Twitter Interaction Settings
          twitterInteractionIntervalMin: 60, // 1 hour instead of 15 minutes
          twitterInteractionIntervalMax: 120, // 2 hours instead of 30 minutes
          twitterInteractionIntervalVariance: 0.3,
          twitterAutoRespondMentions: false,
          twitterAutoRespondReplies: false,
          twitterMaxInteractionsPerRun: 10,

          // Twitter Timeline Algorithm
          twitterTimelineAlgorithm: "weighted",
          twitterTimelineUserBasedWeight: 3,
          twitterTimelineTimeBasedWeight: 2,
          twitterTimelineRelevanceWeight: 5,

          // Twitter Advanced Settings
          twitterMaxTweetLength: 4000,
          twitterDmOnly: false,
          twitterEnableActionProcessing: false,
          twitterActionInterval: 240,
        };
      }
      // Add default configuration for Discord
      else if (defaultService === "discord") {
        newPlugin = {
          ...newPlugin,
          discordApplicationId: "",
          discordApiToken: "",
        };
      }

      const updatedPlugins = [...plugins, newPlugin];
      handleInputChange("plugins", updatedPlugins);

      // Auto-expand the new plugin
      setExpandedPlugins((prev) => ({
        ...prev,
        [plugins.length]: true,
      }));
    }
  }, [plugins, handleInputChange, maxPlugins, getAvailablePluginOptions]);

  // Remove a plugin
  const removePlugin = useCallback(
    (index: number) => {
      const updatedPlugins = plugins.filter((_, i) => i !== index);
      handleInputChange("plugins", updatedPlugins);

      // Clean up expansion state
      setExpandedPlugins((prev) => {
        const newState = { ...prev };
        delete newState[index];
        // Shift down the indices for plugins that come after the removed one
        Object.keys(newState).forEach((key) => {
          const keyNum = parseInt(key);
          if (keyNum > index) {
            newState[keyNum - 1] = newState[keyNum];
            delete newState[keyNum];
          }
        });
        return newState;
      });
    },
    [plugins, handleInputChange]
  );

  // Update a specific plugin
  const updatePlugin = useCallback(
    (index: number, field: string, value: string | boolean | number) => {
      const updatedPlugins = [...plugins];

      // If changing service type, preserve basic fields but add default config for new service
      if (field === "service") {
        let newPluginData: IndividualPluginConfig = {
          service: value as string,
          configured: false,
        };

        // Add default configuration based on new service type
        if (value === "twitter") {
          newPluginData = {
            ...newPluginData,
            // Twitter Authentication (required)
            twitterApiKey: "",
            twitterApiSecretKey: "",
            twitterAccessToken: "",
            twitterAccessTokenSecret: "",

            // Twitter Basic Configuration
            twitterDryRun: false,
            twitterTargetUsers: "",
            twitterRetryLimit: 5,
            twitterPollInterval: 3600, // 1 hour instead of 30 minutes
            twitterPostEnable: true,
            twitterPostIntervalMin: 180, // 3 hours instead of 90 minutes
            twitterPostIntervalMax: 360, // 6 hours instead of 3 hours
            twitterPostImmediately: false, // Don't post immediately on startup
            twitterPostIntervalVariance: 0.2,
            twitterSearchEnable: false,

            // Twitter Interaction Settings
            twitterInteractionIntervalMin: 60, // 1 hour instead of 15 minutes
            twitterInteractionIntervalMax: 120, // 2 hours instead of 30 minutes
            twitterInteractionIntervalVariance: 0.3,
            twitterAutoRespondMentions: false,
            twitterAutoRespondReplies: false,
            twitterMaxInteractionsPerRun: 10,

            // Twitter Timeline Algorithm
            twitterTimelineAlgorithm: "weighted",
            twitterTimelineUserBasedWeight: 3,
            twitterTimelineTimeBasedWeight: 2,
            twitterTimelineRelevanceWeight: 5,

            // Twitter Advanced Settings
            twitterMaxTweetLength: 4000,
            twitterDmOnly: false,
            twitterEnableActionProcessing: false,
            twitterActionInterval: 240,
          };
        } else if (value === "discord") {
          newPluginData = {
            ...newPluginData,
            discordApplicationId: "",
            discordApiToken: "",
          };
        }

        updatedPlugins[index] = newPluginData;
      } else {
        // Regular field update
        updatedPlugins[index] = {
          ...updatedPlugins[index],
          [field]: value,
        };
      }

      handleInputChange("plugins", updatedPlugins);
    },
    [plugins, handleInputChange]
  );

  // Validation function for plugins
  const isPluginConfigured = useCallback(() => {
    return (
      plugins.length > 0 &&
      plugins.every((plugin) => {
        if (plugin.service === "twitter") {
          return !!(
            plugin.twitterApiKey &&
            plugin.twitterApiKey.trim() !== "" &&
            plugin.twitterApiSecretKey &&
            plugin.twitterApiSecretKey.trim() !== "" &&
            plugin.twitterAccessToken &&
            plugin.twitterAccessToken.trim() !== "" &&
            plugin.twitterAccessTokenSecret &&
            plugin.twitterAccessTokenSecret.trim() !== ""
          );
        } else if (plugin.service === "discord") {
          return !!(
            plugin.discordApplicationId &&
            plugin.discordApplicationId.trim() !== "" &&
            plugin.discordApiToken &&
            plugin.discordApiToken.trim() !== ""
          );
        }
        return true; // For other plugin types
      })
    );
  }, [plugins]);

  // Effect to update configured status
  useEffect(() => {
    const configured = isPluginConfigured();
    if (localNodeData.configured !== configured) {
      handleInputChange("configured", configured);
    }
  }, [
    plugins,
    localNodeData.configured,
    handleInputChange,
    isPluginConfigured,
  ]);

  const renderPluginConfig = (
    plugin: IndividualPluginConfig,
    index: number
  ) => {
    if (plugin.service === "twitter") {
      return (
        <TwitterPluginForm
          localNodeData={{ ...localNodeData, ...plugin }}
          handleInputChange={(field, value) =>
            updatePlugin(index, field, value)
          }
        />
      );
    } else if (plugin.service === "discord") {
      return (
        <DiscordPluginForm
          localNodeData={{ ...localNodeData, ...plugin }}
          handleInputChange={(field, value) =>
            updatePlugin(index, field, value)
          }
        />
      );
    }
    return null;
  };

  return (
    <div className="space-y-6  h-full p-5 relative">
      {/* Plugin Management Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          {plugins.length < maxPlugins && (
            <button
              onClick={addPlugin}
              className="flex items-center gap-2 px-3 py-2 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-lg text-primary text-sm font-medium transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Add Plugin ({plugins.length}/{maxPlugins})
            </button>
          )}
        </div>

        <div className="space-y-6">
          {plugins.length === 0 && (
            <div className="text-center py-8 text-gray-400 border border-dashed border-gray-600/30 rounded-lg">
              <Puzzle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">No plugins configured.</p>
              <p className="text-xs mt-1">
                Click &quot;Add Plugin&quot; to get started.
              </p>
            </div>
          )}

          {plugins.map((plugin, index) => {
            const isExpanded = expandedPlugins[index] ?? true; // Default to expanded

            return (
              <div
                key={index}
                className="border border-gray-600/30 rounded-lg  overflow-hidden"
              >
                <div className="flex items-center justify-between p-4  border-b border-gray-600/30">
                  <div
                    className="flex items-center gap-3 cursor-pointer flex-1"
                    onClick={() => togglePlugin(index)}
                  >
                    <span className="w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>
                    <h4 className="text-md capitalize font-medium text-white">
                      - {plugin.service || "Unconfigured"}
                    </h4>
                    <div className="ml-auto mr-4">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-gray-400 transition-transform duration-200" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-400 transition-transform duration-200" />
                      )}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering the collapse/expand
                      removePlugin(index);
                    }}
                    className="flex items-center gap-1 px-2 py-1 bg-red-600/20 hover:bg-red-600/30 border border-red-600/30 rounded-md text-red-400 text-xs transition-all duration-200"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                {isExpanded && (
                  <div className="p-4 space-y-4 animate-in slide-in-from-top duration-200">
                    <FormSelect
                      label="Service Type"
                      value={plugin.service || ""}
                      onChange={(value) =>
                        updatePlugin(index, "service", value)
                      }
                      options={getAvailablePluginOptions(index)}
                    />

                    {plugin.service && renderPluginConfig(plugin, index)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default memo(PluginConfigForm);
