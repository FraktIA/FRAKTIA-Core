import React, { useState, useCallback, memo, useEffect } from "react";
import { Brain } from "lucide-react";
// import { Checkmark } from "../Checkmark";
import { ModelConfigFormProps } from "@/types/configForms";
import SectionHeader from "./SectionHeader";
import FormSelect from "../form/FormSelect";

const ModelConfigForm: React.FC<ModelConfigFormProps> = memo(
  ({ model, handleInputChange, onHighlightCharacter }) => {
    const [expandedSections, setExpandedSections] = useState({
      model: true,
      auth: false,
      settings: false,
    });

    // Validation function to check if the node should be marked as configured
    const isModelConfigured = useCallback(() => {
      return true;
    }, []);

    // Effect to update configured status whenever validation criteria changes
    useEffect(() => {
      const configured = isModelConfigured();
      if (model.configured !== configured) {
        handleInputChange("configured", configured);
      }
    }, [
      model.provider,
      model.model,
      model.configured,
      handleInputChange,
      isModelConfigured,
    ]);

    const toggleSection = useCallback((section: string) => {
      setExpandedSections((prev) => ({
        ...prev,
        [section as keyof typeof prev]: !prev[section as keyof typeof prev],
      }));
    }, []);

    const getModelOptions = () => {
      switch (model.provider) {
        case "openai":
          return [
            { value: "gpt-4.1", label: "GPT-4.1" },
            { value: "gpt-4.1-mini", label: "GPT-4.1 Mini" },
            { value: "gpt-4.1-nano", label: "GPT-4.1 Nano" },
            { value: "gpt-4.5-preview", label: "GPT-4.5 Preview" },
            { value: "gpt-4o", label: "GPT-4o" },
            { value: "gpt-4o-2024-11-20", label: "GPT-4o (Nov 2024)" },
            { value: "gpt-4o-mini", label: "GPT-4o Mini" },
            { value: "chatgpt-4o-latest", label: "ChatGPT-4o Latest" },
            { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
            { value: "gpt-4", label: "GPT-4" },
            { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
          ];
        case "anthropic":
          return [
            { value: "claude-opus-4-20250514", label: "Claude Opus 4" },
            { value: "claude-sonnet-4-20250514", label: "Claude Sonnet 4" },
            { value: "claude-3-7-sonnet-20250219", label: "Claude Sonnet 3.7" },
            {
              value: "claude-3-5-sonnet-20241022",
              label: "Claude Sonnet 3.5 v2",
            },
            { value: "claude-3-5-sonnet-20240620", label: "Claude Sonnet 3.5" },
            { value: "claude-3-5-haiku-20241022", label: "Claude Haiku 3.5" },
            { value: "claude-3-haiku-20240307", label: "Claude Haiku 3" },
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
            { value: "deepseek-chat", label: "DeepSeek Chat" },
            { value: "deepseek-reasoner", label: "DeepSeek Reasoner" },
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
        {/* Model Selection */}
        <div className="space-y-4">
          <SectionHeader
            title="Model Selection"
            icon={Brain}
            section="model"
            isExpanded={expandedSections.model}
            onToggle={toggleSection}
          />

          {expandedSections.model && (
            <div className="space-y-4 pl-6">
              <FormSelect
                label="Provider"
                value={model.provider}
                onChange={(value) => {
                  const provider = value;
                  handleInputChange("provider", provider);
                  handleInputChange("label", provider);

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
                options={[
                  { value: "openai", label: "OpenAI" },
                  { value: "anthropic", label: "Anthropic" },
                  // { value: "google", label: "Google" },
                  // { value: "meta", label: "Meta" },
                  // { value: "deepseek", label: "DeepSeek" },
                  // { value: "local", label: "Local" },
                ]}
              />

              <FormSelect
                label="Small Model"
                value={model.model_small || ""}
                onChange={(value) => handleInputChange("model_small", value)}
                options={[
                  { value: "", label: "Select a small model..." },
                  ...getModelOptions().map((option) => ({
                    value: option.value,
                    label: option.label,
                  })),
                ]}
                placeholder="Select a small model..."
              />

              <FormSelect
                label="Large Model"
                value={model.model_large || ""}
                onChange={(value) => handleInputChange("model_large", value)}
                options={[
                  { value: "", label: "Select a large model..." },
                  ...getModelOptions().map((option) => ({
                    value: option.value,
                    label: option.label,
                  })),
                ]}
                placeholder="Select a large model..."
              />
            </div>
          )}
        </div>

        {/* Authentication */}
        {/* <div className="space-y-4">
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
                label="API Key"
                value={String(model.apiKey || "")}
                onChange={(value) => handleInputChange("apiKey", value)}
                type="password"
                placeholder={
                  model.provider === "openai"
                    ? "sk-..."
                    : model.provider === "anthropic"
                    ? "sk-ant-..."
                    : model.provider === "google"
                    ? "AI..."
                    : "Enter API key..."
                }
                required
              />
            </div>
          )}
        </div>*/}

        {/* Model Settings */}
        {/* <div className="space-y-4">
          <SectionHeader
            title="Model Settings"
            icon={Settings}
            section="settings"
            isExpanded={expandedSections.settings}
            onToggle={toggleSection}
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
        </div> */}
      </div>
    );
  }
);

ModelConfigForm.displayName = "ModelConfigForm";

export default ModelConfigForm;
