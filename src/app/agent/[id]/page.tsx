"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import AgentChat from "@/components/AgentChat";
import { getAgentDetails } from "@/actions/agent";
import { AgentDetails } from "@/types/agent";

const Agent = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const agentId = params.id as string;
  const roomId = searchParams.get("roomId");

  // Debug logging
  console.log("Agent page - agentId:", agentId, "roomId:", roomId);

  const [agentDetails, setAgentDetails] = useState<AgentDetails | null>(null);
  const [agentDetailsLoading, setAgentDetailsLoading] = useState(true);
  const [agentDetailsError, setAgentDetailsError] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchAgentDetails = async () => {
      if (!agentId) return;

      setAgentDetailsLoading(true);
      try {
        const result = await getAgentDetails(agentId);
        if (result.success && result.data) {
          setAgentDetails(result.data);
          setAgentDetailsError(null);
        } else {
          setAgentDetailsError(result.error || "Failed to fetch agent details");
        }
      } catch (error) {
        setAgentDetailsError("Error fetching agent details");
        console.error("Error fetching agent details:", error);
      } finally {
        setAgentDetailsLoading(false);
      }
    };

    fetchAgentDetails();
  }, [agentId]);

  return (
    <div className="w-full flex-1 justify-between flex flex-col bg-bg">
      <Header agent={true} agentId={agentId} agentDetails={agentDetails} />

      {/* Agent Details Loading State */}
      {agentDetailsLoading && (
        <div className="mx-4 mt-4 bg-gray-500/10 border border-gray-500/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 text-sm">Loading agent details...</p>
          </div>
        </div>
      )}

      {/* Agent Details Error State */}
      {agentDetailsError && !agentDetailsLoading && (
        <div className="mx-4 mt-4 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400 text-sm">
            Failed to load agent details: {agentDetailsError}
          </p>
        </div>
      )}

      {/* Main Chat Area */}
      {!agentDetailsLoading && (
        <AgentChat agent={agentDetails as AgentDetails} roomId={roomId} />
      )}
    </div>
  );
};

export default Agent;
