"use client";

import React, { useState, useEffect } from "react";
import FrameworkConfigForm from "@/app/components/config/FrameworkConfigForm";
import VoiceConfigForm from "@/app/components/config/VoiceConfigForm";
import ModelConfigForm from "@/app/components/config/ModelConfigForm";
import IntegrationConfigForm from "@/app/components/config/IntegrationConfigForm";
import LogicConfigForm from "@/app/components/config/LogicConfigForm";
import OutputConfigForm from "@/app/components/config/OutputConfigForm";
import CharacterConfigForm from "@/app/components/config/CharacterConfigForm";
import { Node } from "@xyflow/react";
import { X, Trash2 } from "lucide-react";
import { characterConfigs } from "@/constants/characters";

interface PropertiesPanelProps {
  node: Node;
  onUpdateNode: (nodeId: string, data: Record<string, unknown>) => void;
  onDeleteNode: (nodeId: string) => void;
  onClose: () => void;
}

interface NodeData {
  // Character fields
  characterId?: string;
  characterName?: string;
  customBio?: string[];
  customPersonality?: string;
  customAdjectives?: string[];
  customTopics?: string[];
  characterVoice?: {
    model: string;
    language?: string;
    speed?: number;
    pitch?: number;
  };
  behavior?: {
    temperature: number;
    maxTokens: number;
    responseStyle: "casual" | "formal" | "creative" | "technical";
    conversationLength: "short" | "medium" | "long";
  };
  memory?: {
    enabled: boolean;
    maxContextLength: number;
    rememberUserPreferences: boolean;
    conversationHistory: boolean;
  };
  plugins?: {
    enabled: string[];
    disabled: string[];
    customConfig?: Record<string, unknown>;
  };

  // Framework fields
  personality: string;
  framework: string;
  configured: boolean;
  label?: string;

  // Model fields
  provider: string;
  model: string;
  apiKey?: string;
  temperature?: number;
  customModel?: string;

  // Voice fields
  voice?: string;
  language?: string;
  speed?: number;

  // Integration fields
  service?: string;
  endpoint?: string;

  // Logic fields
  condition?: string;
  expression?: string;

  // Output fields
  type?: string;
  template?: string;

  // General fields
  description?: string;
  tags?: string;
  enabled?: boolean;
}

export function PropertiesPanel({
  node,
  onUpdateNode,
  onDeleteNode,
  onClose,
}: PropertiesPanelProps) {
  const [localNodeData, setLocalNodeData] = useState<NodeData>(() => ({
    characterName: "",
    personality: "",
    framework: "elizaos",
    configured: false,
    provider: "openai",
    model: "",
    ...(node.data || {}),
  }));

  const handleInputChange = (
    field: string,
    value: string | number | boolean | object
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

  // const handleObjectFieldChange = (
  //   objectField: string,
  //   field: string,
  //   value: string | number | boolean | string[]
  // ) => {
  //   const currentObject =
  //     (localNodeData[objectField as keyof NodeData] as Record<
  //       string,
  //       unknown
  //     >) || {};
  //   const updatedObject = {
  //     ...currentObject,
  //     [field]: value,
  //   };

  //   const updatedData = {
  //     ...localNodeData,
  //     [objectField]: updatedObject,
  //   };
  //   setLocalNodeData(updatedData);
  //   onUpdateNode(node.id, updatedData);
  // };

  const handleArrayInputChange = (
    field: string,
    value: string,
    index: number
  ) => {
    const currentArray =
      (localNodeData[field as keyof NodeData] as string[]) || [];
    const updatedArray = [...currentArray];
    updatedArray[index] = value;

    const updatedData = {
      ...localNodeData,
      [field]: updatedArray,
    };
    setLocalNodeData(updatedData);
    onUpdateNode(node.id, updatedData);
  };

  const addArrayItem = (field: string) => {
    const currentArray =
      (localNodeData[field as keyof NodeData] as string[]) || [];
    const updatedArray = [...currentArray, ""];

    const updatedData = {
      ...localNodeData,
      [field]: updatedArray,
    };
    setLocalNodeData(updatedData);
    onUpdateNode(node.id, updatedData);
  };

  const removeArrayItem = (field: string, index: number) => {
    const currentArray =
      (localNodeData[field as keyof NodeData] as string[]) || [];
    const updatedArray = currentArray.filter((_, i) => i !== index);

    const updatedData = {
      ...localNodeData,
      [field]: updatedArray,
    };
    setLocalNodeData(updatedData);
    onUpdateNode(node.id, updatedData);
  };

  console.log("Current nodeData:", localNodeData);
  console.log("Character name value:", localNodeData.characterName);

  const renderConfigForm = () => {
    switch (node.type) {
      case "character":
        return (
          <CharacterConfigForm
            localNodeData={localNodeData}
            handleInputChange={handleInputChange}
            handleArrayInputChange={handleArrayInputChange}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
            characterConfigs={characterConfigs}
            onUpdateNode={onUpdateNode}
            nodeId={node.id}
            setLocalNodeData={setLocalNodeData}
          />
        );
      case "framework":
        return (
          <FrameworkConfigForm
            localNodeData={localNodeData}
            handleInputChange={handleInputChange}
          />
        );
      case "model":
        return (
          <ModelConfigForm
            localNodeData={localNodeData}
            handleInputChange={handleInputChange}
            setLocalNodeData={setLocalNodeData}
            onUpdateNode={onUpdateNode}
            nodeId={node.id}
          />
        );
      case "voice":
        return (
          <VoiceConfigForm
            localNodeData={localNodeData}
            handleInputChange={handleInputChange}
          />
        );
      case "integration":
        return (
          <IntegrationConfigForm
            localNodeData={localNodeData}
            handleInputChange={handleInputChange}
          />
        );
      case "logic":
        return (
          <LogicConfigForm
            localNodeData={localNodeData}
            handleInputChange={handleInputChange}
          />
        );
      case "output":
        return (
          <OutputConfigForm
            localNodeData={localNodeData}
            handleInputChange={handleInputChange}
          />
        );

      default:
        return (
          <div className="text-gray-500 text-sm font-mono p-4 bg-dark rounded-lg border border-gray-800">
            Configuration options for this node type will be available soon.
          </div>
        );
    }
  };

  useEffect(() => {
    setLocalNodeData((prev) => ({
      ...prev,
      ...(node.data || {}),
    }));
  }, [node.data]);

  return (
    <aside
      className="h-full  w-full max-w-md mx-auto flex flex-col bg-dark shadow-xl rounded-2xl border border-dark/60 overflow-hidden transition-all duration-300 md:max-w-sm lg:max-w-md"
      aria-label="Node Properties Panel"
    >
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 bg-dark border-b border-primary/60">
        <h2 className="text-lg font-bold text-white tracking-wide uppercase">
          Configuration
        </h2>
        <button
          onClick={onClose}
          aria-label="Close properties panel"
          className="text-gray-400 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </header>

      {/* Content */}
      {/* <section className="flex-1 overflow-y-auto px-4 py-6 bg-bg md:px-6">
        <div className="max-w-full mx-auto">{renderConfigForm()}</div>
      </section> */}

      {/* Actions */}
      <footer className="px-4 py-4 bg-dark border-t border-dark/60 space-y-3 flex flex-col md:px-6">
        <button
          onClick={() => handleInputChange("configured", true)}
          className="w-full p-3 bg-primary/90 hover:bg-primary text-bg rounded-lg text-sm font-bold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary tracking-wide shadow-sm"
        >
          MARK AS CONFIGURED
        </button>
        <button
          onClick={() => onDeleteNode(node.id)}
          className="w-full p-3 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-bold transition-all flex items-center justify-center space-x-2 border border-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 shadow-sm"
        >
          <Trash2 className="w-4 h-4" />
          <span>DELETE NODE</span>
        </button>
      </footer>
    </aside>
  );
}
