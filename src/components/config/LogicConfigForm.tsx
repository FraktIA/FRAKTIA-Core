import React, { useState, useCallback } from "react";
import { ChevronDown, ChevronUp, GitBranch, Code } from "lucide-react";
import { Checkmark } from "../Checkmark";
import { LogicNodeData } from "@/types/nodeData";

interface LogicConfigFormProps {
  localNodeData: LogicNodeData;
  handleInputChange: (field: string, value: string) => void;
}

const LogicConfigForm: React.FC<LogicConfigFormProps> = ({
  localNodeData,
  handleInputChange,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    logic: true,
    expression: false,
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

      {/* Logic Type */}
      <div className="space-y-4">
        <SectionHeader title="Logic Type" icon={GitBranch} section="logic" />

        {expandedSections.logic && (
          <div className="space-y-4 pl-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                Condition Type
              </label>
              <select
                value={String(localNodeData.condition || "if")}
                onChange={(e) => handleInputChange("condition", e.target.value)}
                className="w-full p-3 bg-bg border border-bg rounded-sm text-white focus:outline-none focus:ring-[0.5px] focus:ring-primary text-sm transition-all duration-300"
              >
                <option value="if">If/Then</option>
                <option value="switch">Switch/Case</option>
                <option value="loop">Loop</option>
                <option value="filter">Filter</option>
                <option value="transform">Transform</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Expression */}
      <div className="space-y-4">
        <SectionHeader title="Condition" icon={Code} section="expression" />

        {expandedSections.expression && (
          <div className="space-y-4 pl-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                Logic Expression
              </label>
              <textarea
                value={String(localNodeData.expression || "")}
                onChange={(e) =>
                  handleInputChange("expression", e.target.value)
                }
                placeholder="Enter condition logic..."
                rows={4}
                className="w-full p-3 bg-bg border border-bg rounded-sm text-white placeholder-gray-500 focus:outline-none focus:ring-[0.5px] focus:ring-primary transition-all duration-300 resize-none font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Example: user.age {">"}= 18 &amp;&amp; user.verified === true
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogicConfigForm;
