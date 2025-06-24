import { createSlice, PayloadAction, current } from "@reduxjs/toolkit";
import { Node } from "@xyflow/react";

// Serializable node interface for Redux storage (keeps id for internal tracking)
interface SerializableNode {
  id: string;
  type?: string;
  data: Record<string, unknown>;
}

// Final API data interface (without tracking fields)
export interface APINode {
  type?: string;
  data: Record<string, unknown>;
}

// Interface for the selected nodes state
interface SelectedNodesState {
  selectedNodes: SerializableNode[];
  selectedNode: SerializableNode | null;
  allNodes: SerializableNode[];
  lastUpdated: string | null;
}

// Helper function to convert ReactFlow Node to SerializableNode
const nodeToSerializable = (node: Node): SerializableNode => ({
  id: node.id,
  type: node.type,
  data: { ...node.data },
});

// Helper function to convert SerializableNode to APINode (for final data)
const nodeToAPI = (node: SerializableNode): APINode => ({
  type: node.type,
  data: { ...node.data },
});

// Helper function to convert array of ReactFlow Nodes to SerializableNodes
const nodesToSerializable = (nodes: Node[]): SerializableNode[] =>
  nodes.map(nodeToSerializable);

// Initial state
const initialState: SelectedNodesState = {
  selectedNodes: [],
  selectedNode: null,
  allNodes: [],
  lastUpdated: null,
};

// Create the slice
const selectedNodesSlice = createSlice({
  name: "selectedNodes",
  initialState,
  reducers: {
    // Set all nodes from ReactFlow
    setAllNodes: (state, action: PayloadAction<Node[]>) => {
      return {
        ...state,
        allNodes: nodesToSerializable(action.payload),
        lastUpdated: new Date().toISOString(),
      };
    },

    // Set the currently selected node
    setSelectedNode: (state, action: PayloadAction<Node | null>) => {
      const serializableNode = action.payload
        ? nodeToSerializable(action.payload)
        : null;
      return {
        ...state,
        selectedNode: serializableNode,
        selectedNodes: serializableNode ? [serializableNode] : [],
        lastUpdated: new Date().toISOString(),
      };
    },

    // Set multiple selected nodes (for multi-selection)
    setSelectedNodes: (state, action: PayloadAction<Node[]>) => {
      const serializableNodes = nodesToSerializable(action.payload);
      return {
        ...state,
        selectedNodes: serializableNodes,
        selectedNode:
          serializableNodes.length > 0 ? serializableNodes[0] : null,
        lastUpdated: new Date().toISOString(),
      };
    },

    // Add a node to the selection
    addSelectedNode: (state, action: PayloadAction<Node>) => {
      const currentNodes = current(state.selectedNodes);
      const newNode = nodeToSerializable(action.payload);
      const nodeExists = currentNodes.some((node) => node.id === newNode.id);

      if (!nodeExists) {
        return {
          ...state,
          selectedNodes: [...currentNodes, newNode],
          selectedNode: newNode,
          lastUpdated: new Date().toISOString(),
        };
      }
      return state;
    },

    // Remove a node from the selection
    removeSelectedNode: (state, action: PayloadAction<string>) => {
      const currentNodes = current(state.selectedNodes);
      const filteredNodes = currentNodes.filter(
        (node) => node.id !== action.payload
      );

      return {
        ...state,
        selectedNodes: filteredNodes,
        selectedNode: filteredNodes.length > 0 ? filteredNodes[0] : null,
        lastUpdated: new Date().toISOString(),
      };
    },

    // Clear all selections
    clearSelection: (state) => {
      return {
        ...state,
        selectedNodes: [],
        selectedNode: null,
        lastUpdated: new Date().toISOString(),
      };
    },

    // Update a specific node in all collections
    updateNode: (
      state,
      action: PayloadAction<{ nodeId: string; data: Record<string, unknown> }>
    ) => {
      const { nodeId, data } = action.payload;
      const currentAllNodes = current(state.allNodes);
      const currentSelectedNodes = current(state.selectedNodes);
      const currentSelectedNode = current(state.selectedNode);

      // Update in allNodes
      const updatedAllNodes = currentAllNodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      );

      // Update in selectedNodes
      const updatedSelectedNodes = currentSelectedNodes.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
      );

      // Update selectedNode if it matches
      const updatedSelectedNode =
        currentSelectedNode?.id === nodeId
          ? {
              ...currentSelectedNode,
              data: { ...currentSelectedNode.data, ...data },
            }
          : currentSelectedNode;

      return {
        ...state,
        allNodes: updatedAllNodes,
        selectedNodes: updatedSelectedNodes,
        selectedNode: updatedSelectedNode,
        lastUpdated: new Date().toISOString(),
      };
    },

    // Sync nodes from ReactFlow (for real-time updates)
    syncNodes: (
      state,
      action: PayloadAction<{ allNodes: Node[]; selectedNodes: Node[] }>
    ) => {
      const { allNodes, selectedNodes } = action.payload;

      return {
        ...state,
        allNodes: nodesToSerializable(allNodes),
        selectedNodes: nodesToSerializable(selectedNodes),
        selectedNode:
          selectedNodes.length > 0
            ? nodeToSerializable(selectedNodes[0])
            : null,
        lastUpdated: new Date().toISOString(),
      };
    },
  },
});

// Export actions
export const {
  setAllNodes,
  setSelectedNode,
  setSelectedNodes,
  addSelectedNode,
  removeSelectedNode,
  clearSelection,
  updateNode,
  syncNodes,
} = selectedNodesSlice.actions;

// Export selectors
export const selectAllNodes = (state: { selectedNodes: SelectedNodesState }) =>
  state.selectedNodes.allNodes;

export const selectSelectedNodes = (state: {
  selectedNodes: SelectedNodesState;
}) => state.selectedNodes.selectedNodes;

export const selectSelectedNode = (state: {
  selectedNodes: SelectedNodesState;
}) => state.selectedNodes.selectedNode;

export const selectLastUpdated = (state: {
  selectedNodes: SelectedNodesState;
}) => state.selectedNodes.lastUpdated;

// Additional selectors for API data preparation
export const selectNodesForAPI = (state: {
  selectedNodes: SelectedNodesState;
}) => ({
  allNodes: state.selectedNodes.allNodes.map(nodeToAPI),
  selectedNodes: state.selectedNodes.selectedNodes.map(nodeToAPI),
  selectedNode: state.selectedNodes.selectedNode
    ? nodeToAPI(state.selectedNodes.selectedNode)
    : null,
  totalNodes: state.selectedNodes.allNodes.length,
  selectedCount: state.selectedNodes.selectedNodes.length,
  lastUpdated: state.selectedNodes.lastUpdated,
});

// Selector for nodes by type
export const selectNodesByType =
  (nodeType: string) => (state: { selectedNodes: SelectedNodesState }) =>
    state.selectedNodes.allNodes.filter((node) => node.type === nodeType);

// Selector for nodes with specific data criteria
export const selectNodesWithData =
  (dataKey: string) => (state: { selectedNodes: SelectedNodesState }) =>
    state.selectedNodes.allNodes.filter(
      (node) => node.data && node.data[dataKey] !== undefined
    );

// Export the reducer
export default selectedNodesSlice.reducer;
