"use client";
import Header from "@/components/Header";
import Nodes from "@/components/NodesPanel";
import Modal from "@/components/Modal";
import NoAccessComponent from "@/components/NoAccessComponent";
import { useEffect, useState, useCallback, useRef } from "react";

import AgentBuilder, { AgentBuilderRef } from "@/components/AgentBuilder";
import { useAppSelector } from "@/redux/hooks";
// import { useAppKitAccount } from "@reown/appkit/react";
// import { useRouter } from "next/navigation";

export default function Manage() {
  const [allowed, setAllowed] = useState(false);
  const [currentNodes, setCurrentNodes] = useState<
    Array<{ type?: string; data?: { label?: string } }>
  >([]);
  // const { isConnected } = useAppKitAccount();
  const { showNodesPanel } = useAppSelector((state) => state.ui);
  // const router = useRouter();
  const agentBuilderRef = useRef<AgentBuilderRef | null>(null);

  // Function to update current nodes from AgentBuilder
  const updateCurrentNodes = useCallback(() => {
    if (agentBuilderRef.current) {
      const nodes = agentBuilderRef.current.getCurrentNodes();
      setCurrentNodes(
        nodes.map((node) => ({ type: node.type, data: node.data }))
      );
    }
  }, []);

  // Update nodes periodically or when needed
  useEffect(() => {
    const interval = setInterval(updateCurrentNodes, 500); // Update every 500ms
    return () => clearInterval(interval);
  }, [updateCurrentNodes]);

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

  // Don't render anything if not connected (will redirect)
  // if (!isConnected) {
  //   return null;
  // }

  return (
    <div className="flex h-full flex-1 relative">
      {/* Framework selection */}
      {showNodesPanel && (
        <Nodes onAddNode={handleAddNode} currentReactFlowNodes={currentNodes} />
      )}
      <div className="flex bg-bg  flex-col flex-1 ">
        <Header />
        {/* Agent Builder */}
        <AgentBuilder ref={agentBuilderRef} />
      </div>
      <Modal isOpen={!allowed} onClose={() => {}}>
        <NoAccessComponent onTryAnotherAccount={() => setAllowed(true)} />
      </Modal>
    </div>
  );
}
