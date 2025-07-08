import React, { useState, useCallback } from "react";
import { Layers } from "lucide-react";
// import { Checkmark } from "../Checkmark";
import { FrameworkConfigFormProps } from "@/types/configForms";
import SectionHeader from "./SectionHeader";

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
      {/* Framework Information */}
      <div className="space-y-4">
        <SectionHeader
          title="Framework Information"
          icon={Layers}
          section="info"
          isExpanded={expandedSections.info}
          onToggle={toggleSection}
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
    </div>
  );
};

export default FrameworkConfigForm;
