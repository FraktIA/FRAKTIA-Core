"use client";
import Header from "@/components/Header";
import Modal from "@/components/Modal";
import NoAccessComponent from "@/components/NoAccessComponent";
import { useEffect, useState, useCallback, useRef } from "react";
import { Node } from "@xyflow/react";
import { CharacterConfig } from "@/types/nodes";

import AgentBuilder, { AgentBuilderRef } from "@/components/AgentBuilder";
import AgentChat from "@/components/AgentChat";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { UnifiedPanel } from "@/components/UnifiedPanel";
import { setShowNodesPanel, selectActiveMenu } from "@/redux/slices/uiSlice";
// import { useAppKitAccount } from "@reown/appkit/react";
// import { useRouter } from "next/navigation";

export default function Manage() {
  const [allowed, setAllowed] = useState(false);
  const [currentNodes, setCurrentNodes] = useState<
    Array<{ type?: string; data?: { label?: string } }>
  >([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  // const { isConnected } = useAppKitAccount();
  const { showNodesPanel } = useAppSelector((state) => state.ui);
  const activeMenu = useAppSelector(selectActiveMenu);
  // const router = useRouter();
  const agentBuilderRef = useRef<AgentBuilderRef | null>(null);
  const dispatch = useAppDispatch();

  // Function to update current nodes from AgentBuilder
  const updateCurrentNodes = useCallback(() => {
    if (agentBuilderRef.current) {
      const nodes = agentBuilderRef.current.getCurrentNodes();
      setCurrentNodes(
        nodes.map((node) => ({ type: node.type, data: node.data }))
      );
    }
  }, []);

  // Function to sync selected node from AgentBuilder
  const updateSelectedNode = useCallback(() => {
    if (agentBuilderRef.current) {
      const selected = agentBuilderRef.current.getSelectedNode();
      setSelectedNode(selected);
    }
  }, []);

  // Update nodes and selected node periodically
  useEffect(() => {
    const interval = setInterval(() => {
      updateCurrentNodes();
      updateSelectedNode();
    }, 500); // Update every 500ms
    return () => clearInterval(interval);
  }, [updateCurrentNodes, updateSelectedNode]);

  // useEffect(() => {
  //   if (!isConnected) {
  //     router.push("/");
  //   }
  // }, [isConnected, router]);

  const handleAddNode = useCallback(
    (nodeName: string, position?: { x: number; y: number }) => {
      if (agentBuilderRef.current) {
        agentBuilderRef.current.onAddNode(nodeName, position);
      }
    },
    []
  );

  const handleUpdateNode = useCallback(
    (nodeId: string, data: Record<string, unknown>) => {
      if (agentBuilderRef.current) {
        agentBuilderRef.current.onUpdateNode(nodeId, data);
      }
    },
    []
  );

  // Helper function to get node type from node name
  const getNodeType = (nodeName: string): string => {
    const nodeTypeMap: Record<string, string> = {
      // Framework nodes
      "Eliza OS": "framework",
      LangGraph: "framework",
      Copilot: "framework",

      // Character nodes
      "AI Assistant": "character",
      "Creative Companion": "character",
      "Technical Mentor": "character",
      "Empathetic Friend": "character",
      "Gaming Buddy": "character",
      "Casey Black": "character",

      // Model nodes
      Claude: "model",
      DeepSeek: "model",
      Gemini: "model",
      OpenAI: "model",

      // Voice nodes
      "Eleven Labs": "voice",

      // Plugin nodes
      Twitter: "plugin",
    };

    return nodeTypeMap[nodeName] || "framework";
  };

  // Helper function to get provider from node name
  const getProviderFromNodeName = (nodeName: string): string => {
    const providerMap: Record<string, string> = {
      Claude: "anthropic",
      OpenAI: "openai",
      DeepSeek: "deepseek",
      Gemini: "google",
    };
    return providerMap[nodeName] || "";
  };

  // Helper function to get character ID from node name
  const getCharacterIdFromNodeName = (nodeName: string): string => {
    const characterMap: Record<string, string> = {
      "AI Assistant": "aiAssistant",
      "Creative Companion": "creativeCompanion",
      "Technical Mentor": "technicalMentor",
      "Empathetic Friend": "empatheticFriend",
      "Gaming Buddy": "gamingBuddy",
      "Casey Black": "caseyBlack",
    };
    return characterMap[nodeName] || "";
  };

  const updateNodeConfiguration = useCallback(
    (
      node: Node,
      nodeName: string,
      nodeType: string,
      character?: CharacterConfig
    ) => {
      if (!agentBuilderRef.current) return;

      const actualNodeType = getNodeType(nodeName);
      let updatedData: Record<string, unknown> = { ...node.data };

      // Apply configuration based on node type
      switch (actualNodeType) {
        case "model":
          const provider = getProviderFromNodeName(nodeName);
          if (provider) {
            updatedData = {
              ...updatedData,
              provider,
              configured: true,
            };
          }
          break;

        case "character":
          const characterId = getCharacterIdFromNodeName(nodeName);
          if (characterId && character) {
            updatedData = {
              ...updatedData,
              characterId,
              name: character.name,
              system: character.system,
              bio: character.bio,
              messageExamples: character.messageExamples,
              postExamples: character.postExamples,
              adjectives: character.adjectives,
              topics: character.topics,
              style: character.style,
              configured: true,
            };
          }
          break;

        default:
          updatedData = {
            ...updatedData,
            configured: true,
          };
          break;
      }

      // Update the node
      agentBuilderRef.current.onUpdateNode(node.id, updatedData);

      // Select the node using the AgentBuilder's method
      agentBuilderRef.current.selectNodeByName(nodeName);
    },
    []
  );

  const handleSelectNode = useCallback(
    (nodeName: string, nodeType: string, character?: CharacterConfig) => {
      if (!agentBuilderRef.current) return;

      // Get current nodes
      const nodes = agentBuilderRef.current.getCurrentNodes();

      // Find if a node with this name already exists
      let existingNode = nodes.find((node) => node.data?.label === nodeName);

      if (!existingNode) {
        // Add the node if it doesn't exist
        handleAddNode(nodeName);
        // Wait a bit for the node to be added, then find it
        setTimeout(() => {
          const updatedNodes = agentBuilderRef.current?.getCurrentNodes();
          existingNode = updatedNodes?.find(
            (node) => node.data?.label === nodeName
          );
          if (existingNode) {
            updateNodeConfiguration(
              existingNode,
              nodeName,
              nodeType,
              character
            );
          }
        }, 100);
      } else {
        // Update the existing node's configuration and select it
        updateNodeConfiguration(existingNode, nodeName, nodeType, character);
      }
    },
    [handleAddNode, updateNodeConfiguration]
  );

  const handleClosePanel = useCallback(() => {
    if (agentBuilderRef.current) {
      agentBuilderRef.current.clearSelectedNode();
      dispatch(setShowNodesPanel(false));
    }
  }, [dispatch]);

  const handleAgentSettings = useCallback(() => {
    // TODO: Implement agent settings modal or navigation
    console.log("Agent settings clicked");
  }, []);

  // Don't render anything if not connected (will redirect)
  // if (!isConnected) {
  //   return null;
  // }

  // Render different content based on activeMenu
  const renderContent = () => {
    switch (activeMenu) {
      case "Agents":
        return <AgentChat onSettingsClick={handleAgentSettings} />;
      case "Arena":
      default:
        return (
          <div className="flex h-full">
            <AgentBuilder ref={agentBuilderRef} />
            {/* Unified Panel on the right side */}
            {(showNodesPanel || selectedNode) && (
              <div className="min-w-80 h-full">
                <UnifiedPanel
                  selectedNode={selectedNode}
                  onUpdateNode={handleUpdateNode}
                  onClose={handleClosePanel}
                  onAddNode={handleAddNode}
                  currentReactFlowNodes={currentNodes}
                  onSelectNode={handleSelectNode}
                />
              </div>
            )}
          </div>
        );
    }
  };

  // Don't render anything if not connected (will redirect)
  // if (!isConnected) {
  //   return null;
  // }

  return (
    <div className="flex h-full flex-1 relative">
      <div className="flex  bg-bg flex-col flex-1">
        <Header />
        {/* Conditional content based on activeMenu */}
        {renderContent()}
      </div>

      <Modal isOpen={!allowed} onClose={() => {}}>
        <NoAccessComponent onTryAnotherAccount={() => setAllowed(true)} />
      </Modal>
    </div>
  );
}
