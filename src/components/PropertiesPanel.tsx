"use client";

import React, { useState, useEffect } from "react";
import { Node } from "@xyflow/react";
import { X, Settings, Trash2 } from "lucide-react";

interface PropertiesPanelProps {
  node: Node;
  onUpdateNode: (nodeId: string, data: Record<string, unknown>) => void;
  onDeleteNode: (nodeId: string) => void;
  onClose: () => void;
}

interface NodeData {
  characterName: string;
  personality: string;
  framework: string;
  configured: boolean;
  label?: string;
  provider: string;
  model: string;
  apiKey?: string;
  temperature?: number;
  voice?: string;
  language?: string;
  speed?: number;
  service?: string;
  endpoint?: string;
  condition?: string;
  expression?: string;
  type?: string;
  template?: string;
  description?: string;
  tags?: string;
  enabled?: boolean;
  customModel?: string;
}

export function PropertiesPanel({
  node,
  onUpdateNode,
  onDeleteNode,
  onClose,
}: PropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState("config");
  const [localNodeData, setLocalNodeData] = useState<NodeData>(() => ({
    characterName: "",
    personality: "",
    framework: "elizaos",
    configured: false,
    provider: "openai",
    model: "",
    ...(node.data || {}),
  }));

  useEffect(() => {
    setLocalNodeData((prev) => ({
      ...prev,
      ...(node.data || {}),
    }));
  }, [node.data]);

  const handleInputChange = (
    field: string,
    value: string | number | boolean
  ) => {
    console.log("Input change:", field, value, "for node:", node.id);
    console.log("Previous nodeData:", localNodeData);
    // Update local state
    const updatedData = {
      ...localNodeData,
      [field]: value,
    };
    setLocalNodeData(updatedData);
    // Update parent component
    onUpdateNode(node.id, updatedData);
  };

  console.log("Current nodeData:", localNodeData);
  console.log("Character name value:", localNodeData.characterName);

  const renderConfigForm = () => {
    switch (node.type) {
      case "framework":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
                Framework
              </label>
              <select
                value={String(localNodeData.framework || "elizaos")}
                onChange={(e) => handleInputChange("framework", e.target.value)}
                className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 transition-all duration-300"
              >
                <option value="elizaos">ElizaOS</option>
                <option value="autogen">AutoGen</option>
                <option value="crewai">CrewAI</option>
                <option value="langchain">LangChain</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
                Character Name
              </label>
              <input
                type="text"
                value={String(localNodeData.characterName || "")}
                onChange={(e) =>
                  handleInputChange("characterName", e.target.value)
                }
                placeholder="Enter agent name..."
                className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
                Personality
              </label>
              <textarea
                value={String(localNodeData.personality || "")}
                onChange={(e) =>
                  handleInputChange("personality", e.target.value)
                }
                placeholder="Describe the agent's personality..."
                rows={3}
                className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 transition-all duration-300 resize-none"
              />
            </div>
          </div>
        );

      case "model":
        const getModelOptions = () => {
          console.log("Current provider:", localNodeData.provider);
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
                  console.log("Provider changed to:", e.target.value);
                  const newProvider = e.target.value;
                  setLocalNodeData((prev) => ({
                    ...prev,
                    provider: newProvider,
                    model: "", // Reset model when provider changes
                  }));
                  onUpdateNode(node.id, {
                    ...localNodeData,
                    provider: newProvider,
                    model: "",
                  });
                }}
                className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 transition-all duration-300"
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
                onChange={(e) => {
                  console.log("Model changed to:", e.target.value);
                  handleInputChange("model", e.target.value);
                }}
                className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 transition-all duration-300"
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
                    onChange={(e) =>
                      handleInputChange("customModel", e.target.value)
                    }
                    placeholder="Enter custom model name..."
                    className="w-full p-3 mt-2 bg-dark border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 transition-all duration-300"
                  />
                )}
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
                API Key
                <span className="text-lime-400 ml-1">*</span>
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
                className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 transition-all duration-300"
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
                className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 transition-all duration-300"
              />
              <p className="text-xs text-gray-500 mt-1 font-mono">
                Controls randomness (0.0 - 2.0)
              </p>
            </div>
          </div>
        );

      case "voice":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
                Voice Model
              </label>
              <select
                value={String(localNodeData.voice || "alloy")}
                onChange={(e) => handleInputChange("voice", e.target.value)}
                className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 transition-all duration-300"
              >
                <option value="alloy">Alloy</option>
                <option value="echo">Echo</option>
                <option value="fable">Fable</option>
                <option value="onyx">Onyx</option>
                <option value="nova">Nova</option>
                <option value="shimmer">Shimmer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
                Language
              </label>
              <select
                value={String(localNodeData.language || "en")}
                onChange={(e) => handleInputChange("language", e.target.value)}
                className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 transition-all duration-300"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="it">Italian</option>
                <option value="pt">Portuguese</option>
                <option value="zh">Chinese</option>
                <option value="ja">Japanese</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
                Speed
              </label>
              <input
                type="range"
                min="0.25"
                max="4.0"
                step="0.25"
                value={Number(localNodeData.speed || 1.0)}
                onChange={(e) =>
                  handleInputChange("speed", parseFloat(e.target.value))
                }
                className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer slider-lime"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0.25x</span>
                <span className="text-lime-400">
                  {Number(localNodeData.speed || 1.0)}x
                </span>
                <span>4.0x</span>
              </div>
            </div>
          </div>
        );

      case "integration":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
                Service
              </label>
              <select
                value={String(localNodeData.service || "twitter")}
                onChange={(e) => handleInputChange("service", e.target.value)}
                className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 transition-all duration-300"
              >
                <option value="twitter">Twitter/X</option>
                <option value="discord">Discord</option>
                <option value="telegram">Telegram</option>
                <option value="slack">Slack</option>
                <option value="blockchain">Blockchain</option>
                <option value="webhook">Webhook</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
                API Key/Token
                <span className="text-lime-400 ml-1">*</span>
              </label>
              <input
                type="password"
                value={String(localNodeData.apiKey || "")}
                onChange={(e) => handleInputChange("apiKey", e.target.value)}
                placeholder="Enter API key or token..."
                className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
                Endpoint URL
              </label>
              <input
                type="url"
                value={String(localNodeData.endpoint || "")}
                onChange={(e) => handleInputChange("endpoint", e.target.value)}
                placeholder="https://api.example.com"
                className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 transition-all duration-300"
              />
            </div>
          </div>
        );

      case "logic":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
                Logic Type
              </label>
              <select
                value={String(localNodeData.condition || "if")}
                onChange={(e) => handleInputChange("condition", e.target.value)}
                className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 transition-all duration-300"
              >
                <option value="if">If/Then</option>
                <option value="switch">Switch/Case</option>
                <option value="loop">Loop</option>
                <option value="filter">Filter</option>
                <option value="transform">Transform</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
                Condition
              </label>
              <textarea
                value={String(localNodeData.expression || "")}
                onChange={(e) =>
                  handleInputChange("expression", e.target.value)
                }
                placeholder="Enter condition logic..."
                rows={3}
                className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 transition-all duration-300 resize-none font-mono text-sm"
              />
            </div>
          </div>
        );

      case "output":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
                Output Type
              </label>
              <select
                value={String(localNodeData.type || "text")}
                onChange={(e) => handleInputChange("type", e.target.value)}
                className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 transition-all duration-300"
              >
                <option value="text">Text</option>
                <option value="action">Action</option>
                <option value="webhook">Webhook</option>
                <option value="file">File</option>
                <option value="email">Email</option>
                <option value="notification">Notification</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
                Format Template
              </label>
              <textarea
                value={String(localNodeData.template || "")}
                onChange={(e) => handleInputChange("template", e.target.value)}
                placeholder="Output format template..."
                rows={3}
                className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 transition-all duration-300 resize-none font-mono text-sm"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-gray-500 text-sm font-mono p-4 bg-dark rounded-lg border border-gray-800">
            Configuration options for this node type will be available soon.
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-dark">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 flex items-center justify-between">
        <h2 className="text-lg font-semibold  text-white tracking-wide">
          NODE PROPERTIES
        </h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Node Info */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center">
            <Settings className="w-4 h-4 text-black" />
          </div>
          <div>
            <h3 className="font-bold text-white tracking-wide">
              {String(localNodeData.label || "NODE")}
            </h3>
            <p className="text-xs text-gray-500 font-mono">ID: {node.id}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setActiveTab("config")}
          className={`flex-1 py-3 px-4 text-sm font-bold tracking-wide ${
            activeTab === "config"
              ? "text-lime-400 border-b-2 border-lime-400"
              : "text-gray-500 hover:text-white"
          }`}
        >
          CONFIGURATION
        </button>
        <button
          onClick={() => setActiveTab("advanced")}
          className={`flex-1 py-3 px-4 text-sm font-bold tracking-wide ${
            activeTab === "advanced"
              ? "text-lime-400 border-b-2 border-lime-400"
              : "text-gray-500 hover:text-white"
          }`}
        >
          ADVANCED
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "config" ? (
          renderConfigForm()
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
                Node ID
              </label>
              <input
                type="text"
                value={node.id}
                readOnly
                className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-gray-500 cursor-not-allowed font-mono text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
                Position
              </label>
              <div className="flex space-x-2">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">X</label>
                  <input
                    type="number"
                    value={Math.round(node.position.x)}
                    readOnly
                    className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-gray-500 cursor-not-allowed font-mono text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">Y</label>
                  <input
                    type="number"
                    value={Math.round(node.position.y)}
                    readOnly
                    className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-gray-500 cursor-not-allowed font-mono text-sm"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
                Custom Label
              </label>
              <input
                type="text"
                value={String(localNodeData.label || "")}
                onChange={(e) => handleInputChange("label", e.target.value)}
                placeholder="Custom node label..."
                className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
                Description
              </label>
              <textarea
                value={String(localNodeData.description || "")}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Node description for documentation..."
                rows={3}
                className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 transition-all duration-300 resize-none text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
                Tags
              </label>
              <input
                type="text"
                value={String(localNodeData.tags || "")}
                onChange={(e) => handleInputChange("tags", e.target.value)}
                placeholder="production, beta, experimental"
                className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-lime-400 transition-all duration-300 font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Comma-separated tags for organization
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="enabled"
                checked={Boolean(localNodeData.enabled !== false)}
                onChange={(e) => handleInputChange("enabled", e.target.checked)}
                className="w-4 h-4 text-lime-400 bg-dark border border-gray-800 rounded focus:ring-lime-400 focus:ring-2"
              />
              <label
                htmlFor="enabled"
                className="text-sm font-bold text-gray-300 tracking-wide uppercase"
              >
                Node Enabled
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t border-gray-800 space-y-3">
        <button
          onClick={() => handleInputChange("configured", true)}
          className="w-full p-3 fraktia-btn-primary rounded-lg text-black text-sm font-bold transition-all transform hover:scale-105 tracking-wide"
        >
          MARK AS CONFIGURED
        </button>
        <div className="flex space-x-2">
          <button className="flex-1 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm font-bold transition-all border border-gray-700 hover:border-gray-600">
            CLONE
          </button>
        </div>
        <button
          onClick={() => onDeleteNode(node.id)}
          className="w-full p-3 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-bold transition-all flex items-center justify-center space-x-2 border border-red-500"
        >
          <Trash2 className="w-4 h-4" />
          <span>DELETE NODE</span>
        </button>
      </div>
    </div>
  );
}
