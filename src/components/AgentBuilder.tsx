import { useCallback, useState } from "react";

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
import { PropertiesPanel } from "./PropertiesPanel";

const nodeTypes = {
  framework: FrameworkNode,
  model: ModelNode,
  voice: VoiceNode,
  integration: IntegrationNode,
  logic: LogicNode,
  output: OutputNode,
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
};

const AgentBuilder = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [showTestPanel] = useState(false);
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  // const onAddNode = useCallback(
  //   (nodeType: string, position?: { x: number; y: number }) => {
  //     const newNode: Node = {
  //       id: `${Date.now()}`,
  //       type: nodeType,
  //       position: position || {
  //         x: Math.random() * 400 + 50,
  //         y: Math.random() * 400 + 50,
  //       },
  //       data: {
  //         label: getNodeLabel(nodeType),
  //         configured: false,
  //         ...getDefaultNodeData(nodeType),
  //       },
  //     };
  //     setNodes((nds) => [...nds, newNode]);
  //   },
  //   [setNodes]
  // );

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

  // const validateFlow = useCallback(() => {
  //   // Find framework node
  //   const frameworkNode = nodes.find((node) => node.type === "framework");
  //   if (!frameworkNode) {
  //     return "No framework node found. Please add a framework node to start.";
  //   }

  //   // Find output node
  //   const outputNode = nodes.find((node) => node.type === "output");
  //   if (!outputNode) {
  //     return "No output node found. Please add an output node to complete the flow.";
  //   }

  //   // Check if there's a path from framework to output
  //   const visited = new Set<string>();
  //   const queue = [frameworkNode.id];
  //   visited.add(frameworkNode.id);

  //   while (queue.length > 0) {
  //     const currentId = queue.shift()!;
  //     if (currentId === outputNode.id) {
  //       return null; // Valid path found
  //     }

  //     // Add all connected nodes to the queue
  //     edges.forEach((edge) => {
  //       if (edge.source === currentId && !visited.has(edge.target)) {
  //         visited.add(edge.target);
  //         queue.push(edge.target);
  //       }
  //     });
  //   }

  //   return "No valid path found from framework to output node. Please connect the nodes properly.";
  // }, [nodes, edges]);
  return (
    <div
      className=" w-full   relative h-full"
      style={{
        paddingRight:
          (selectedNode && !showTestPanel) || showTestPanel ? "320px" : "0",
      }}
    >
      {/* Properties Panel or Test Panel */}
      {selectedNode && !showTestPanel && (
        <div className="absolute right-0 z-40 w-80 h-full bg-black/90 border-l border-gray-800 backdrop-blur-sm">
          <PropertiesPanel
            node={selectedNode}
            onUpdateNode={onUpdateNode}
            onDeleteNode={onDeleteNode}
            onClose={() => setSelectedNode(null)}
          />
        </div>
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        style={flowStyles}
        className="bg-gradient-to-br  w-full from-gray-900 to-black"
      >
        <Controls
          className="bg-black/80 border text-black border-gray-700 rounded-lg shadow-2xl"
          showInteractive={!false}
        />
        <MiniMap
          position="bottom-right"
          className="bg-black/80 border  border-gray-700 rounded-lg shadow-2xl"
          nodeColor="#39ff14"
          maskColor="rgba(0, 0, 0, 0.9)"
        />
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#262626"
        />
      </ReactFlow>
    </div>
  );
};

export default AgentBuilder;
