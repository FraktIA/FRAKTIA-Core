"use client";

import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import AgentChat from "@/components/AgentChat";
import { getAgentById } from "@/actions/user";
import { getAgentDetails } from "@/actions/agent";
import { AgentDetails } from "@/types/agent";
import { useAppKitAccount } from "@reown/appkit/react";

const Agent = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const agentId = params.id as string;
  const roomId = searchParams.get("roomId");
  const { address } = useAppKitAccount();

  // Debug logging
  console.log("Agent page - agentId:", agentId, "roomId:", roomId);

  const [agentDetails, setAgentDetails] = useState<AgentDetails | null>(null);
  const [agentDetailsLoading, setAgentDetailsLoading] = useState(true);
  const [agentDetailsError, setAgentDetailsError] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchAgentDetails = async () => {
      if (!agentId || !address) return;

      setAgentDetailsLoading(true);
      try {
        // Get agent data from user's collection (includes avatarUrl)
        const userAgentResult = await getAgentById(agentId, address);

        if (!userAgentResult.success || !userAgentResult.agent) {
          setAgentDetailsError(
            userAgentResult.error || "Failed to fetch agent details"
          );
          return;
        }

        // Get live agent status from ElizaOS server
        let agentStatus: "active" | "inactive" = "inactive";
        try {
          const liveStatusResult = await getAgentDetails(agentId);
          if (liveStatusResult.success && liveStatusResult.data) {
            agentStatus = liveStatusResult.data.status || "active";
          }
        } catch (statusError) {
          console.warn(
            "Failed to get live agent status, defaulting to active:",
            statusError
          );
          agentStatus = "active"; // Default to active if status check fails
        }

        // Transform AgentData to AgentDetails format, including avatarUrl and live status
        const transformedAgent: AgentDetails = {
          id: userAgentResult.agent.id || agentId,
          name: userAgentResult.agent.name || `Agent ${agentId}`,
          status: agentStatus,
          avatarUrl: userAgentResult.agent.avatarUrl as string,
          description: userAgentResult.agent.description,
          roomId: userAgentResult.agent.roomId,
        };

        setAgentDetails(transformedAgent);
        setAgentDetailsError(null);
      } catch (error) {
        setAgentDetailsError("Error fetching agent details");
        console.error("Error fetching agent details:", error);
      } finally {
        setAgentDetailsLoading(false);
      }
    };

    fetchAgentDetails();
  }, [agentId, address]);

  return (
    <div className="w-full flex-1 justify-between flex flex-col bg-bg">
      <Header agent={true} agentId={agentId} agentDetails={agentDetails} />

      {/* Address Required State */}
      {!address && (
        <div className="flex-1 mx-4 mt-4 bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center rounded-lg p-4">
          <p className="text-yellow-400 text-sm">
            Please connect your wallet to view agent details
          </p>
        </div>
      )}

      {/* Agent Details Loading State */}
      {agentDetailsLoading && address && (
        <div className="flex-1 mx-4 mt-4 bg-gray-500/10 border border-gray-500/20 flex items-center justify-center rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 text-sm">Loading agent details...</p>
          </div>
        </div>
      )}

      {/* Agent Details Error State */}
      {agentDetailsError && !agentDetailsLoading && address && (
        <div className="mx-4 mt-4 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400 text-sm">
            Failed to load agent details: {agentDetailsError}
          </p>
        </div>
      )}

      {/* Main Chat Area */}
      {!agentDetailsLoading && agentDetails && address && (
        <AgentChat agent={agentDetails} roomId={roomId} />
      )}
    </div>
  );
};

export default Agent;
