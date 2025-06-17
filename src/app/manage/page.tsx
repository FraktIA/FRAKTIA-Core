"use client";
import Header from "@/components/Header";
import Nodes from "@/components/Nodes";
import Modal from "@/components/Modal";
import NoAccessComponent from "@/components/NoAccessComponent";
import { useEffect, useState } from "react";

import AgentBuilder from "@/components/AgentBuilder";
import { useAppSelector } from "@/redux/hooks";
import { useAppKitAccount } from "@reown/appkit/react";
import { useRouter } from "next/navigation";

export default function Manage() {
  const [allowed, setAllowed] = useState(false);
  const { isConnected } = useAppKitAccount();
  const { showNodesPanel } = useAppSelector((state) => state.ui);
  const router = useRouter();

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  // Don't render anything if not connected (will redirect)
  if (!isConnected) {
    return null;
  }

  return (
    <div className="flex  h-full flex-1 relative">
      {/* Framework selection */}
      {showNodesPanel && <Nodes />}
      <div className="flex  flex-col flex-1 ">
        <Header />
        {/* Agent Builder */}
        <AgentBuilder />
      </div>
      <Modal isOpen={!allowed} onClose={() => {}}>
        <NoAccessComponent onTryAnotherAccount={() => setAllowed(true)} />
      </Modal>
    </div>
  );
}
