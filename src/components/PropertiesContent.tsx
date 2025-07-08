"use client";

import React, { useState, useCallback, useEffect } from "react";
import FrameworkConfigForm from "@/components/config/FrameworkConfigForm";
import VoiceConfigForm from "@/components/config/VoiceConfigForm";
import ModelConfigForm from "@/components/config/ModelConfigForm";
import PluginConfigForm from "@/components/config/PluginConfigForm";
import CharacterConfigForm from "@/components/config/CharacterConfigForm";
import { Node } from "@xyflow/react";
import {
  CharacterNodeData,
  FrameworkNodeData,
  ModelNodeData,
  VoiceNodeData,
  PluginNodeData,
  NodeData,
} from "@/types/nodeData";

interface PropertiesContentProps {
  node: Node;
  onUpdateNode: (nodeId: string, data: Record<string, unknown>) => void;
  onHighlightCharacter?: (nodeName: string) => void;
}

export function PropertiesContent({
  node,
  onUpdateNode,
  onHighlightCharacter,
}: PropertiesContentProps) {
  const [localNodeData, setLocalNodeData] = useState<NodeData>(() => {
    const defaultData: Record<string, unknown> = {
      configured: false,
      ...(node.data || {}),
    };
    return defaultData;
  });

  // Sync local data when the node changes
  useEffect(() => {
    const newData: Record<string, unknown> = {
      configured: false,
      ...(node.data || {}),
    };
    setLocalNodeData(newData);
  }, [node.id, node.data]); // Re-run when node ID or data changes

  const handleInputChange = useCallback(
    (field: string, value: string | number | boolean | object) => {
      console.log("Input change:", field, value, "for node:", node.id);

      // Update local state
      setLocalNodeData((prev) => {
        const updatedData = {
          ...prev,
          [field]: value,
        };

        // Schedule parent update with only the changed field after the current render cycle
        setTimeout(() => {
          onUpdateNode(node.id, { [field]: value });
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
        // console.log("localNodeData:", localNodeData, node);
        return (
          <CharacterConfigForm
            character={localNodeData as CharacterNodeData}
            handleInputChange={handleInputChange}
            handleArrayInputChange={handleArrayInputChange}
            addArrayItem={addArrayItem}
            removeArrayItem={removeArrayItem}
            onUpdateNode={onUpdateNode}
            nodeId={node.id}
            setLocalNodeData={setLocalNodeData}
            onHighlightCharacter={onHighlightCharacter}
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
            model={localNodeData as ModelNodeData}
            handleInputChange={handleInputChange}
            // setLocalNodeData={
            //   setLocalNodeData as React.Dispatch<
            //     React.SetStateAction<ModelNodeData>
            //   >
            // }
            // onUpdateNode={(nodeId: string, data: ModelNodeData) =>
            //   onUpdateNode(nodeId, data as unknown as Record<string, unknown>)
            // }
            // nodeId={node.id}
            onHighlightCharacter={onHighlightCharacter}
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
      <section className="flex-1  overflow-y-auto scrollbar-hide bg-dark">
        <div className="max-w-full  h-full mx-auto">{renderConfigForm()}</div>
      </section>
    </div>
  );
}
