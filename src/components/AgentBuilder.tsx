import {
  useCallback,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import {
  nextStep,
  previousStep,
  selectAgentBuilderFlow,
  setShowNodesPanel,
  setNodesPanelCategory,
  openModal,
  closeModal,
  selectActiveModal,
  triggerAgentsRefresh,
  goToStep,
  selectIsEditingAgent,
  clearEditingMode,
  setActiveMenu,
} from "@/redux/slices/uiSlice";

import {
  ReactFlow,
  // MiniMap,
  // Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  useReactFlow,
  Viewport,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { FrameworkNode } from "./nodes/FrameworkNode";
import { ModelNode } from "./nodes/ModelNode";
import { VoiceNode } from "./nodes/VoiceNode";
import { PluginNode } from "./nodes/PluginNode";
import { LogicNode } from "./nodes/LogicNode";
import { OutputNode } from "./nodes/OutputNode";
import { CharacterNode } from "./nodes/CharacterNode";
import { characterConfigs } from "@/constants/characters";
import { CharacterConfig } from "@/types/nodes";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectNodesForAPI } from "@/redux/slices/selectedNodesSlice";
import { deployAgentAction } from "@/actions/deploy";
import { whitelist } from "@/constants/whitelist";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useAgentBuilderSync } from "@/hooks/useNodesSync";
import Modal from "@/components/Modal";
import NoAccessComponent from "@/components/NoAccessComponent";
import { useAppKitAccount } from "@reown/appkit/react";

const nodeTypes = {
  framework: FrameworkNode,
  character: CharacterNode,
  model: ModelNode,
  voice: VoiceNode,
  plugin: PluginNode,
  logic: LogicNode,
  output: OutputNode,
};

// Helper function to get node type from node name
const getNodeType = (nodeName: string): string => {
  const nodeTypeMap: Record<string, string> = {
    // Framework nodes
    "Eliza OS": "framework",
    LangGraph: "framework",
    LangChain: "framework",
    AutoGen: "framework",
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
    Alloy: "voice",
    Echo: "voice",
    "Eleven Labs": "voice",
    Vits: "voice",
    Piper: "voice",
    "OpenAI Whisper": "voice",
    "Azure Speech": "voice",
    "Google Cloud Speech": "voice",
    Fable: "voice",
    Onyx: "voice",
    Nova: "voice",
    Shimmer: "voice",

    // Plugin nodes
    Twitter: "plugin",
    "Database Connector": "plugin",
    "API Gateway": "plugin",
    "Analytics Dashboard": "plugin",

    // Logic nodes
    "If/Then": "logic",
    "Switch/Case": "logic",
    Loop: "logic",
    Filter: "logic",
    Transform: "logic",

    // Output nodes
    "Chat Output": "output",
    "API Output": "output",
    "File Output": "output",
  };

  return nodeTypeMap[nodeName] || "framework";
};

// Helper function to get character config by name
const getCharacterConfig = (nodeName: string): CharacterConfig | null => {
  const characterMap: Record<string, CharacterConfig> = {
    "AI Assistant": characterConfigs.aiAssistant,
    "Creative Companion": characterConfigs.creativeCompanion,
    "Technical Mentor": characterConfigs.technicalMentor,
    "Empathetic Friend": characterConfigs.empatheticFriend,
    "Gaming Buddy": characterConfigs.gamingBuddy,
    "Casey Black": characterConfigs.caseyBlack,
  };

  return characterMap[nodeName] || null;
};

const defaultNodeForStep: { [key: string]: string } = {
  Framework: "Eliza OS",
  "AI Model": "Claude",
  Voice: "Piper",

  Character: "AI Assistant",
  Plugins: "Twitter",
};

// Helper function to get default node data
const getDefaultNodeData = (nodeType: string, nodeName: string) => {
  const baseData = {
    label: nodeName,
    configured: nodeType == "framework" || nodeType == "voice" ? true : false,
  };

  switch (nodeType) {
    case "character":
      const characterConfig = getCharacterConfig(nodeName);

      return {
        ...baseData,
        name: characterConfig ? characterConfig.name : nodeName,
        system: characterConfig ? characterConfig.system : "",
        bio: characterConfig ? characterConfig.bio : [],
        messageExamples: characterConfig ? characterConfig.messageExamples : [],
        postExamples: characterConfig ? characterConfig.postExamples : [],
        adjectives: characterConfig ? characterConfig.adjectives : [],
        topics: characterConfig ? characterConfig.topics : [],
        style: characterConfig
          ? characterConfig.style
          : { all: [], chat: [], post: [] },
        // Mark character nodes as configured by default when they have a character config
        label: characterConfig ? characterConfig.name : nodeName,
        configured: !!characterConfig,
      };
    case "framework":
      // Determine the framework type based on the node name
      let frameworkType: "elizaos" | "copilot" | "langgraph" = "elizaos";
      if (nodeName === "LangGraph" || nodeName === "LangChain") {
        frameworkType = "langgraph";
      } else if (nodeName === "Copilot") {
        frameworkType = "copilot";
      }

      return {
        ...baseData,
        framework: frameworkType,
        characterName: "",
        personality: "",
      };
    case "model":
      // Determine the provider and model based on the node name
      let provider:
        | "openai"
        | "anthropic"
        | "google"
        | "meta"
        | "deepseek"
        | "local" = "openai";
      let model = "";

      if (nodeName.includes("Claude")) {
        provider = "anthropic";
        // Set a specific Claude model instead of just the name
        model = "claude-3-sonnet-20240229";
      } else if (nodeName.includes("Gemini")) {
        provider = "google";
        model = "gemini-pro";
      } else if (nodeName.includes("DeepSeek")) {
        provider = "deepseek"; // DeepSeek often uses OpenAI-compatible API
        model = "deepseek-chat";
      } else if (nodeName.includes("OpenAI")) {
        provider = "openai";
        model = "gpt-4-turbo-preview";
      } else if (nodeName.includes("Llama")) {
        provider = "meta";
        model = "llama-2-70b";
      } else if (nodeName.includes("Mistral")) {
        provider = "local";
        model = "mistral-7b";
      } else if (nodeName.includes("GPT")) {
        provider = "openai";
        model = "gpt-4-turbo-preview";
      }

      return {
        ...baseData,
        model: model,
        provider: provider,
        apiKey: "",
        configured: provider && model ? true : false,
      };
    case "voice":
      // Determine the voice model based on the node name
      let voiceModel = "en_US-hfc_male-medium"; // Default to Piper male voice
      if (nodeName.includes("ElevenLabs") || nodeName.includes("Eleven Labs")) {
        voiceModel = "elevenlabs";
      } else if (nodeName.includes("female") || nodeName.includes("Female")) {
        voiceModel = "en_US-hfc_female-medium";
      }

      return {
        ...baseData,
        voice: voiceModel,
        language: "en",
        speed: 1.0,
      };
    case "plugin":
      return {
        ...baseData,
        service: nodeName,
        endpoint: "",
        // Twitter plugin defaults
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
      };
    case "logic":
      return {
        ...baseData,
        condition: "if",
        expression: "",
      };
    case "output":
      return {
        ...baseData,
        type: "chat",
        template: "",
      };
    default:
      return baseData;
  }
};

const initialNodes: Node[] = [];

const initialEdges: Edge[] = [];

const flowStyles = {
  background: "linear-gradient(135deg, #191919 0%, #191919 100%)",
  // height: "50%",
};

export interface AgentBuilderRef {
  onAddNode: (nodeName: string, position?: { x: number; y: number }) => void;
  fitViewToNodes: () => void;
  resetToOptimalZoom: () => void;
  getCurrentNodes: () => Node[]; // Add method to get current nodes
  getSelectedNode: () => Node | null;
  onUpdateNode: (nodeId: string, data: Record<string, unknown>) => void;
  onDeleteNode: (nodeId: string) => void;
  clearSelectedNode: () => void;
  selectNodeByName: (nodeName: string) => void; // Add method to select node by name
  getAPIData: () => {
    allNodes: Array<{
      type?: string;
      data: Record<string, unknown>;
    }>;
    selectedNodes: Array<{
      type?: string;
      data: Record<string, unknown>;
    }>;
    selectedNode: {
      type?: string;
      data: Record<string, unknown>;
    } | null;
    totalNodes: number;
    selectedCount: number;
    lastUpdated: string | null;
    workflow: {
      nodes: Array<{
        type?: string;
        data: Record<string, unknown>;
      }>;
      selectedNode: {
        type?: string;
        data: Record<string, unknown>;
      } | null;
      metadata: {
        totalNodes: number;
        lastUpdated: string | null;
      };
    };
  };
}

// Internal component that uses the ReactFlow hook
const AgentBuilderFlow = forwardRef<AgentBuilderRef>((props, ref) => {
  const dispatch = useAppDispatch();
  const agentBuilderFlow = useAppSelector(selectAgentBuilderFlow);
  const { width, height } = useWindowSize();
  const { address } = useAppKitAccount();
  const isMobile = width < 768; // Tailwind's md breakpoint

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentMessage, setDeploymentMessage] = useState<string | null>(
    null
  );
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const apiNodesData = useAppSelector(selectNodesForAPI);
  const activeModal = useAppSelector(selectActiveModal);
  const isEditingAgent = useAppSelector(selectIsEditingAgent);

  // Add debug logging
  useEffect(() => {
    console.log("AgentBuilder - isEditingAgent:", isEditingAgent);
    console.log(
      "AgentBuilder - localStorage agent nodes:",
      localStorage.getItem("editingAgentNodes") ? "exists" : "not found"
    );
    console.log(
      "AgentBuilder - current step:",
      agentBuilderFlow.currentStep,
      "total steps:",
      agentBuilderFlow.totalSteps
    );
    console.log(
      "AgentBuilder - isLastStep:",
      agentBuilderFlow.currentStep === agentBuilderFlow.totalSteps
    );
  }, [
    isEditingAgent,
    agentBuilderFlow.currentStep,
    agentBuilderFlow.totalSteps,
  ]);

  // Add the useReactFlow hook
  const reactFlow = useReactFlow();

  // Helper function to get character name
  const getCharacterName = useCallback(() => {
    const characterNode = apiNodesData.allNodes.find(
      (node) => node.type === "character"
    );
    const name = characterNode?.data?.name;
    return typeof name === "string" ? name : "AI Assistant";
  }, [apiNodesData.allNodes]);

  // Initialize Redux sync
  const {
    handleSelectionChange: syncSelectionChange,
    handleNodeUpdate: syncNodeUpdate,
    syncAllNodes,
    prepareForAPISubmission,
  } = useAgentBuilderSync();

  // Load agent nodes when editing mode is enabled
  useEffect(() => {
    if (isEditingAgent) {
      try {
        const storedNodes = localStorage.getItem("editingAgentNodes");
        if (storedNodes) {
          const apiNodes = JSON.parse(storedNodes);
          console.log("Loading agent nodes for editing:", apiNodes);

          // Convert API nodes to ReactFlow nodes
          const reactFlowNodes = apiNodes.map(
            (
              apiNode: { type: string; data: Record<string, unknown> },
              index: number
            ) => {
              const getNodePosition = (nodeType: string, index: number) => {
                const typePositions: {
                  [key: string]: { x: number; y: number };
                } = {
                  framework: { x: 0, y: 0 },
                  model: { x: 450, y: 150 },
                  voice: { x: 100, y: 550 },
                  character: { x: 850, y: 150 },
                  plugin: { x: 470, y: 659 },
                };
                return (
                  typePositions[nodeType] || { x: index * 200, y: index * 100 }
                );
              };

              return {
                id: `${apiNode.type}-${Date.now()}-${index}`,
                type: apiNode.type || "default",
                position: getNodePosition(apiNode.type || "default", index),
                data: {
                  ...apiNode.data,
                  label:
                    apiNode.data.label ||
                    apiNode.data.name ||
                    `${apiNode.type} Node`,
                  configured: true,
                },
                selected: false,
              };
            }
          );

          setNodes(reactFlowNodes);

          // Create edges to connect nodes (framework node connects to all others)
          const frameworkNode = reactFlowNodes.find(
            (node: Node) => node.type === "framework"
          );
          if (frameworkNode) {
            const newEdges: Edge[] = [];
            reactFlowNodes.forEach((node: Node) => {
              if (node.type !== "framework") {
                newEdges.push({
                  id: `e-${frameworkNode.id}-${node.id}`,
                  source: frameworkNode.id,
                  target: node.id,
                  type: "smoothstep",
                  animated: true,
                });
              }
            });
            setEdges(newEdges);
          }

          // Set to last step when loading a saved agent - do this after nodes are set
          setTimeout(() => {
            console.log("Setting to last step for editing mode");
            dispatch(goToStep(agentBuilderFlow.totalSteps));
          }, 50);

          // Fit view to show all loaded nodes
          setTimeout(() => {
            reactFlow.fitView({ padding: 0.1 });
          }, 100);

          // Clear the localStorage data after loading
          localStorage.removeItem("editingAgentNodes");
          console.log("Cleared localStorage after loading nodes");
        }
      } catch (error) {
        console.error("Error loading agent nodes:", error);
      }
    }
  }, [
    isEditingAgent,
    setNodes,
    setEdges,
    reactFlow,
    dispatch,
    agentBuilderFlow.totalSteps,
  ]);

  const getPositionsByStep = useCallback(() => {
    if (isMobile) {
      return [
        { x: 20, y: 10 }, // Framework - centered and higher
        { x: 300, y: 10 }, // AI Model - stacked vertically
        { x: 20, y: 200 }, // Voice - stacked vertically
        { x: 150, y: 380 }, // Character - stacked vertically
        { x: 20, y: 700 }, // Plugins - stacked vertically
      ];
    } else {
      return [
        { x: 0, y: 0 }, // Framework
        { x: 450, y: 150 }, // AI Model
        { x: 100, y: 550 }, // Voice
        { x: 850, y: 150 }, // Character
        { x: 470, y: 659 }, // Plugins
      ];
    }
  }, [isMobile]);

  // Function to manually fit the view to show all nodes
  const fitViewToNodes = useCallback(() => {
    if (reactFlow && nodes.length > 0) {
      reactFlow.fitView({
        padding: 0.1, // 10% padding around the content
        minZoom: 0.1,
        maxZoom: 0.7, // Limit maximum zoom for fit view (slightly higher)
        duration: 800, // Smooth animation duration
      });
    }
  }, [reactFlow, nodes.length]);

  // Function to reset to optimal zoom
  const resetToOptimalZoom = useCallback(() => {
    if (reactFlow) {
      const viewportWidth = width * 0.8;
      const viewportHeight = height * 0.8;
      const contentWidth = isMobile ? 300 : 1200;
      const contentHeight = isMobile ? 800 : 700;

      const optimalZoomX = viewportWidth / contentWidth;
      const optimalZoomY = viewportHeight / contentHeight;
      const optimalZoom = Math.min(optimalZoomX, optimalZoomY, 0.6); // Cap at 0.6x zoom (slightly higher)

      const viewport: Viewport = {
        x: isMobile ? 10 : 50,
        y: isMobile ? 10 : 50,
        zoom: Math.max(0.1, optimalZoom),
      };

      reactFlow.setViewport(viewport, { duration: 800 });
    }
  }, [reactFlow, width, height, isMobile]);

  // Function to initialize and control the view
  const initializeView = useCallback(() => {
    if (reactFlow && nodes.length > 0) {
      // Calculate optimal zoom based on viewport and content
      const viewportWidth = width * 0.8; // Use 80% of available width
      const viewportHeight = height * 0.8; // Use 80% of available height

      // Estimate content bounds (you can adjust these based on your actual node layout)
      const contentWidth = isMobile ? 300 : 1200;
      const contentHeight = isMobile ? 800 : 700;

      const optimalZoomX = viewportWidth / contentWidth;
      const optimalZoomY = viewportHeight / contentHeight;
      const optimalZoom = Math.min(optimalZoomX, optimalZoomY, 0.6); // Cap at 0.6x zoom (slightly higher)

      // Set the viewport with calculated zoom
      const viewport: Viewport = {
        x: isMobile ? 10 : 50,
        y: isMobile ? 10 : 50,
        zoom: Math.max(0.1, optimalZoom), // Minimum zoom of 0.1
      };

      reactFlow.setViewport(viewport);
    }
  }, [reactFlow, nodes.length, width, height, isMobile]);

  // Function to validate all nodes are configured
  const validateNodesConfiguration = useCallback(() => {
    const errors: string[] = [];
    const unconfiguredNodeIds: string[] = [];

    nodes.forEach((node) => {
      if (!node.data.configured) {
        const nodeLabel = node.data.label || node.type || "Unknown";
        errors.push(`${nodeLabel} is not configured`);
        unconfiguredNodeIds.push(node.id);
      }
    });

    // Highlight unconfigured nodes in red
    if (unconfiguredNodeIds.length > 0) {
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          style: {
            ...node.style,
            border: unconfiguredNodeIds.includes(node.id)
              ? "3px solid #ef4444"
              : undefined,
            boxShadow: unconfiguredNodeIds.includes(node.id)
              ? "0 0 10px rgba(239, 68, 68, 0.5)"
              : undefined,
          },
        }))
      );

      // Clear the red highlighting after 5 seconds
      setTimeout(() => {
        setNodes((nds) =>
          nds.map((node) => ({
            ...node,
            style: {
              ...node.style,
              border: undefined,
              boxShadow: undefined,
            },
          }))
        );
      }, 5000);
    }

    return { isValid: errors.length === 0, errors };
  }, [nodes, setNodes]);

  // Handle deployment to MongoDB
  const handleDeploy = async () => {
    // Validate all nodes are configured before deployment
    const validation = validateNodesConfiguration();
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      setShowValidationModal(true);
      return;
    }

    // Check if user's wallet address is in the whitelist
    if (!address || !whitelist.includes(address)) {
      dispatch(openModal("noAccess"));
      return;
    }

    // Get character name
    const characterName = getCharacterName();

    // Get agent ID if editing an existing agent
    let agentId: string | undefined;
    if (isEditingAgent) {
      try {
        const editingAgentInfo = sessionStorage.getItem("editingAgentInfo");
        if (editingAgentInfo) {
          const agentInfo = JSON.parse(editingAgentInfo);
          agentId = agentInfo.id;
          console.log("Editing existing agent with ID:", agentId);
        }
      } catch (error) {
        console.error("Error getting editing agent info:", error);
      }
    }

    // Open loading modal
    dispatch(openModal("agentDeploying"));
    setIsDeploying(true);
    setDeploymentMessage(null);

    try {
      console.log("Deploying agent with nodes:", apiNodesData.allNodes);
      console.log("Local nodes count:", nodes.length);
      console.log(
        "Local nodes:",
        nodes.map((n) => ({ type: n.type, label: n.data.label }))
      );
      console.log("Redux API nodes data:", apiNodesData);
      console.log("Agent ID for deployment:", agentId);

      // Debug: Log each node's data
      apiNodesData.allNodes.forEach((node, index) => {
        console.log(`Node ${index} (${node.type}):`, node.data);
      });

      const result = await deployAgentAction(
        address as string,
        apiNodesData.allNodes,
        characterName, // Use character name instead of timestamp
        "AI Agent created with node builder",
        agentId // Pass the agent ID if editing
      );

      // Close loading modal first
      dispatch(closeModal());

      if (result.success) {
        // Clear editing mode after successful deployment
        dispatch(clearEditingMode());
        // Clear sessionStorage for editing agent info
        sessionStorage.removeItem("editingAgentInfo");
        // Open success modal
        dispatch(openModal("agentCreated"));
        // Trigger refresh of agents list in sidebar
        dispatch(triggerAgentsRefresh());
        setDeploymentMessage(
          `✅ Agent ${
            isEditingAgent ? "re-deployed" : "deployed"
          } successfully! ID: ${result.agentId}`
        );
        console.log("Deployment successful:", result);
      } else {
        setDeploymentMessage(`❌ Deployment failed: ${result.error}`);
        console.error("Deployment failed:", result.error);
      }
    } catch (error) {
      // Close loading modal on error
      dispatch(closeModal());
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setDeploymentMessage(`❌ Deployment error: ${errorMessage}`);
      console.error("Deployment error:", error);
    } finally {
      setIsDeploying(false);
    }
  };

  const handleNextStep = () => {
    // Check if this is the last step and we should deploy
    const isAtLastStep =
      agentBuilderFlow.currentStep === agentBuilderFlow.totalSteps;

    if (isAtLastStep) {
      // Deploy the agent instead of going to next step
      handleDeploy();
      return;
    }

    // Calculate the next step before dispatching
    const newCurrentStep = agentBuilderFlow.currentStep + 1;

    console.log(
      "Next step - Current step:",
      agentBuilderFlow.currentStep,
      "New step:",
      newCurrentStep
    );

    dispatch(nextStep());
    // Node selection will be handled by useEffect
  };

  const handlePreviousStep = () => {
    // Navigate to the previous step - node management will be handled by useEffect
    dispatch(previousStep());
  };

  const isFirstStep = agentBuilderFlow.currentStep === 1;
  const isLastStep =
    agentBuilderFlow.currentStep === agentBuilderFlow.totalSteps;

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      console.log("Node clicked:", node.data?.label, node.type); // Debug log

      // Update nodes to reflect selection state
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          selected: n.id === node.id,
        }))
      );

      setSelectedNode(node);

      // Map node types to their corresponding navigation categories
      const nodeTypeToNavCategory: { [key: string]: string } = {
        framework: "Framework",
        model: "AI Model",
        voice: "Voice",
        character: "Character",
        plugin: "Plugins",
        logic: "Plugins",
        output: "Plugins",
      };

      // Always update the nodes panel category to show the clicked node's category
      if (node.type && typeof node.type === "string") {
        const navCategory = nodeTypeToNavCategory[node.type];
        if (navCategory) {
          console.log("Setting nodes panel category:", navCategory); // Debug log
          dispatch(setNodesPanelCategory(navCategory));
          dispatch(setShowNodesPanel(true));
        }
      }

      // The activeNav (sidebar highlighting) remains unchanged
      // This preserves step-based highlighting while allowing independent node panel navigation
    },
    [dispatch, setNodes]
  );

  const onAddNode = useCallback(
    (nodeName: string, position?: { x: number; y: number }) => {
      const nodeType = getNodeType(nodeName);

      // Get the appropriate position based on node type
      const getNodePosition = () => {
        if (position) return position;

        const positions = getPositionsByStep();
        const nodeTypeToStepIndex: { [key: string]: number } = {
          framework: 0, // Framework
          model: 1, // AI Model
          voice: 2, // Voice
          character: 3, // Character
          plugin: 4, // Plugins
          logic: 4, // Use plugins position for logic nodes
          output: 4, // Use plugins position for output nodes
        };

        const stepIndex = nodeTypeToStepIndex[nodeType];

        if (stepIndex !== undefined && positions[stepIndex]) {
          return positions[stepIndex];
        }

        // Fallback to random position
        return {
          x: Math.random() * 400 + 100,
          y: Math.random() * 400 + 100,
        };
      };

      setNodes((nds) => {
        // Check if a node of this type already exists
        const existingNode = nds.find((node) => node.type === nodeType);

        const newNode: Node = {
          id: `${nodeType}-${Date.now()}`,
          type: nodeType,
          position: getNodePosition(),
          data: getDefaultNodeData(nodeType, nodeName),
        };

        if (existingNode) {
          // Replace the existing node
          const updatedNodes = nds.map((node) =>
            node.id === existingNode.id ? newNode : node
          );

          // Update edges to connect to the new node
          setEdges((eds) =>
            eds.map((edge) => {
              if (edge.source === existingNode.id) {
                return { ...edge, source: newNode.id };
              }
              if (edge.target === existingNode.id) {
                return { ...edge, target: newNode.id };
              }
              return edge;
            })
          );

          // If the replaced node was selected, update selection
          setSelectedNode((currentSelected) =>
            currentSelected?.id === existingNode.id ? newNode : currentSelected
          );

          return updatedNodes;
        } else {
          // Add new node
          const updatedNodes = [...nds, newNode];

          // Connect to framework node if it's not the framework itself
          if (nodeType !== "framework") {
            const frameworkNode = nds.find((n) => n.type === "framework");
            if (frameworkNode) {
              const newEdge: Edge = {
                id: `e-${frameworkNode.id}-${newNode.id}`,
                source: frameworkNode.id,
                target: newNode.id,
                type: "smoothstep",
                animated: true,
              };
              setEdges((eds) => addEdge(newEdge, eds));
            }
          }

          return updatedNodes;
        }
      });
    },
    [setNodes, setEdges, getPositionsByStep]
  );

  // Expose functions to parent component
  useImperativeHandle(ref, () => ({
    onAddNode,
    fitViewToNodes,
    resetToOptimalZoom,
    getCurrentNodes: () => nodes, // Expose current nodes
    getSelectedNode: () => selectedNode,
    onUpdateNode,
    onDeleteNode,
    clearSelectedNode: () => setSelectedNode(null),
    selectNodeByName, // Add the new method
    getAPIData: prepareForAPISubmission, // Expose API data preparation
  }));

  const onDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );
      if (selectedNode?.id === nodeId) {
        setSelectedNode(null);
      }
    },
    [setNodes, setEdges, selectedNode]
  );

  const onUpdateNode = useCallback(
    (nodeId: string, data: Record<string, unknown>) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...data } }
            : node
        )
      );

      // Sync the node update to Redux
      syncNodeUpdate(nodeId, data);
    },
    [setNodes, syncNodeUpdate]
  );

  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes }: { nodes: Node[] }) => {
      // If a node is selected in ReactFlow, update our selectedNode state
      if (selectedNodes.length > 0) {
        setSelectedNode(selectedNodes[0]);
      } else {
        setSelectedNode(null);
        // Clear selection from all nodes
        setNodes((nds) =>
          nds.map((n) => ({
            ...n,
            selected: false,
          }))
        );
      }
    },
    [setNodes]
  );

  const selectNodeByName = useCallback(
    (nodeName: string) => {
      const targetNode = nodes.find((node) => node.data?.label === nodeName);
      if (targetNode) {
        // Update nodes to reflect selection state
        setNodes((nds) =>
          nds.map((n) => ({
            ...n,
            selected: n.id === targetNode.id,
          }))
        );
        setSelectedNode(targetNode);

        // Sync selection to Redux immediately
        syncSelectionChange({ nodes: [targetNode] });
      }
    },
    [nodes, setNodes, syncSelectionChange]
  );

  // Sync local nodes to Redux whenever they change
  useEffect(() => {
    console.log(
      "Syncing nodes to Redux - local nodes count:",
      nodes.length,
      "nodes:",
      nodes.map((n) => ({ type: n.type, label: n.data.label }))
    );
    syncAllNodes(nodes);
  }, [nodes, syncAllNodes]);

  // Initialize view when nodes change or viewport size changes
  useEffect(() => {
    if (nodes.length > 0) {
      // Use setTimeout to ensure DOM is updated
      setTimeout(initializeView, 100);
    }
  }, [nodes.length, initializeView]);

  // Also initialize view when viewport size changes
  useEffect(() => {
    if (nodes.length > 0) {
      setTimeout(initializeView, 100);
    }
  }, [width, height, nodes.length, initializeView]);

  useEffect(() => {
    // Skip step-based node management only during initial agent loading (when we have stored agent nodes)
    const isInitialAgentLoading =
      isEditingAgent && localStorage.getItem("editingAgentNodes");
    if (isInitialAgentLoading) return;

    const currentStepName =
      agentBuilderFlow.steps[agentBuilderFlow.currentStep - 1];
    if (!currentStepName) return;

    const nodeNameToAdd = defaultNodeForStep[currentStepName];
    if (!nodeNameToAdd) return;

    // When jumping to a step via sidebar, ensure all previous nodes are also present
    setNodes((nds) => {
      let updatedNodes = [...nds];

      // Add all nodes from step 1 up to the current step
      for (
        let stepIndex = 0;
        stepIndex < agentBuilderFlow.currentStep;
        stepIndex++
      ) {
        const stepName = agentBuilderFlow.steps[stepIndex];
        const nodeNameForStep = defaultNodeForStep[stepName];

        if (nodeNameForStep) {
          const nodeTypeForStep = getNodeType(nodeNameForStep);
          const existingNode = updatedNodes.find(
            (node) => node.type === nodeTypeForStep
          );

          // Add default node if none of this type exists
          if (!existingNode) {
            const positions = getPositionsByStep();
            const position = positions[stepIndex];

            const newNode: Node = {
              id: `${nodeTypeForStep}-${Date.now()}-${stepIndex}`,
              type: nodeTypeForStep,
              position,
              data: getDefaultNodeData(nodeTypeForStep, nodeNameForStep),
            };

            updatedNodes = [...updatedNodes, newNode];

            // Connect to framework node if it's not the framework itself
            if (nodeTypeForStep !== "framework") {
              const frameworkNode = updatedNodes.find(
                (n) => n.type === "framework"
              );
              if (frameworkNode) {
                const newEdge: Edge = {
                  id: `e-${frameworkNode.id}-${newNode.id}`,
                  source: frameworkNode.id,
                  target: newNode.id,
                  type: "smoothstep",
                  animated: true,
                };
                setEdges((eds) => addEdge(newEdge, eds));
              }
            }
          }
        }
      }

      return updatedNodes;
    });

    // Auto-select the node for the current step after nodes are updated
    setTimeout(() => {
      const nodeNameToSelect = defaultNodeForStep[currentStepName];
      if (nodeNameToSelect) {
        setNodes((nds) => {
          const nodeToSelect = nds.find(
            (n) => n.data.label === nodeNameToSelect
          );

          if (nodeToSelect) {
            console.log(
              "Auto-selecting node:",
              nodeToSelect.data.label,
              "for step:",
              currentStepName
            );

            // Update selection state
            const updatedNodes = nds.map((n) => ({
              ...n,
              selected: n.id === nodeToSelect.id,
            }));

            setSelectedNode(nodeToSelect);
            return updatedNodes;
          }

          return nds;
        });
      }
    }, 50); // Small delay to ensure nodes are fully updated
  }, [
    agentBuilderFlow.currentStep,
    agentBuilderFlow.steps,
    getPositionsByStep,
    setNodes,
    setEdges,
    setSelectedNode,
    isEditingAgent,
  ]);

  // Handle step changes from sidebar navigation - remove nodes above the selected step
  useEffect(() => {
    // Skip step-based node management only during initial agent loading (when we have stored agent nodes)
    const isInitialAgentLoading =
      isEditingAgent && localStorage.getItem("editingAgentNodes");
    if (isInitialAgentLoading) return;

    const currentStep = agentBuilderFlow.currentStep;
    const totalSteps = agentBuilderFlow.totalSteps;

    // Only remove nodes if we're going backwards (when someone clicks on an earlier step)
    // Get all steps that should be removed (steps after the current step)
    if (currentStep < totalSteps) {
      const allSteps = agentBuilderFlow.steps; // Use the steps array for correct order
      const currentStepIndex = currentStep - 1; // Convert to 0-based index

      // Remove nodes for steps that are after the current step
      setNodes((nds) => {
        let updatedNodes = [...nds];
        const nodesToRemove: string[] = [];

        // Check each step after the current one
        for (let i = currentStepIndex + 1; i < allSteps.length; i++) {
          const stepName = allSteps[i];
          const nodeNameToRemove = defaultNodeForStep[stepName];
          if (nodeNameToRemove) {
            const nodeTypeToRemove = getNodeType(nodeNameToRemove);
            const existingNode = updatedNodes.find(
              (n) => n.type === nodeTypeToRemove
            );
            if (existingNode) {
              nodesToRemove.push(existingNode.id);
              updatedNodes = updatedNodes.filter(
                (node) => node.id !== existingNode.id
              );

              // If the removed node was selected, deselect it
              if (selectedNode?.id === existingNode.id) {
                setSelectedNode(null);
              }
            }
          }
        }

        // Remove connected edges for all removed nodes
        if (nodesToRemove.length > 0) {
          setEdges((eds) =>
            eds.filter(
              (edge) =>
                !nodesToRemove.includes(edge.source) &&
                !nodesToRemove.includes(edge.target)
            )
          );
        }

        return updatedNodes;
      });
    }
  }, [
    agentBuilderFlow.currentStep,
    agentBuilderFlow.totalSteps,
    agentBuilderFlow.steps,
    setNodes,
    setEdges,
    selectedNode,
    isEditingAgent,
  ]);

  return (
    <div className=" w-full flex  flex-col  bg-bg lg:px-5 pt-5 rounded-tl-[20px] relative h-full">
      <div className="flex  mx-3 lg:mx-0  justify-end items-start">
        <div className="flex flex-col items-end gap-3.5">
          <p className="text-white relative z-50 top-12 right-0 lg:right-0 lg:top-0 bg-dark text-xs w-[90px] h-[31px] rounded-[10px] flex justify-center items-center">
            Step {agentBuilderFlow.currentStep} of{" "}
            <span className="text-white/50 ml-1.5">
              {" "}
              {agentBuilderFlow.totalSteps}
            </span>
          </p>
          <div className="flex lg:relative z-50 absolute bottom-10 lg:bottom-0  items-center gap-3">
            <button
              className={`flex cursor-pointer hover:scale-95 duration-300 active:scale-100 w-[100px] h-[45px] border border-[#757575] rounded-[8px] justify-center items-center gap-1 ${
                isFirstStep ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handlePreviousStep}
              disabled={isFirstStep}
            >
              {/* <Image src={"/icons/arr.svg"} alt="arr" width={24} height={24} /> */}
              <p className="text-xs text-[#757575]">Previous</p>
            </button>
            <button
              className={` flex cursor-pointer hover:scale-95 duration-300 active:scale-100 w-[100px] h-[45px] border border-[#1c1c1c] rounded-[8px] justify-center items-center gap-1 ${
                isLastStep ? "bg-primary" : "bg-white/70 "
              } ${isDeploying ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={handleNextStep}
              disabled={isLastStep && isDeploying}
            >
              <p className="text-xs text-[#1c1c1c]">
                {isLastStep
                  ? isDeploying
                    ? isEditingAgent
                      ? "Re-deploying..."
                      : "Deploying..."
                    : isEditingAgent
                    ? "Re-deploy"
                    : "Deploy"
                  : "Next"}
              </p>
              {isLastStep && !isDeploying && (
                <Image
                  src={"/icons/deploy.svg"}
                  alt="deploy"
                  width={24}
                  height={24}
                />
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1  relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onSelectionChange={onSelectionChange}
          onPaneClick={() => {
            console.log("Pane clicked"); // Debug log
            // Clear selection when clicking on empty space
            setNodes((nds) =>
              nds.map((n) => ({
                ...n,
                selected: false,
              }))
            );
            setSelectedNode(null);
          }}
          nodeTypes={nodeTypes}
          style={flowStyles}
          className="bg-gradient-to-br  h-full rounded-tl-[20px] w-full from-gray-900 to-black"
          // Disable zoom interactions to make it static
          zoomOnScroll={!false}
          zoomOnPinch={!false}
          zoomOnDoubleClick={false}
          // Disable panning to make it completely static
          panOnDrag={!false}
          panOnScroll={false}
          // Disable node dragging but keep selection enabled
          nodesDraggable={!false}
          nodesConnectable={false}
          // Set zoom limits
          minZoom={0.1}
          maxZoom={1.0}
          // Prevent viewport changes and scrolling interference
          preventScrolling={true}
          // Keep node selection enabled
          elementsSelectable={true}
          // Set initial viewport with slightly higher zoom for better visibility
          defaultViewport={{ x: 50, y: 50, zoom: 0.25 }}
          // Hide the ReactFlow attribution
          proOptions={{ hideAttribution: true }}
        >
          {/* <Controls
            className="bg-black/80 border rotate-90 text-black border-gray-700 rounded-lg shadow-2xl"
            showInteractive={!false}
          /> */}

          {/* <MiniMap
            position="bottom-right"
            className="bg-black/80 border w-32 h-32 border-gray-700 rounded-lg shadow-2xl"
            nodeColor="#39ff14"
            maskColor="rgba(0, 0, 0, 0.9)"
          /> */}
          <Background
            variant={BackgroundVariant.Lines}
            gap={150}
            size={2}
            color="#f8ff990d"
          />
        </ReactFlow>
        {/* Deployment message display */}
        {deploymentMessage && (
          <div className="absolute top-4 right-4 bg-black/90 border border-gray-700 rounded-lg p-3 max-w-sm z-50">
            <p className="text-sm text-white">{deploymentMessage}</p>
          </div>
        )}

        {/* Agent Deploying Modal */}
        <Modal
          isOpen={activeModal === "agentDeploying"}
          onClose={() => {}} // Prevent closing during deployment
        >
          <div className="bg-dark justify-center  w-[327px] h-[339px] lg:w-[691px] lg:h-[352px] rounded-[20px] shadow-lg flex flex-col items-center ">
            <div className="relative w-12  h-12  mb-8">
              {/* Background circle */}
              <div className="absolute inset-0 rounded-full border-[6px] border-gray-700"></div>
              {/* Animated progress arc */}
              <div className="absolute inset-0 rounded-full border-[6px] border-transparent border-t-[#f8ff99] animate-spin"></div>
            </div>
            <h2 className=" text-white mb-10">
              Your Agent{" "}
              <span className="text-primary font-semibold">
                {" "}
                {getCharacterName()}{" "}
              </span>
              is being Created...
            </h2>
            <div className="flex w-max h-max items-center gap-2  py-5 relative">
              <span className="w-[14px] h-[14px] lg:w-5 lg:h-5  bg-primary rounded-full"></span>
              <span className="text-base lg:text-[20px] text-primary font-light">
                FRAKTIA
              </span>
            </div>
          </div>
        </Modal>

        {/* Agent Created Success Modal */}
        <Modal
          // isOpen={true}
          isOpen={activeModal === "agentCreated"}
          onClose={() => dispatch(closeModal())}
        >
          <div className="bg-dark justify-center  w-[327px] h-[339px] lg:w-[691px] lg:h-[352px] rounded-[20px] shadow-lg flex flex-col items-center ">
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-12 mb-8  h-12 ">
                <Image
                  src={"/icons/check-circle.svg"}
                  fill
                  alt="check"
                  className=""
                />
              </div>
              <h2 className=" text-white mb-6">
                <span className="text-primary font-semibold">
                  {" "}
                  {getCharacterName()}{" "}
                </span>
                Created
              </h2>
            </div>
            <button
              onClick={() => dispatch(setActiveMenu("Agents"))}
              className="w-[263px] mb-8 border-[#232323] border text-black rounded-[8px] flex items-center gap-1 justify-center bg-primary cursor-pointer hover:bg-primary/80 duration-200 h-[48px] lg:w-[320px]"
            >
              <p>Explore Agent</p>
              <Image
                src={"/icons/chat.svg"}
                width={24}
                height={24}
                alt="chat"
              />
            </button>
            <div className="flex w-max h-max items-center gap-2  py-5 relative">
              <span className="w-[14px] h-[14px] lg:w-5 lg:h-5  bg-primary rounded-full"></span>
              <span className="text-base lg:text-[20px] text-primary font-light">
                FRAKTIA
              </span>
            </div>
          </div>
        </Modal>

        {/* No Access Modal */}
        <Modal
          isOpen={activeModal === "noAccess"}
          onClose={() => dispatch(closeModal())}
        >
          <NoAccessComponent
            onTryAnotherAccount={() => {
              dispatch(closeModal());
              // You can add additional logic here if needed, like disconnecting wallet
            }}
          />
        </Modal>

        {/* Validation Error Modal */}
        <Modal
          isOpen={showValidationModal}
          onClose={() => setShowValidationModal(false)}
        >
          <div className="bg-dark justify-center w-[327px] h-auto lg:w-[500px] lg:h-auto rounded-[20px] shadow-lg flex flex-col items-center p-6">
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-12 mb-6 h-12">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-red-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.963-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-white mb-4 text-lg font-semibold text-center">
                Configuration Required
              </h2>
              <p className="text-gray-300 mb-6 text-center text-sm">
                Please configure the following nodes before deployment:
              </p>
              <div className="w-full mb-6">
                {validationErrors.map((error, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 mb-2 text-red-400 text-sm"
                  >
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span>{error}</span>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={() => setShowValidationModal(false)}
              className="w-full border border-primary text-primary rounded-[8px] flex items-center justify-center hover:bg-primary hover:text-black transition-colors duration-200 h-[48px]"
            >
              <p>Configure Nodes</p>
            </button>
            <div className="flex w-max h-max items-center gap-2 py-5 relative">
              <span className="w-[14px] h-[14px] lg:w-5 lg:h-5 bg-primary rounded-full"></span>
              <span className="text-base lg:text-[20px] text-primary font-light">
                FRAKTIA
              </span>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
});

AgentBuilderFlow.displayName = "AgentBuilderFlow";

// Main component that provides ReactFlow context
export const AgentBuilder = forwardRef<AgentBuilderRef>((props, ref) => {
  return (
    <ReactFlowProvider>
      <AgentBuilderFlow ref={ref} {...props} />
    </ReactFlowProvider>
  );
});

AgentBuilder.displayName = "AgentBuilder";

export default AgentBuilder;
