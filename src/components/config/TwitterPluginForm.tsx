import React, { useState, useCallback, memo, useEffect } from "react";
import { Key, Settings, MessageCircle, Target, Zap, Clock } from "lucide-react";
import { TwitterPluginFormProps } from "@/types/configForms";
import SectionHeader from "./SectionHeader";
import FormInput from "../form/FormInput";
import FormCheckbox from "../form/FormCheckbox";
import FormSelect from "../form/FormSelect";
import Link from "next/link";

const TwitterPluginForm: React.FC<TwitterPluginFormProps> = ({
  localNodeData,
  handleInputChange,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    auth: true,
    basic: false,
    posting: false,
    interactions: false,
    timeline: false,
    advanced: false,
  });

  // Validation function to check if the Twitter plugin is configured
  const isTwitterConfigured = useCallback(() => {
    return !!(
      localNodeData.twitterApiKey &&
      localNodeData.twitterApiKey.trim() !== "" &&
      localNodeData.twitterApiSecretKey &&
      localNodeData.twitterApiSecretKey.trim() !== "" &&
      localNodeData.twitterAccessToken &&
      localNodeData.twitterAccessToken.trim() !== "" &&
      localNodeData.twitterAccessTokenSecret &&
      localNodeData.twitterAccessTokenSecret.trim() !== ""
    );
  }, [
    localNodeData.twitterApiKey,
    localNodeData.twitterApiSecretKey,
    localNodeData.twitterAccessToken,
    localNodeData.twitterAccessTokenSecret,
  ]);

  // Effect to update configured status whenever validation criteria changes
  useEffect(() => {
    const configured = isTwitterConfigured();
    if (localNodeData.configured !== configured) {
      handleInputChange("configured", configured);
    }
  }, [
    localNodeData.twitterApiKey,
    localNodeData.twitterApiSecretKey,
    localNodeData.twitterAccessToken,
    localNodeData.twitterAccessTokenSecret,
    localNodeData.configured,
    handleInputChange,
    isTwitterConfigured,
  ]);

  const toggleSection = useCallback((section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section as keyof typeof prev]: !prev[section as keyof typeof prev],
    }));
  }, []);

  console.log("TwitterPluginForm rendered with data:", localNodeData);

  return (
    <div className="space-y-6 h-full p-1 relative">
      {/* Instructions */}
      <p className="text-sm mb-4 ">
        <Link
          className="text-primary underline"
          target="_blank"
          href={"https://github.com/elizaos-plugins/plugin-twitter"}
        >
          -Instructions
        </Link>
      </p>
      {/* Twitter Authentication */}
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
              label="Twitter API Key"
              value={String(localNodeData.twitterApiKey || "")}
              onChange={(value) => handleInputChange("twitterApiKey", value)}
              type="password"
              placeholder="Your Twitter API Key"
              required
            />
            <FormInput
              label="Twitter API Secret Key"
              value={String(localNodeData.twitterApiSecretKey || "")}
              onChange={(value) =>
                handleInputChange("twitterApiSecretKey", value)
              }
              type="password"
              placeholder="Your Twitter API Secret Key"
              required
            />
            <FormInput
              label="Access Token"
              value={String(localNodeData.twitterAccessToken || "")}
              onChange={(value) =>
                handleInputChange("twitterAccessToken", value)
              }
              type="password"
              placeholder="Your Access Token (with write permissions)"
              required
            />
            <FormInput
              label="Access Token Secret"
              value={String(localNodeData.twitterAccessTokenSecret || "")}
              onChange={(value) =>
                handleInputChange("twitterAccessTokenSecret", value)
              }
              type="password"
              placeholder="Your Access Token Secret"
              required
            />
          </div>
        )}
      </div>

      {/* Twitter Basic Configuration */}
      <div className="space-y-4">
        <SectionHeader
          title="Basic Configuration"
          icon={Settings}
          section="basic"
          isExpanded={expandedSections.basic}
          onToggle={toggleSection}
        />

        {expandedSections.basic && (
          <div className="space-y-4 pl-6">
            <FormCheckbox
              id="twitterPostEnable"
              label="Enable Tweet Posting"
              checked={Boolean(localNodeData.twitterPostEnable)}
              onChange={(checked) =>
                handleInputChange("twitterPostEnable", checked)
              }
            />

            <FormCheckbox
              id="twitterPostImmediately"
              label="Post Immediately (great for testing)"
              checked={Boolean(localNodeData.twitterPostImmediately)}
              onChange={(checked) =>
                handleInputChange("twitterPostImmediately", checked)
              }
            />

            <FormCheckbox
              id="twitterSearchEnable"
              label="Enable Search/Timeline Monitoring"
              checked={Boolean(localNodeData.twitterSearchEnable)}
              onChange={(checked) =>
                handleInputChange("twitterSearchEnable", checked)
              }
            />

            <FormCheckbox
              id="twitterDryRun"
              label="Dry Run Mode (testing without posting)"
              checked={Boolean(localNodeData.twitterDryRun)}
              onChange={(checked) =>
                handleInputChange("twitterDryRun", checked)
              }
            />

            <FormInput
              label="Target Users"
              value={String(localNodeData.twitterTargetUsers || "")}
              onChange={(value) =>
                handleInputChange("twitterTargetUsers", value)
              }
              placeholder="Comma-separated usernames or * for all"
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Retry Limit"
                value={String(localNodeData.twitterRetryLimit || 5)}
                onChange={(value) =>
                  handleInputChange("twitterRetryLimit", value)
                }
                type="number"
                min="1"
                max="20"
              />
              <FormInput
                label="Poll Interval (seconds)"
                value={String(localNodeData.twitterPollInterval || 120)}
                onChange={(value) =>
                  handleInputChange("twitterPollInterval", value)
                }
                type="number"
                min="30"
                max="3600"
              />
            </div>
          </div>
        )}
      </div>

      {/* Twitter Post Generation */}
      <div className="space-y-4">
        <SectionHeader
          title="Post Generation"
          icon={MessageCircle}
          section="posting"
          isExpanded={expandedSections.posting}
          onToggle={toggleSection}
        />

        {expandedSections.posting && (
          <div className="space-y-4 pl-6">
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Min Interval (minutes)"
                value={String(localNodeData.twitterPostIntervalMin || 90)}
                onChange={(value) =>
                  handleInputChange("twitterPostIntervalMin", value)
                }
                type="number"
                min="1"
              />
              <FormInput
                label="Max Interval (minutes)"
                value={String(localNodeData.twitterPostIntervalMax || 180)}
                onChange={(value) =>
                  handleInputChange("twitterPostIntervalMax", value)
                }
                type="number"
                min="1"
              />
            </div>

            <FormInput
              label="Interval Variance (0.0 - 1.0)"
              value={String(localNodeData.twitterPostIntervalVariance || 0.2)}
              onChange={(value) =>
                handleInputChange("twitterPostIntervalVariance", value)
              }
              type="number"
              step="0.1"
              min="0"
              max="1"
            />
          </div>
        )}
      </div>

      {/* Twitter Interactions */}
      <div className="space-y-4">
        <SectionHeader
          title="Interaction Settings"
          icon={Target}
          section="interactions"
          isExpanded={expandedSections.interactions}
          onToggle={toggleSection}
        />

        {expandedSections.interactions && (
          <div className="space-y-4 pl-6">
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Min Interaction Interval (min)"
                value={String(
                  localNodeData.twitterInteractionIntervalMin || 15
                )}
                onChange={(value) =>
                  handleInputChange("twitterInteractionIntervalMin", value)
                }
                type="number"
                min="1"
              />
              <FormInput
                label="Max Interaction Interval (min)"
                value={String(
                  localNodeData.twitterInteractionIntervalMax || 30
                )}
                onChange={(value) =>
                  handleInputChange("twitterInteractionIntervalMax", value)
                }
                type="number"
                min="1"
              />
            </div>

            <FormCheckbox
              id="twitterAutoRespondMentions"
              label="Auto-respond to Mentions"
              checked={Boolean(localNodeData.twitterAutoRespondMentions)}
              onChange={(checked) =>
                handleInputChange("twitterAutoRespondMentions", checked)
              }
            />

            <FormCheckbox
              id="twitterAutoRespondReplies"
              label="Auto-respond to Replies"
              checked={Boolean(localNodeData.twitterAutoRespondReplies)}
              onChange={(checked) =>
                handleInputChange("twitterAutoRespondReplies", checked)
              }
            />

            <FormInput
              label="Max Interactions Per Run"
              value={String(localNodeData.twitterMaxInteractionsPerRun || 10)}
              onChange={(value) =>
                handleInputChange("twitterMaxInteractionsPerRun", value)
              }
              type="number"
              min="1"
              max="100"
            />
          </div>
        )}
      </div>

      {/* Twitter Timeline Algorithm */}
      <div className="space-y-4">
        <SectionHeader
          title="Timeline Algorithm"
          icon={Zap}
          section="timeline"
          isExpanded={expandedSections.timeline}
          onToggle={toggleSection}
        />

        {expandedSections.timeline && (
          <div className="space-y-4 pl-6">
            <FormSelect
              label="Algorithm Type"
              value={String(
                localNodeData.twitterTimelineAlgorithm || "weighted"
              )}
              onChange={(value) =>
                handleInputChange("twitterTimelineAlgorithm", value)
              }
              options={[
                { value: "weighted", label: "Weighted Scoring" },
                { value: "latest", label: "Latest First" },
              ]}
            />

            <div className="grid grid-cols-3 gap-4">
              <FormInput
                label="User Weight"
                value={String(
                  localNodeData.twitterTimelineUserBasedWeight || 3
                )}
                onChange={(value) =>
                  handleInputChange("twitterTimelineUserBasedWeight", value)
                }
                type="number"
                min="0"
                max="10"
              />
              <FormInput
                label="Time Weight"
                value={String(
                  localNodeData.twitterTimelineTimeBasedWeight || 2
                )}
                onChange={(value) =>
                  handleInputChange("twitterTimelineTimeBasedWeight", value)
                }
                type="number"
                min="0"
                max="10"
              />
              <FormInput
                label="Relevance Weight"
                value={String(
                  localNodeData.twitterTimelineRelevanceWeight || 5
                )}
                onChange={(value) =>
                  handleInputChange("twitterTimelineRelevanceWeight", value)
                }
                type="number"
                min="0"
                max="10"
              />
            </div>
          </div>
        )}
      </div>

      {/* Twitter Advanced Settings */}
      <div className="space-y-4">
        <SectionHeader
          title="Advanced Settings"
          icon={Clock}
          section="advanced"
          isExpanded={expandedSections.advanced}
          onToggle={toggleSection}
        />

        {expandedSections.advanced && (
          <div className="space-y-4 pl-6">
            <FormInput
              label="Max Tweet Length"
              value={String(localNodeData.twitterMaxTweetLength || 4000)}
              onChange={(value) =>
                handleInputChange("twitterMaxTweetLength", value)
              }
              type="number"
              min="280"
              max="10000"
            />

            <FormCheckbox
              id="twitterDmOnly"
              label="Direct Messages Only"
              checked={Boolean(localNodeData.twitterDmOnly)}
              onChange={(checked) =>
                handleInputChange("twitterDmOnly", checked)
              }
            />

            <FormCheckbox
              id="twitterEnableActionProcessing"
              label="Enable Timeline Action Processing"
              checked={Boolean(localNodeData.twitterEnableActionProcessing)}
              onChange={(checked) =>
                handleInputChange("twitterEnableActionProcessing", checked)
              }
            />

            <FormInput
              label="Action Processing Interval (minutes)"
              value={String(localNodeData.twitterActionInterval || 240)}
              onChange={(value) =>
                handleInputChange("twitterActionInterval", value)
              }
              type="number"
              min="1"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(TwitterPluginForm);
