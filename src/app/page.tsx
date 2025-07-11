"use client";
import Header from "@/components/Header";
import FeedbackModal from "@/components/FeedbackModal";
// import Modal from "@/components/Modal";
// import NoAccessComponent from "@/components/NoAccessComponent";
import { useEffect, useState, useCallback, useRef } from "react";
import { Node } from "@xyflow/react";
import { CharacterConfig } from "@/types/nodes";
import { useSearchParams } from "next/navigation";

import AgentBuilder, { AgentBuilderRef } from "@/components/AgentBuilder";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { UnifiedPanel } from "@/components/UnifiedPanel";
import {
  setShowNodesPanel,
  selectActiveMenu,
  clearEditingMode,
  setEditingAgent,
} from "@/redux/slices/uiSlice";
import AgentSection from "@/components/AgentSection";
// import { useAppKitAccount } from "@reown/appkit/react";
// import { useRouter } from "next/navigation";

export default function Manage() {
  const searchParams = useSearchParams();
  // const [allowed, setAllowed] = useState(false);
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
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      // "Eleven Labs": "voice",
      // Vits: "voice",
      Piper: "voice",

      // Plugin nodes
      Twitter: "plugin",
      Discord: "plugin",
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
              label: nodeName,
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

        case "plugin":
          // Set the service type for plugin nodes
          updatedData = {
            ...updatedData,
            service: nodeName, // Set service to the node name (Twitter, Discord, etc.)
            configured: false, // Plugins need further configuration
          };
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
  }, []);

  // const handleAgentSettings = useCallback(() => {
  //   // TODO: Implement agent settings modal or navigation
  //   console.log("Agent settings clicked");
  // }, []);

  // Don't render anything if not connected (will redirect)
  // if (!isConnected) {
  //   return null;
  // }

  // Render different content based on activeMenu
  const renderContent = () => {
    switch (activeMenu) {
      case "Agents":
        return <AgentSection />;
      // return <AgentChat onSettingsClick={handleAgentSettings} />;
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

  // Check for editing parameters in sessionStorage
  useEffect(() => {
    const editingInfo = sessionStorage.getItem("editingAgentInfo");

    if (editingInfo) {
      try {
        const { id, name } = JSON.parse(editingInfo);
        console.log("Setting editing mode from sessionStorage:", { id, name });
        dispatch(setEditingAgent({ id, name }));

        // Clear the sessionStorage after setting state
        sessionStorage.removeItem("editingAgentInfo");
      } catch (error) {
        console.error("Error parsing editing info:", error);
        sessionStorage.removeItem("editingAgentInfo");
      }
    }
  }, []); // Remove searchParams dependency

  // Check for editing parameters in URL (keep as fallback)
  useEffect(() => {
    const editingId = searchParams.get("editing");
    const editingName = searchParams.get("name");

    if (editingId && editingName) {
      console.log("Setting editing mode from URL:", {
        id: editingId,
        name: decodeURIComponent(editingName),
      });
      dispatch(
        setEditingAgent({
          id: editingId,
          name: decodeURIComponent(editingName),
        })
      );

      // Clean up URL after a longer delay to ensure state is set
      setTimeout(() => {
        window.history.replaceState({}, "", "/");
      }, 1000); // Increased delay
    }
  }, [searchParams, dispatch]);

  // Clear editing mode when switching to Arena (new agent creation)
  useEffect(() => {
    if (activeMenu === "Arena") {
      // Don't clear editing mode if we have URL params, sessionStorage, or localStorage agent data
      const editingId = searchParams.get("editing");
      const sessionInfo = sessionStorage.getItem("editingAgentInfo");
      const isFromEdit = localStorage.getItem("editingAgentNodes");

      if (!editingId && !sessionInfo && !isFromEdit) {
        dispatch(clearEditingMode());
      }
    }
  }, [activeMenu, dispatch, searchParams]);

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

      {/* Feedback Modal */}
      <FeedbackModal />

      {/* <Modal isOpen={!allowed} onClose={() => {}}>
        <NoAccessComponent onTryAnotherAccount={() => setAllowed(true)} />
      </Modal> */}
    </div>
  );
}
