import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Node } from "@xyflow/react";
import {
  setAllNodes,
  setSelectedNode,
  setSelectedNodes,
  updateNode,
  syncNodes,
  selectAllNodes,
  selectSelectedNode,
  selectSelectedNodes,
} from "@/redux/slices/selectedNodesSlice";

/**
 * Custom hook to integrate ReactFlow nodes with Redux store
 * This hook provides functions to sync node state between ReactFlow and Redux
 */
export const useNodesSync = () => {
  const dispatch = useDispatch();

  // Selectors to get current state
  const allNodes = useSelector(selectAllNodes);
  const selectedNode = useSelector(selectSelectedNode);
  const selectedNodes = useSelector(selectSelectedNodes);

  // Function to sync all nodes from ReactFlow to Redux
  const syncAllNodes = useCallback(
    (nodes: Node[]) => {
      dispatch(setAllNodes(nodes));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Function to sync selected node from ReactFlow to Redux
  const syncSelectedNode = useCallback(
    (node: Node | null) => {
      dispatch(setSelectedNode(node));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Function to sync multiple selected nodes from ReactFlow to Redux
  const syncSelectedNodes = useCallback(
    (nodes: Node[]) => {
      dispatch(setSelectedNodes(nodes));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Function to update a specific node's data
  const updateNodeData = useCallback(
    (nodeId: string, data: Record<string, unknown>) => {
      dispatch(updateNode({ nodeId, data }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Function to perform a complete sync of all data
  const performFullSync = useCallback(
    (allNodesData: Node[], selectedNodesData: Node[]) => {
      dispatch(
        syncNodes({ allNodes: allNodesData, selectedNodes: selectedNodesData })
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Function to get current Redux state for API calls
  const getNodesForAPI = useCallback(() => {
    return {
      allNodes,
      selectedNodes,
      selectedNode,
      totalNodes: allNodes.length,
      selectedCount: selectedNodes.length,
      lastUpdated: new Date().toISOString(),
    };
  }, [allNodes, selectedNodes, selectedNode]);

  return {
    // Current state
    allNodes,
    selectedNode,
    selectedNodes,

    // Sync functions
    syncAllNodes,
    syncSelectedNode,
    syncSelectedNodes,
    updateNodeData,
    performFullSync,

    // API helper
    getNodesForAPI,
  };
};

/**
 * Custom hook specifically for AgentBuilder component
 * This provides a simpler interface tailored for the AgentBuilder use case
 */
export const useAgentBuilderSync = () => {
  const {
    allNodes,
    selectedNode,
    selectedNodes,
    syncAllNodes,
    syncSelectedNode,
    updateNodeData,
    getNodesForAPI,
  } = useNodesSync();

  // Effect to log state changes (for debugging)
  useEffect(() => {
    console.log("Redux nodes state updated:", {
      totalNodes: allNodes.length,
      selectedNode: selectedNode?.data?.label || "none",
      selectedCount: selectedNodes.length,
    });
  }, [allNodes, selectedNode, selectedNodes]);

  // Function to handle ReactFlow onNodesChange
  const handleNodesChange = useCallback(
    (nodes: Node[]) => {
      console.log(
        "useNodesSync - handleNodesChange called with",
        nodes.length,
        "nodes"
      );
      syncAllNodes(nodes);
    },
    [syncAllNodes]
  );

  // Function to handle ReactFlow onSelectionChange
  const handleSelectionChange = useCallback(
    ({ nodes }: { nodes: Node[] }) => {
      if (nodes.length > 0) {
        syncSelectedNode(nodes[0]);
      } else {
        syncSelectedNode(null);
      }
    },
    [syncSelectedNode]
  );

  // Function to handle node data updates from properties panel
  const handleNodeUpdate = useCallback(
    (nodeId: string, data: Record<string, unknown>) => {
      updateNodeData(nodeId, data);
    },
    [updateNodeData]
  );

  // Function to prepare data for API submission
  const prepareForAPISubmission = useCallback(() => {
    const apiData = getNodesForAPI();

    // Additional processing for API format
    return {
      ...apiData,
      // Add any additional transformations needed for your API
      workflow: {
        nodes: apiData.allNodes, // Already converted to API format
        selectedNode: apiData.selectedNode, // Already converted to API format
        metadata: {
          totalNodes: apiData.totalNodes,
          lastUpdated: apiData.lastUpdated,
        },
      },
    };
  }, [getNodesForAPI]);

  return {
    // Current state
    allNodes,
    selectedNode,
    selectedNodes,

    // Event handlers for ReactFlow
    handleNodesChange,
    handleSelectionChange,
    handleNodeUpdate,

    // Direct sync functions
    syncAllNodes,

    // API preparation
    prepareForAPISubmission,
  };
};
