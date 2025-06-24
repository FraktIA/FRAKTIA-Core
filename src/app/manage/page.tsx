"use client";
import Header from "@/components/Header";
import Modal from "@/components/Modal";
import NoAccessComponent from "@/components/NoAccessComponent";
import { useEffect, useState, useCallback, useRef } from "react";
import { Node } from "@xyflow/react";

import AgentBuilder, { AgentBuilderRef } from "@/components/AgentBuilder";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { UnifiedPanel } from "@/components/UnifiedPanel";
import { setShowNodesPanel } from "@/redux/slices/uiSlice";
import NodesDataViewer from "@/components/NodesDataViewer";
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

  const handleClosePanel = useCallback(() => {
    if (agentBuilderRef.current) {
      agentBuilderRef.current.clearSelectedNode();
      dispatch(setShowNodesPanel(false));
    }
  }, [agentBuilderRef.current]);

  // Don't render anything if not connected (will redirect)
  // if (!isConnected) {
  //   return null;
  // }

  return (
    <div className="flex h-full flex-1 relative">
      <div className="flex  bg-bg flex-col flex-1">
        <Header />
        {/* Agent Builder */}
        <div className="flex h-full">
          <AgentBuilder ref={agentBuilderRef} />
          {/* Unified Panel on the right side */}
          {showNodesPanel || selectedNode ? (
            <div className="min-w-80 h-full">
              <UnifiedPanel
                selectedNode={selectedNode}
                onUpdateNode={handleUpdateNode}
                onClose={handleClosePanel}
                onAddNode={handleAddNode}
                currentReactFlowNodes={currentNodes}
              />
            </div>
          ) : (
            <NodesDataViewer />
          )}
        </div>
      </div>

      <Modal isOpen={!allowed} onClose={() => {}}>
        <NoAccessComponent onTryAnotherAccount={() => setAllowed(true)} />
      </Modal>
    </div>
  );
}
