import React, { useState, useCallback } from "react";
import { ChevronDown, ChevronUp, Layers, Info } from "lucide-react";
import { Checkmark } from "../Checkmark";
import { FrameworkNodeData } from "@/types/nodeData";

interface FrameworkConfigFormProps {
  localNodeData: FrameworkNodeData;
}

const FrameworkConfigForm: React.FC<FrameworkConfigFormProps> = ({
  localNodeData,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    info: true,
    details: false,
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

  // Framework descriptions
  const frameworkDescriptions = {
    elizaos:
      "A powerful autonomous agent framework for building AI characters with advanced reasoning capabilities.",
    copilot:
      "Microsoft's AI-powered coding assistant enabling intelligent code completion and pair programming.",
    crewai:
      "A cutting-edge framework for orchestrating role-playing, autonomous AI agents in complex workflows.",
    langgraph:
      "A comprehensive framework for developing applications powered by language models with extensive integrations.",
  };

  const frameworkNames = {
    elizaos: "ElizaOS",
    copilot: "Copilot",
    crewai: "CrewAI",
    langgraph: "LangGraph",
  };

  const currentFramework = localNodeData.framework || "elizaos";

  return (
    <div className="space-y-6 h-full p-6 relative">
      {/* Status Indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Checkmark className="w-4 h-4 text-green-400 drop-shadow-lg" />
        <span className="text-green-400 text-[10px] font-bold capitalize">
          Ready
        </span>
      </div>

      {/* Framework Information */}
      <div className="space-y-4">
        <SectionHeader
          title="Framework Information"
          icon={Layers}
          section="info"
        />

        {expandedSections.info && (
          <div className="space-y-4 pl-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                Selected Framework
              </label>
              <div className="p-3 bg-bg border border-bg rounded-sm">
                <h4 className="text-white text-lg font-bold mb-2">
                  {
                    frameworkNames[
                      currentFramework as keyof typeof frameworkNames
                    ]
                  }
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {
                    frameworkDescriptions[
                      currentFramework as keyof typeof frameworkDescriptions
                    ]
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Configuration Details */}
      <div className="space-y-4">
        <SectionHeader
          title="Configuration Details"
          icon={Info}
          section="details"
        />

        {expandedSections.details && (
          <div className="space-y-4 pl-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                Framework Status
              </label>
              <div className="p-3 bg-bg border border-bg rounded-sm">
                <span
                  className={`text-sm font-medium ${
                    localNodeData.configured
                      ? "text-green-400"
                      : "text-yellow-400"
                  }`}
                >
                  {localNodeData.configured
                    ? "Configured"
                    : "Pending Configuration"}
                </span>
              </div>
            </div>

            {localNodeData.label && (
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                  Label
                </label>
                <div className="p-3 bg-bg border border-bg rounded-sm text-white text-sm">
                  {localNodeData.label}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FrameworkConfigForm;
