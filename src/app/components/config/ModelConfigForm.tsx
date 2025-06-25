import React, { useState, useCallback, memo } from "react";
import { ChevronDown, ChevronUp, Brain, Settings, Key } from "lucide-react";
import { Checkmark } from "../../../components/Checkmark";
import { ModelNodeData } from "@/types/nodeData";

interface ModelConfigFormProps {
  model: ModelNodeData;
  handleInputChange: (field: string, value: string | number) => void;
  onHighlightCharacter?: (nodeName: string) => void;
}

const ModelConfigForm: React.FC<ModelConfigFormProps> = memo(
  ({ model, handleInputChange, onHighlightCharacter }) => {
    const [expandedSections, setExpandedSections] = useState({
      model: true,
      auth: false,
      settings: false,
    });

    // Remove the console.log that's causing the rendering logs

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

    const getModelOptions = () => {
      switch (model.provider) {
        case "openai":
          return [
            { value: "gpt-4-turbo-preview", label: "GPT-4 Turbo" },
            { value: "gpt-4", label: "GPT-4" },
            { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
            { value: "gpt-3.5-turbo-16k", label: "GPT-3.5 Turbo 16K" },
          ];
        case "anthropic":
          return [
            { value: "claude-3-opus-20240229", label: "Claude 3 Opus" },
            { value: "claude-3-sonnet-20240229", label: "Claude 3 Sonnet" },
            { value: "claude-3-haiku-20240307", label: "Claude 3 Haiku" },
            { value: "claude-2.1", label: "Claude 2.1" },
          ];
        case "google":
          return [
            { value: "gemini-pro", label: "Gemini Pro" },
            { value: "gemini-ultra", label: "Gemini Ultra" },
            { value: "gemini-nano", label: "Gemini Nano" },
          ];
        case "meta":
          return [
            { value: "llama-2-70b", label: "Llama 2 70B" },
            { value: "llama-2-13b", label: "Llama 2 13B" },
            { value: "llama-2-7b", label: "Llama 2 7B" },
          ];
        //add a case for deepseek
        case "deepseek":
          return [
            { value: "deepseek-7b", label: "DeepSeek 7B" },
            { value: "deepseek-13b", label: "DeepSeek 13B" },
          ];
        case "local":
          return [
            { value: "mistral-7b", label: "Mistral 7B" },
            { value: "llama-2-7b", label: "Llama 2 7B" },
            { value: "phi-2", label: "Phi-2" },
            { value: "custom", label: "Custom Model" },
          ];
        default:
          return [];
      }
    };

    return (
      <div className="space-y-6 h-full p-6 relative">
        {/* Status Indicator */}
        <div className="absolute top-4 right-4 flex items-center gap-2">
          <Checkmark className="w-4 h-4 text-green-400 drop-shadow-lg" />
          <span className="text-green-400 text-[10px] font-bold capitalize">
            Ready
          </span>
        </div>

        {/* Model Selection */}
        <div className="space-y-4">
          <SectionHeader title="Model Selection" icon={Brain} section="model" />

          {expandedSections.model && (
            <div className="space-y-4 pl-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                  Provider
                </label>
                <select
                  value={model.provider}
                  onChange={(e) => {
                    const provider = e.target.value;
                    handleInputChange("provider", provider);

                    // Highlight the corresponding model in NodesContent
                    if (onHighlightCharacter) {
                      const modelMap: Record<string, string> = {
                        anthropic: "Claude",
                        openai: "OpenAI",
                        google: "Gemini",
                        deepseek: "DeepSeek",
                      };
                      const modelName = modelMap[provider];
                      if (modelName) {
                        onHighlightCharacter(modelName);
                      }
                    }
                  }}
                  className="w-full p-3 bg-bg border border-bg rounded-sm text-white focus:outline-none focus:ring-[0.5px] focus:ring-primary text-sm transition-all duration-300"
                >
                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="google">Google</option>
                  <option value="meta">Meta</option>
                  <option value="deepseek">DeepSeek</option>
                  <option value="local">Local</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                  Model
                </label>
                <select
                  value={model.model}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                  className="w-full p-3 bg-bg border border-bg rounded-sm text-white focus:outline-none focus:ring-[0.5px] focus:ring-primary text-sm transition-all duration-300"
                >
                  <option value="">Select a model...</option>
                  {getModelOptions().map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {model.provider === "local" && model.model === "custom" && (
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                    Custom Model Name
                  </label>
                  <input
                    type="text"
                    value={model.customModel || ""}
                    onChange={(e) =>
                      handleInputChange("customModel", e.target.value)
                    }
                    placeholder="Enter custom model name..."
                    className="w-full p-3 bg-bg border border-bg rounded-sm text-white placeholder-gray-500 focus:outline-none focus:ring-[0.5px] focus:ring-primary transition-all duration-300 text-sm"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Authentication */}
        <div className="space-y-4">
          <SectionHeader title="Authentication" icon={Key} section="auth" />

          {expandedSections.auth && (
            <div className="space-y-4 pl-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                  API Key
                  <span className="text-primary ml-1">*</span>
                </label>
                <input
                  type="password"
                  value={String(model.apiKey || "")}
                  onChange={(e) => handleInputChange("apiKey", e.target.value)}
                  placeholder={
                    model.provider === "openai"
                      ? "sk-..."
                      : model.provider === "anthropic"
                      ? "sk-ant-..."
                      : model.provider === "google"
                      ? "AI..."
                      : "Enter API key..."
                  }
                  className="w-full p-3 bg-bg border border-bg rounded-sm text-white placeholder-gray-500 focus:outline-none focus:ring-[0.5px] focus:ring-primary transition-all duration-300 text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Model Settings */}
        <div className="space-y-4">
          <SectionHeader
            title="Model Settings"
            icon={Settings}
            section="settings"
          />

          {expandedSections.settings && (
            <div className="space-y-4 pl-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                  Temperature ({model.temperature || 0.7})
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={model.temperature || 0.7}
                  onChange={(e) =>
                    handleInputChange("temperature", parseFloat(e.target.value))
                  }
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-white/50 mt-1">
                  <span>Focused</span>
                  <span>Balanced</span>
                  <span>Creative</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

ModelConfigForm.displayName = "ModelConfigForm";

export default ModelConfigForm;
