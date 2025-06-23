import { useCallback, useState, forwardRef, useImperativeHandle } from "react";

import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { FrameworkNode } from "./nodes/FrameworkNode";
import { ModelNode } from "./nodes/ModelNode";
import { VoiceNode } from "./nodes/VoiceNode";
import { IntegrationNode } from "./nodes/IntegrationNode";
import { LogicNode } from "./nodes/LogicNode";
import { OutputNode } from "./nodes/OutputNode";
import { CharacterNode } from "./nodes/CharacterNode";
import { PropertiesPanel } from "./PropertiesPanel";
import { characterConfigs } from "@/constants/characters";
import { CharacterConfig } from "@/types/nodes";
import Image from "next/image";
import { useAppSelector } from "@/redux/hooks";
import { selectActiveMenu } from "@/redux/slices/uiSlice";

const nodeTypes = {
  framework: FrameworkNode,
  character: CharacterNode,
  model: ModelNode,
  voice: VoiceNode,
  integration: IntegrationNode,
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

    // Character nodes
    "AI Assistant": "character",
    "Creative Companion": "character",
    "Technical Mentor": "character",
    "Empathetic Friend": "character",
    "Gaming Buddy": "character",
    "Casey Black": "character",

    // Model nodes
    "GPT-4 Turbo": "model",
    Claude: "model",
    DeepSeek: "model",
    Gemini: "model",
    OpenAI: "model",
    "Claude 3 Opus": "model",
    "Gemini Pro": "model",
    "GPT-4": "model",
    "GPT-3.5 Turbo": "model",
    "Claude 3 Sonnet": "model",
    "Claude 3 Haiku": "model",
    "Gemini Ultra": "model",
    "Llama 2 70B": "model",
    "Mistral 7B": "model",

    // Voice nodes
    Alloy: "voice",
    Echo: "voice",
    ElevenLabs: "voice",
    "OpenAI Whisper": "voice",
    "Azure Speech": "voice",
    "Google Cloud Speech": "voice",
    Fable: "voice",
    Onyx: "voice",
    Nova: "voice",
    Shimmer: "voice",

    // Integration nodes
    "Twitter Client": "integration",
    "Database Connector": "integration",
    "API Gateway": "integration",
    "Analytics Dashboard": "integration",

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

// Helper function to get default node data
const getDefaultNodeData = (nodeType: string, nodeName: string) => {
  const baseData = {
    label: nodeName,
    configured: false,
  };

  switch (nodeType) {
    case "character":
      const characterConfig = getCharacterConfig(nodeName);
      return {
        ...baseData,
        characterId: nodeName,
        characterName: characterConfig ? characterConfig.name : nodeName,
        customBio: characterConfig ? characterConfig.bio : [],
        customPersonality: characterConfig ? characterConfig.system : "",
        customAdjectives: characterConfig ? characterConfig.adjectives : [],
        customTopics: characterConfig ? characterConfig.topics : [],
        characterVoice: {
          model: "alloy",
          language: "en",
          speed: 1.0,
          pitch: 1.0,
        },
        behavior: {
          temperature: 0.7,
          maxTokens: 2048,
          responseStyle: "casual" as const,
          conversationLength: "medium" as const,
        },
        memory: {
          enabled: true,
          maxContextLength: 4096,
          rememberUserPreferences: true,
          conversationHistory: true,
        },
        plugins: {
          enabled: characterConfig ? characterConfig.plugins || [] : [],
          disabled: [],
          customConfig: {},
        },
        // Mark character nodes as configured by default
        label: characterConfig ? characterConfig.name : nodeName,
        configured: true,
      };
    case "framework":
      // Determine the framework type based on the node name
      let frameworkType: "elizaos" | "autogen" | "crewai" | "langchain" =
        "elizaos";
      if (nodeName === "LangGraph" || nodeName === "LangChain") {
        frameworkType = "langchain";
      } else if (nodeName === "AutoGen") {
        frameworkType = "autogen";
      } else if (nodeName === "CrewAI") {
        frameworkType = "crewai";
      }

      return {
        ...baseData,
        framework: frameworkType,
        characterName: "",
        personality: "",
      };
    case "model":
      // Determine the provider and model based on the node name
      let provider: "openai" | "anthropic" | "google" | "meta" | "local" =
        "openai";
      let model = "gpt-4-turbo-preview";

      if (nodeName.includes("Claude")) {
        provider = "anthropic";
        model = nodeName.toLowerCase().replace(/\s+/g, "-");
      } else if (nodeName.includes("Gemini")) {
        provider = "google";
        model = nodeName.toLowerCase().replace(/\s+/g, "-");
      } else if (nodeName.includes("Llama")) {
        provider = "meta";
        model = nodeName.toLowerCase().replace(/\s+/g, "-");
      } else if (nodeName.includes("Mistral")) {
        provider = "local";
        model = nodeName.toLowerCase().replace(/\s+/g, "-");
      } else if (nodeName.includes("GPT")) {
        provider = "openai";
        model = nodeName.toLowerCase().replace(/\s+/g, "-");
      }

      return {
        ...baseData,
        model: model,
        provider: provider,
        apiKey: "",
      };
    case "voice":
      // Determine the voice model based on the node name
      let voiceModel = "alloy";
      if (nodeName.includes("ElevenLabs")) {
        voiceModel = "elevenlabs";
      } else if (nodeName.includes("Whisper")) {
        voiceModel = "whisper";
      } else if (nodeName.includes("Azure")) {
        voiceModel = "azure";
      } else if (nodeName.includes("Google")) {
        voiceModel = "google";
      }

      return {
        ...baseData,
        voice: voiceModel,
        language: "en",
        speed: 1.0,
      };
    case "integration":
      return {
        ...baseData,
        service: nodeName,
        endpoint: "",
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

const initialNodes: Node[] = [
  {
    id: "1",
    type: "framework",
    position: { x: 250, y: 100 },
    data: {
      label: "ElizaOS Framework",
      framework: "elizaos",
      configured: false,
    },
  },
];

const initialEdges: Edge[] = [];

const flowStyles = {
  background: "linear-gradient(135deg, #191919 0%, #191919 100%)",
  // height: "50%",
};

export interface AgentBuilderRef {
  onAddNode: (nodeName: string, position?: { x: number; y: number }) => void;
}

const AgentBuilder = forwardRef<AgentBuilderRef>((props, ref) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showTestPanel] = useState(false);
  const activeMenu = useAppSelector(selectActiveMenu);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onAddNode = useCallback(
    (nodeName: string, position?: { x: number; y: number }) => {
      const nodeType = getNodeType(nodeName);
      const newNode: Node = {
        id: `${nodeType}-${Date.now()}`,
        type: nodeType,
        position: position || {
          x: Math.random() * 400 + 100,
          y: Math.random() * 400 + 100,
        },
        data: getDefaultNodeData(nodeType, nodeName),
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes]
  );

  // Expose onAddNode function to parent component
  useImperativeHandle(ref, () => ({
    onAddNode,
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
    },
    [setNodes]
  );

  return (
    <div className=" w-full flex  flex-col  bg-bg lg:px-5 pt-5 rounded-tl-[20px] relative h-full">
      <div className="flex  mx-3 lg:mx-0  justify-between items-start">
        <div className="max-w-[260px] font-light flex flex-col gap-2">
          <div className="flex w-max h-max items-center gap-2">
            <span className="text-base lg:text-2xl text-primary font-light">
              {activeMenu}
            </span>
            <span className="w-2 h-2  animate-pulse   bg-primary rounded-full"></span>
          </div>

          <p className="text-xs text-white/70">
            <span className="font-medium">Select</span> components{" "}
            <span className="font-medium">to</span> configure and build your
            agent
          </p>
        </div>
        <div className="flex flex-col items-end gap-3.5">
          <p className="text-white relative z-50 top-12 right-0 lg:right-0 lg:top-0 bg-dark text-xs w-[90px] h-[31px] rounded-[10px] flex justify-center items-center">
            Step 1 of <span className="text-white/50 ml-1.5"> 5</span>
          </p>
          <div className="flex lg:relative z-50 absolute bottom-10 lg:bottom-0  items-center gap-3">
            <button className="flex cursor-pointer hover:scale-95 duration-300 active:scale-100 w-[100px] h-[45px] border border-[#757575] rounded-[8px] justify-center items-center gap-1">
              {/* <Image src={"/icons/arr.svg"} alt="arr" width={24} height={24} /> */}
              <p className="text-xs text-[#757575]">Previous</p>
            </button>
            <button className=" flex cursor-pointer hover:scale-95 duration-300 active:scale-100 w-[100px] h-[45px] border border-[#1c1c1c] bg-white/70 rounded-[8px] justify-center items-center gap-1">
              <p className="text-xs text-[#1c1c1c]">Next</p>
              {/* <Image
                src={"/icons/arr2.svg"}
                // className="rotate-180"
                alt="arr"
                width={24}
                height={24}
              /> */}
            </button>
          </div>
        </div>
      </div>
      {/* Properties Panel or Test Panel */}
      {selectedNode && !showTestPanel && (
        <div className="absolute right-0 top-0 z-50 w-80 h-full">
          <PropertiesPanel
            node={selectedNode}
            onUpdateNode={onUpdateNode}
            onDeleteNode={onDeleteNode}
            onClose={() => setSelectedNode(null)}
          />
        </div>
      )}
      <div className="flex-1  relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          style={flowStyles}
          className="bg-gradient-to-br  h-full rounded-tl-[20px] w-full from-gray-900 to-black"
        >
          <Controls
            className="bg-black/80 border rotate-90 text-black border-gray-700 rounded-lg shadow-2xl"
            showInteractive={!false}
          />

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
      </div>
    </div>
  );
});

AgentBuilder.displayName = "AgentBuilder";

export default AgentBuilder;
