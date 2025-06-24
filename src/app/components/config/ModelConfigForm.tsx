import React from "react";

interface ModelConfigFormProps {
  localNodeData: any;
  handleInputChange: (field: string, value: any) => void;
  setLocalNodeData: (updater: (prev: any) => any) => void;
  onUpdateNode: (nodeId: string, data: any) => void;
  nodeId: string;
}

const ModelConfigForm: React.FC<ModelConfigFormProps> = ({
  localNodeData,
  handleInputChange,
  setLocalNodeData,
  onUpdateNode,
  nodeId,
}) => {
  const getModelOptions = () => {
    switch (localNodeData.provider) {
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
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
          Provider
        </label>
        <select
          value={localNodeData.provider}
          onChange={(e) => {
            const newProvider = e.target.value;
            setLocalNodeData((prev: any) => ({
              ...prev,
              provider: newProvider,
              model: "",
            }));
            onUpdateNode(nodeId, {
              ...localNodeData,
              provider: newProvider,
              model: "",
            });
          }}
          className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
        >
          <option value="openai">OpenAI</option>
          <option value="anthropic">Anthropic</option>
          <option value="google">Google</option>
          <option value="meta">Meta</option>
          <option value="local">Local</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
          Model
        </label>
        <select
          value={localNodeData.model}
          onChange={(e) => handleInputChange("model", e.target.value)}
          className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
        >
          <option value="">Select a model...</option>
          {getModelOptions().map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {localNodeData.provider === "local" &&
          localNodeData.model === "custom" && (
            <input
              type="text"
              value={String(localNodeData.customModel || "")}
              onChange={(e) => handleInputChange("customModel", e.target.value)}
              placeholder="Enter custom model name..."
              className="w-full p-3 mt-2 bg-dark border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
            />
          )}
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
          API Key
          <span className="text-primary ml-1">*</span>
        </label>
        <input
          type="password"
          value={String(localNodeData.apiKey || "")}
          onChange={(e) => handleInputChange("apiKey", e.target.value)}
          placeholder={
            localNodeData.provider === "openai"
              ? "sk-..."
              : localNodeData.provider === "anthropic"
              ? "sk-ant-..."
              : localNodeData.provider === "google"
              ? "Enter API key..."
              : localNodeData.provider === "meta"
              ? "Enter API key..."
              : "Not required for local models"
          }
          className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
        />
        <p className="text-xs text-gray-500 mt-1 font-mono">
          {localNodeData.provider === "openai"
            ? "Required for OpenAI models"
            : localNodeData.provider === "anthropic"
            ? "Required for Anthropic models"
            : localNodeData.provider === "google"
            ? "Required for Google models"
            : localNodeData.provider === "meta"
            ? "Required for Meta models"
            : "Not required for local models"}
        </p>
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
          Temperature
        </label>
        <input
          type="number"
          min="0"
          max="2"
          step="0.1"
          value={Number(localNodeData.temperature || 0.7)}
          onChange={(e) =>
            handleInputChange("temperature", parseFloat(e.target.value))
          }
          className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
        />
        <p className="text-xs text-gray-500 mt-1 font-mono">
          Controls randomness (0.0 - 2.0)
        </p>
      </div>
    </div>
  );
};

export default ModelConfigForm;
