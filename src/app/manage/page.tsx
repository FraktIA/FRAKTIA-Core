"use client";
import Header from "@/components/Header";
import Nodes from "@/components/Nodes";
import Modal from "@/components/Modal";
import NoAccessComponent from "@/components/NoAccessComponent";
import { useEffect, useState, useCallback, useRef } from "react";

import AgentBuilder, { AgentBuilderRef } from "@/components/AgentBuilder";
import { useAppSelector } from "@/redux/hooks";
import { useAppKitAccount } from "@reown/appkit/react";
import { useRouter } from "next/navigation";

export default function Manage() {
  const [allowed, setAllowed] = useState(false);
  const { isConnected } = useAppKitAccount();
  const { showNodesPanel } = useAppSelector((state) => state.ui);
  const router = useRouter();
  const agentBuilderRef = useRef<AgentBuilderRef | null>(null);

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  const handleAddNode = useCallback(
    (nodeName: string, position?: { x: number; y: number }) => {
      if (agentBuilderRef.current) {
        agentBuilderRef.current.onAddNode(nodeName, position);
      }
    },
    []
  );

  // Don't render anything if not connected (will redirect)
  if (!isConnected) {
    return null;
  }

  return (
    <div className="flex  h-full flex-1 relative">
      {/* Framework selection */}
      {showNodesPanel && <Nodes onAddNode={handleAddNode} />}
      <div className="flex bg-dark flex-col flex-1 ">
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
