"use client";

import React, { useState, useCallback } from "react";
import FrameworkConfigForm from "@/app/components/config/FrameworkConfigForm";
import VoiceConfigForm from "@/app/components/config/VoiceConfigForm";
import ModelConfigForm from "@/app/components/config/ModelConfigForm";
import PluginConfigForm from "@/app/components/config/PluginConfigForm";
import LogicConfigForm from "@/app/components/config/LogicConfigForm";
import OutputConfigForm from "@/app/components/config/OutputConfigForm";
import CharacterConfigForm from "@/app/components/config/CharacterConfigForm";
import { Node } from "@xyflow/react";
import {
  CharacterNodeData,
  FrameworkNodeData,
  ModelNodeData,
  VoiceNodeData,
  PluginNodeData,
  LogicNodeData,
  OutputNodeData,
  NodeData,
} from "@/types/nodeData";

interface PropertiesContentProps {
  node: Node;
  onUpdateNode: (nodeId: string, data: Record<string, unknown>) => void;
}

export function PropertiesContent({
  node,
  onUpdateNode,
}: PropertiesContentProps) {
  const [localNodeData, setLocalNodeData] = useState<NodeData>(() => {
    const defaultData: Record<string, unknown> = {
      configured: false,
      ...(node.data || {}),
    };

    // Set type-specific defaults
    switch (node.type) {
      case "character":
        return {
          characterName: "",
          system: "",
          bio: [],
          messageExamples: [],
          postExamples: [],
          adjectives: [],
          topics: [],
          style: { all: [], chat: [], post: [] },
          configured: false,
          ...defaultData,
        } as CharacterNodeData;
      case "framework":
        return {
          label: "Framework",
          framework: "elizaos",
          configured: false,
          ...defaultData,
        } as FrameworkNodeData;
      case "model":
        return {
          provider: "openai",
          model: "",
          configured: false,
          ...defaultData,
        } as ModelNodeData;
      case "voice":
        return {
          configured: false,
          ...defaultData,
        } as VoiceNodeData;
      case "plugin":
        return {
          service: "twitter",
          twitterDryRun: false,
          twitterTargetUsers: "",
          twitterRetryLimit: 5,
          twitterPollInterval: 120,
          twitterPostEnable: false,
          twitterPostIntervalMin: 90,
          twitterPostIntervalMax: 180,
          twitterPostImmediately: false,
          twitterPostIntervalVariance: 0.2,
          twitterSearchEnable: true,
          twitterInteractionIntervalMin: 15,
          twitterInteractionIntervalMax: 30,
          twitterInteractionIntervalVariance: 0.3,
          twitterAutoRespondMentions: true,
          twitterAutoRespondReplies: true,
          twitterMaxInteractionsPerRun: 10,
          twitterTimelineAlgorithm: "weighted",
          twitterTimelineUserBasedWeight: 3,
          twitterTimelineTimeBasedWeight: 2,
          twitterTimelineRelevanceWeight: 5,
          twitterMaxTweetLength: 4000,
          twitterDmOnly: false,
          twitterEnableActionProcessing: false,
          twitterActionInterval: 240,
          configured: false,
          ...defaultData,
        } as PluginNodeData;
      case "logic":
        return {
          configured: false,
          ...defaultData,
        } as LogicNodeData;
      case "output":
        return {
          configured: false,
          ...defaultData,
        } as OutputNodeData;
      default:
        return defaultData as NodeData;
    }
  });

  const handleInputChange = useCallback(
    (field: string, value: string | number | boolean | object) => {
      console.log("Input change:", field, value, "for node:", node.id);

      // Update local state
      setLocalNodeData((prev) => {
        const updatedData = {
          ...prev,
          [field]: value,
        };

        // Schedule parent update after the current render cycle
        setTimeout(() => {
          onUpdateNode(node.id, updatedData);
        }, 0);

        return updatedData;
      });
    },
    [node.id, onUpdateNode]
  );

  const handleArrayInputChange = useCallback(
    (field: string, value: string, index: number) => {
      setLocalNodeData((prev) => {
        const currentArray =
          ((prev as Record<string, unknown>)[field] as string[]) || [];
        const updatedArray = [...currentArray];
        updatedArray[index] = value;

        const updatedData = {
          ...prev,
          [field]: updatedArray,
        };

        // Schedule parent update after the current render cycle
        setTimeout(() => {
          onUpdateNode(node.id, updatedData);
        }, 0);

        return updatedData;
      });
    },
    [node.id, onUpdateNode]
  );

  const addArrayItem = useCallback(
    (field: string) => {
      setLocalNodeData((prev) => {
        const currentArray =
          ((prev as Record<string, unknown>)[field] as string[]) || [];
        const updatedArray = [...currentArray, ""];

        const updatedData = {
          ...prev,
          [field]: updatedArray,
        };

        // Schedule parent update after the current render cycle
        setTimeout(() => {
          onUpdateNode(node.id, updatedData);
        }, 0);

        return updatedData;
      });
    },
    [node.id, onUpdateNode]
  );

  const removeArrayItem = useCallback(
    (field: string, index: number) => {
      setLocalNodeData((prev) => {
        const currentArray =
          ((prev as Record<string, unknown>)[field] as string[]) || [];
        const updatedArray = currentArray.filter((_, i) => i !== index);

        const updatedData = {
          ...prev,
          [field]: updatedArray,
        };

        // Schedule parent update after the current render cycle
        setTimeout(() => {
          onUpdateNode(node.id, updatedData);
        }, 0);

        return updatedData;
      });
    },
    [node.id, onUpdateNode]
  );

  const renderConfigForm = () => {
    switch (node.type) {
      case "character":
        return (
          <CharacterConfigForm
            localNodeData={localNodeData as CharacterNodeData}
            handleInputChange={handleInputChange}
            handleArrayInputChange={handleArrayInputChange}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
            onUpdateNode={onUpdateNode}
            nodeId={node.id}
            setLocalNodeData={setLocalNodeData}
          />
        );
      case "framework":
        return (
          <FrameworkConfigForm
            localNodeData={localNodeData as FrameworkNodeData}
          />
        );
      case "model":
        return (
          <ModelConfigForm
            localNodeData={localNodeData as ModelNodeData}
            handleInputChange={handleInputChange}
            setLocalNodeData={
              setLocalNodeData as React.Dispatch<
                React.SetStateAction<ModelNodeData>
              >
            }
            onUpdateNode={(nodeId: string, data: ModelNodeData) =>
              onUpdateNode(nodeId, data as unknown as Record<string, unknown>)
            }
            nodeId={node.id}
          />
        );
      case "voice":
        return (
          <VoiceConfigForm
            localNodeData={localNodeData as VoiceNodeData}
            handleInputChange={handleInputChange}
          />
        );
      case "plugin":
        return (
          <PluginConfigForm
            localNodeData={localNodeData as PluginNodeData}
            handleInputChange={handleInputChange}
          />
        );
      case "logic":
        return (
          <LogicConfigForm
            localNodeData={localNodeData as LogicNodeData}
            handleInputChange={handleInputChange}
          />
        );
      case "output":
        return (
          <OutputConfigForm
            localNodeData={localNodeData as OutputNodeData}
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

  return (
    <div className="h-full flex flex-col">
      {/* Content */}
      <section className="flex-1  overflow-y-auto  bg-dark">
        <div className="max-w-full  h-full mx-auto">{renderConfigForm()}</div>
      </section>

      {/* Actions */}
      {/* <footer className="px-4 py-4 bg-dark border-t border-dark/60 space-y-3 flex flex-col md:px-6">
        <button
          onClick={() => onDeleteNode(node.id)}
          className="w-full p-3 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-bold transition-all flex items-center justify-center space-x-2 border border-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400 shadow-sm"
        >
          <Trash2 className="w-4 h-4" />
          <span>DELETE NODE</span>
        </button>
      </footer> */}
    </div>
  );
}
