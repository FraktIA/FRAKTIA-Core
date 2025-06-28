import React, { useState, useCallback } from "react";
import { ChevronDown, ChevronUp, FileOutput, Settings } from "lucide-react";
import { Checkmark } from "../Checkmark";
import { OutputNodeData } from "@/types/nodeData";

interface OutputConfigFormProps {
  localNodeData: OutputNodeData;
  handleInputChange: (field: string, value: string) => void;
}

const OutputConfigForm: React.FC<OutputConfigFormProps> = ({
  localNodeData,
  handleInputChange,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    output: true,
    template: false,
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

      {/* Output Type */}
      <div className="space-y-4">
        <SectionHeader title="Output Type" icon={FileOutput} section="output" />

        {expandedSections.output && (
          <div className="space-y-4 pl-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                Output Format
              </label>
              <select
                value={String(localNodeData.type || "text")}
                onChange={(e) => handleInputChange("type", e.target.value)}
                className="w-full p-3 bg-bg border border-bg rounded-sm text-white focus:outline-none focus:ring-[0.5px] focus:ring-primary text-sm transition-all duration-300"
              >
                <option value="text">Text</option>
                <option value="action">Action</option>
                <option value="webhook">Webhook</option>
                <option value="file">File</option>
                <option value="email">Email</option>
                <option value="notification">Notification</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Template */}
      <div className="space-y-4">
        <SectionHeader
          title="Format Template"
          icon={Settings}
          section="template"
        />

        {expandedSections.template && (
          <div className="space-y-4 pl-6">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                Output Template
              </label>
              <textarea
                value={String(localNodeData.template || "")}
                onChange={(e) => handleInputChange("template", e.target.value)}
                placeholder="Output format template..."
                rows={4}
                className="w-full p-3 bg-bg border border-bg rounded-sm text-white placeholder-gray-500 focus:outline-none focus:ring-[0.5px] focus:ring-primary transition-all duration-300 resize-none font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Use variables like {"{{variable}}"} to dynamically insert data
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputConfigForm;
