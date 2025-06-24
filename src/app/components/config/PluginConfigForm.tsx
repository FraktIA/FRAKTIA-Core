import React, { useState, useCallback, memo } from "react";
import {
  ChevronDown,
  ChevronUp,
  Puzzle,
  Settings,
  Key,
  MessageCircle,
  Zap,
  Clock,
  Target,
} from "lucide-react";
import { Checkmark } from "../../../components/Checkmark";
import { PluginNodeData } from "@/types/nodeData";

interface PluginConfigFormProps {
  localNodeData: PluginNodeData;
  handleInputChange: (field: string, value: string) => void;
}

const PluginConfigForm: React.FC<PluginConfigFormProps> = ({
  localNodeData,
  handleInputChange,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    service: true,
    auth: false,
    basic: false,
    posting: false,
    interactions: false,
    timeline: false,
    advanced: false,
    config: false,
  });

  const isTwitter = localNodeData.service === "Twitter";

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

      {/* Plugin Selection */}
      <div className="space-y-4">
        <SectionHeader
          title="Plugin Selection"
          icon={Puzzle}
          section="service"
        />

        {expandedSections.service && (
          <div className="space-y-4 pl-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                Plugin Type
              </label>
              <select
                value={String(localNodeData.service || "twitter")}
                onChange={(e) => handleInputChange("service", e.target.value)}
                className="w-full p-3 bg-bg border border-bg rounded-sm text-white focus:outline-none focus:ring-[0.5px] focus:ring-primary text-sm transition-all duration-300"
              >
                <option value="twitter">Twitter/X</option>
                <option value="discord">Discord</option>
                <option value="telegram">Telegram</option>
                <option value="slack">Slack</option>
                <option value="blockchain">Blockchain</option>
                <option value="webhook">Webhook</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Twitter Authentication */}
      {isTwitter && (
        <div className="space-y-4">
          <SectionHeader title="API Credentials" icon={Key} section="auth" />

          {expandedSections.auth && (
            <div className="space-y-4 pl-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                  Twitter API Key
                  <span className="text-primary ml-1">*</span>
                </label>
                <input
                  type="password"
                  value={String(localNodeData.twitterApiKey || "")}
                  onChange={(e) =>
                    handleInputChange("twitterApiKey", e.target.value)
                  }
                  placeholder="Your Twitter API Key"
                  className="w-full p-3 bg-bg border border-bg rounded-sm text-white placeholder-gray-500 focus:outline-none focus:ring-[0.5px] focus:ring-primary transition-all duration-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                  Twitter API Secret Key
                  <span className="text-primary ml-1">*</span>
                </label>
                <input
                  type="password"
                  value={String(localNodeData.twitterApiSecretKey || "")}
                  onChange={(e) =>
                    handleInputChange("twitterApiSecretKey", e.target.value)
                  }
                  placeholder="Your Twitter API Secret Key"
                  className="w-full p-3 bg-bg border border-bg rounded-sm text-white placeholder-gray-500 focus:outline-none focus:ring-[0.5px] focus:ring-primary transition-all duration-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                  Access Token
                  <span className="text-primary ml-1">*</span>
                </label>
                <input
                  type="password"
                  value={String(localNodeData.twitterAccessToken || "")}
                  onChange={(e) =>
                    handleInputChange("twitterAccessToken", e.target.value)
                  }
                  placeholder="Your Access Token"
                  className="w-full p-3 bg-bg border border-bg rounded-sm text-white placeholder-gray-500 focus:outline-none focus:ring-[0.5px] focus:ring-primary transition-all duration-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                  Access Token Secret
                  <span className="text-primary ml-1">*</span>
                </label>
                <input
                  type="password"
                  value={String(localNodeData.twitterAccessTokenSecret || "")}
                  onChange={(e) =>
                    handleInputChange(
                      "twitterAccessTokenSecret",
                      e.target.value
                    )
                  }
                  placeholder="Your Access Token Secret"
                  className="w-full p-3 bg-bg border border-bg rounded-sm text-white placeholder-gray-500 focus:outline-none focus:ring-[0.5px] focus:ring-primary transition-all duration-300 text-sm"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Twitter Basic Configuration */}
      {isTwitter && (
        <div className="space-y-4">
          <SectionHeader
            title="Basic Configuration"
            icon={Settings}
            section="basic"
          />

          {expandedSections.basic && (
            <div className="space-y-4 pl-6">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="twitterDryRun"
                  checked={Boolean(localNodeData.twitterDryRun)}
                  onChange={(e) =>
                    handleInputChange(
                      "twitterDryRun",
                      e.target.checked.toString()
                    )
                  }
                  className="w-4 h-4 text-primary bg-bg border-gray-600 rounded focus:ring-primary focus:ring-2"
                />
                <label
                  htmlFor="twitterDryRun"
                  className="text-sm text-white/70 tracking-wide"
                >
                  Dry Run Mode (testing without posting)
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                  Target Users
                </label>
                <input
                  type="text"
                  value={String(localNodeData.twitterTargetUsers || "")}
                  onChange={(e) =>
                    handleInputChange("twitterTargetUsers", e.target.value)
                  }
                  placeholder="Comma-separated usernames or * for all"
                  className="w-full p-3 bg-bg border border-bg rounded-sm text-white placeholder-gray-500 focus:outline-none focus:ring-[0.5px] focus:ring-primary transition-all duration-300 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                    Retry Limit
                  </label>
                  <input
                    type="number"
                    value={String(localNodeData.twitterRetryLimit || 5)}
                    onChange={(e) =>
                      handleInputChange("twitterRetryLimit", e.target.value)
                    }
                    min="1"
                    max="20"
                    className="w-full p-3 bg-bg border border-bg rounded-sm text-white focus:outline-none focus:ring-[0.5px] focus:ring-primary transition-all duration-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                    Poll Interval (seconds)
                  </label>
                  <input
                    type="number"
                    value={String(localNodeData.twitterPollInterval || 120)}
                    onChange={(e) =>
                      handleInputChange("twitterPollInterval", e.target.value)
                    }
                    min="30"
                    max="3600"
                    className="w-full p-3 bg-bg border border-bg rounded-sm text-white focus:outline-none focus:ring-[0.5px] focus:ring-primary transition-all duration-300 text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Twitter Post Generation */}
      {isTwitter && (
        <div className="space-y-4">
          <SectionHeader
            title="Post Generation"
            icon={MessageCircle}
            section="posting"
          />

          {expandedSections.posting && (
            <div className="space-y-4 pl-6">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="twitterPostEnable"
                  checked={Boolean(localNodeData.twitterPostEnable)}
                  onChange={(e) =>
                    handleInputChange(
                      "twitterPostEnable",
                      e.target.checked.toString()
                    )
                  }
                  className="w-4 h-4 text-primary bg-bg border-gray-600 rounded focus:ring-primary focus:ring-2"
                />
                <label
                  htmlFor="twitterPostEnable"
                  className="text-sm text-white/70 tracking-wide"
                >
                  Enable Autonomous Tweet Posting
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                    Min Interval (minutes)
                  </label>
                  <input
                    type="number"
                    value={String(localNodeData.twitterPostIntervalMin || 90)}
                    onChange={(e) =>
                      handleInputChange(
                        "twitterPostIntervalMin",
                        e.target.value
                      )
                    }
                    min="1"
                    className="w-full p-3 bg-bg border border-bg rounded-sm text-white focus:outline-none focus:ring-[0.5px] focus:ring-primary transition-all duration-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                    Max Interval (minutes)
                  </label>
                  <input
                    type="number"
                    value={String(localNodeData.twitterPostIntervalMax || 180)}
                    onChange={(e) =>
                      handleInputChange(
                        "twitterPostIntervalMax",
                        e.target.value
                      )
                    }
                    min="1"
                    className="w-full p-3 bg-bg border border-bg rounded-sm text-white focus:outline-none focus:ring-[0.5px] focus:ring-primary transition-all duration-300 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="twitterPostImmediately"
                  checked={Boolean(localNodeData.twitterPostImmediately)}
                  onChange={(e) =>
                    handleInputChange(
                      "twitterPostImmediately",
                      e.target.checked.toString()
                    )
                  }
                  className="w-4 h-4 text-primary bg-bg border-gray-600 rounded focus:ring-primary focus:ring-2"
                />
                <label
                  htmlFor="twitterPostImmediately"
                  className="text-sm text-white/70 tracking-wide"
                >
                  Post Immediately (skip intervals)
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                  Interval Variance (0.0 - 1.0)
                </label>
                <input
                  type="number"
                  value={String(
                    localNodeData.twitterPostIntervalVariance || 0.2
                  )}
                  onChange={(e) =>
                    handleInputChange(
                      "twitterPostIntervalVariance",
                      e.target.value
                    )
                  }
                  step="0.1"
                  min="0"
                  max="1"
                  className="w-full p-3 bg-bg border border-bg rounded-sm text-white focus:outline-none focus:ring-[0.5px] focus:ring-primary transition-all duration-300 text-sm"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Twitter Interactions */}
      {isTwitter && (
        <div className="space-y-4">
          <SectionHeader
            title="Interaction Settings"
            icon={Target}
            section="interactions"
          />

          {expandedSections.interactions && (
            <div className="space-y-4 pl-6">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="twitterSearchEnable"
                  checked={Boolean(localNodeData.twitterSearchEnable !== false)}
                  onChange={(e) =>
                    handleInputChange(
                      "twitterSearchEnable",
                      e.target.checked.toString()
                    )
                  }
                  className="w-4 h-4 text-primary bg-bg border-gray-600 rounded focus:ring-primary focus:ring-2"
                />
                <label
                  htmlFor="twitterSearchEnable"
                  className="text-sm text-white/70 tracking-wide"
                >
                  Enable Timeline Monitoring
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                    Min Interaction Interval (min)
                  </label>
                  <input
                    type="number"
                    value={String(
                      localNodeData.twitterInteractionIntervalMin || 15
                    )}
                    onChange={(e) =>
                      handleInputChange(
                        "twitterInteractionIntervalMin",
                        e.target.value
                      )
                    }
                    min="1"
                    className="w-full p-3 bg-bg border border-bg rounded-sm text-white focus:outline-none focus:ring-[0.5px] focus:ring-primary transition-all duration-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                    Max Interaction Interval (min)
                  </label>
                  <input
                    type="number"
                    value={String(
                      localNodeData.twitterInteractionIntervalMax || 30
                    )}
                    onChange={(e) =>
                      handleInputChange(
                        "twitterInteractionIntervalMax",
                        e.target.value
                      )
                    }
                    min="1"
                    className="w-full p-3 bg-bg border border-bg rounded-sm text-white focus:outline-none focus:ring-[0.5px] focus:ring-primary transition-all duration-300 text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="twitterAutoRespondMentions"
                  checked={Boolean(
                    localNodeData.twitterAutoRespondMentions !== false
                  )}
                  onChange={(e) =>
                    handleInputChange(
                      "twitterAutoRespondMentions",
                      e.target.checked.toString()
                    )
                  }
                  className="w-4 h-4 text-primary bg-bg border-gray-600 rounded focus:ring-primary focus:ring-2"
                />
                <label
                  htmlFor="twitterAutoRespondMentions"
                  className="text-sm text-white/70 tracking-wide"
                >
                  Auto-respond to Mentions
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="twitterAutoRespondReplies"
                  checked={Boolean(
                    localNodeData.twitterAutoRespondReplies !== false
                  )}
                  onChange={(e) =>
                    handleInputChange(
                      "twitterAutoRespondReplies",
                      e.target.checked.toString()
                    )
                  }
                  className="w-4 h-4 text-primary bg-bg border-gray-600 rounded focus:ring-primary focus:ring-2"
                />
                <label
                  htmlFor="twitterAutoRespondReplies"
                  className="text-sm text-white/70 tracking-wide"
                >
                  Auto-respond to Replies
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                  Max Interactions Per Run
                </label>
                <input
                  type="number"
                  value={String(
                    localNodeData.twitterMaxInteractionsPerRun || 10
                  )}
                  onChange={(e) =>
                    handleInputChange(
                      "twitterMaxInteractionsPerRun",
                      e.target.value
                    )
                  }
                  min="1"
                  max="100"
                  className="w-full p-3 bg-bg border border-bg rounded-sm text-white focus:outline-none focus:ring-[0.5px] focus:ring-primary transition-all duration-300 text-sm"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Twitter Timeline Algorithm */}
      {isTwitter && (
        <div className="space-y-4">
          <SectionHeader
            title="Timeline Algorithm"
            icon={Zap}
            section="timeline"
          />

          {expandedSections.timeline && (
            <div className="space-y-4 pl-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                  Algorithm Type
                </label>
                <select
                  value={String(
                    localNodeData.twitterTimelineAlgorithm || "weighted"
                  )}
                  onChange={(e) =>
                    handleInputChange(
                      "twitterTimelineAlgorithm",
                      e.target.value
                    )
                  }
                  className="w-full p-3 bg-bg border border-bg rounded-sm text-white focus:outline-none focus:ring-[0.5px] focus:ring-primary text-sm transition-all duration-300"
                >
                  <option value="weighted">Weighted Scoring</option>
                  <option value="latest">Latest First</option>
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                    User Weight
                  </label>
                  <input
                    type="number"
                    value={String(
                      localNodeData.twitterTimelineUserBasedWeight || 3
                    )}
                    onChange={(e) =>
                      handleInputChange(
                        "twitterTimelineUserBasedWeight",
                        e.target.value
                      )
                    }
                    min="0"
                    max="10"
                    className="w-full p-3 bg-bg border border-bg rounded-sm text-white focus:outline-none focus:ring-[0.5px] focus:ring-primary transition-all duration-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                    Time Weight
                  </label>
                  <input
                    type="number"
                    value={String(
                      localNodeData.twitterTimelineTimeBasedWeight || 2
                    )}
                    onChange={(e) =>
                      handleInputChange(
                        "twitterTimelineTimeBasedWeight",
                        e.target.value
                      )
                    }
                    min="0"
                    max="10"
                    className="w-full p-3 bg-bg border border-bg rounded-sm text-white focus:outline-none focus:ring-[0.5px] focus:ring-primary transition-all duration-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                    Relevance Weight
                  </label>
                  <input
                    type="number"
                    value={String(
                      localNodeData.twitterTimelineRelevanceWeight || 5
                    )}
                    onChange={(e) =>
                      handleInputChange(
                        "twitterTimelineRelevanceWeight",
                        e.target.value
                      )
                    }
                    min="0"
                    max="10"
                    className="w-full p-3 bg-bg border border-bg rounded-sm text-white focus:outline-none focus:ring-[0.5px] focus:ring-primary transition-all duration-300 text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Twitter Advanced Settings */}
      {isTwitter && (
        <div className="space-y-4">
          <SectionHeader
            title="Advanced Settings"
            icon={Clock}
            section="advanced"
          />

          {expandedSections.advanced && (
            <div className="space-y-4 pl-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                  Max Tweet Length
                </label>
                <input
                  type="number"
                  value={String(localNodeData.twitterMaxTweetLength || 4000)}
                  onChange={(e) =>
                    handleInputChange("twitterMaxTweetLength", e.target.value)
                  }
                  min="280"
                  max="10000"
                  className="w-full p-3 bg-bg border border-bg rounded-sm text-white focus:outline-none focus:ring-[0.5px] focus:ring-primary transition-all duration-300 text-sm"
                />
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="twitterDmOnly"
                  checked={Boolean(localNodeData.twitterDmOnly)}
                  onChange={(e) =>
                    handleInputChange(
                      "twitterDmOnly",
                      e.target.checked.toString()
                    )
                  }
                  className="w-4 h-4 text-primary bg-bg border-gray-600 rounded focus:ring-primary focus:ring-2"
                />
                <label
                  htmlFor="twitterDmOnly"
                  className="text-sm text-white/70 tracking-wide"
                >
                  Direct Messages Only
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="twitterEnableActionProcessing"
                  checked={Boolean(localNodeData.twitterEnableActionProcessing)}
                  onChange={(e) =>
                    handleInputChange(
                      "twitterEnableActionProcessing",
                      e.target.checked.toString()
                    )
                  }
                  className="w-4 h-4 text-primary bg-bg border-gray-600 rounded focus:ring-primary focus:ring-2"
                />
                <label
                  htmlFor="twitterEnableActionProcessing"
                  className="text-sm text-white/70 tracking-wide"
                >
                  Enable Timeline Action Processing
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                  Action Processing Interval (minutes)
                </label>
                <input
                  type="number"
                  value={String(localNodeData.twitterActionInterval || 240)}
                  onChange={(e) =>
                    handleInputChange("twitterActionInterval", e.target.value)
                  }
                  min="1"
                  className="w-full p-3 bg-bg border border-bg rounded-sm text-white focus:outline-none focus:ring-[0.5px] focus:ring-primary transition-all duration-300 text-sm"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Non-Twitter Plugin Configuration */}
      {!isTwitter && (
        <div className="space-y-4">
          <SectionHeader
            title="Configuration"
            icon={Settings}
            section="config"
          />

          {expandedSections.config && (
            <div className="space-y-4 pl-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                  API Key/Token
                  <span className="text-primary ml-1">*</span>
                </label>
                <input
                  type="password"
                  value={String(localNodeData.apiKey || "")}
                  onChange={(e) => handleInputChange("apiKey", e.target.value)}
                  placeholder="Enter API key or token..."
                  className="w-full p-3 bg-bg border border-bg rounded-sm text-white placeholder-gray-500 focus:outline-none focus:ring-[0.5px] focus:ring-primary transition-all duration-300 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                  Endpoint URL
                </label>
                <input
                  type="url"
                  value={String(localNodeData.endpoint || "")}
                  onChange={(e) =>
                    handleInputChange("endpoint", e.target.value)
                  }
                  placeholder="https://api.example.com"
                  className="w-full p-3 bg-bg border border-bg rounded-sm text-white placeholder-gray-500 focus:outline-none focus:ring-[0.5px] focus:ring-primary transition-all duration-300 text-sm"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(PluginConfigForm);
