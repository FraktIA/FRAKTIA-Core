import React, { useEffect, useState } from "react";
import Image from "next/image";
import { AgentBox } from "./AgentBox";
import { useAppKitAccount } from "@reown/appkit/react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setActiveMenu,
  setShowNodesPanel,
  resetAgentBuilderFlow,
  selectAgentsRefreshTrigger,
  clearEditingMode,
} from "@/redux/slices/uiSlice";
import { getAgents } from "@/actions/user";

const AgentSection = () => {
  const [userAgents, setUserAgents] = useState<
    Array<{
      id: string;
      name: string;
      avatarUrl: string;
      roomId?: string;
      status?: "active" | "inactive";
    }>
  >([]);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const { isConnected, address } = useAppKitAccount();
  const dispatch = useAppDispatch();
  const agentsRefreshTrigger = useAppSelector(selectAgentsRefreshTrigger);

  // Fetch user agents when connected
  useEffect(() => {
    const fetchUserAgents = async () => {
      if (isConnected && address) {
        setLoadingAgents(true);
        try {
          const result = await getAgents(address);
          if (result.success) {
            setUserAgents(result.agents || []);
          } else {
            console.error("Failed to fetch agents:", result.error);
            setUserAgents([]);
          }
        } catch (error) {
          console.error("Error fetching agents:", error);
          setUserAgents([]);
        } finally {
          setLoadingAgents(false);
        }
      } else {
        setUserAgents([]);
      }
    };

    fetchUserAgents();
  }, [isConnected, address]);

  // Refresh agents when triggered by successful deployment
  useEffect(() => {
    const fetchUserAgents = async () => {
      if (isConnected && address && agentsRefreshTrigger > 0) {
        setLoadingAgents(true);
        try {
          const result = await getAgents(address);
          if (result.success) {
            setUserAgents(result.agents || []);
          } else {
            console.error("Failed to fetch agents:", result.error);
            setUserAgents([]);
          }
        } catch (error) {
          console.error("Error fetching agents:", error);
          setUserAgents([]);
        } finally {
          setLoadingAgents(false);
        }
      }
    };

    if (agentsRefreshTrigger > 0) {
      fetchUserAgents();
    }
  }, [agentsRefreshTrigger, isConnected, address]);

  const hasAgents = userAgents.length > 0;

  const handleCreateAgent = () => {
    // Clear editing mode and reset agent builder flow for new agent creation
    dispatch(clearEditingMode());
    dispatch(resetAgentBuilderFlow());
    dispatch(setActiveMenu("Arena"));
    dispatch(setShowNodesPanel(true));
  };

  return (
    <div className="flex  p-6  flex-col min-h-[400px]">
      {/* Create Button */}
      {hasAgents && (
        <button
          onClick={handleCreateAgent}
          className="bg-primary hidden lg:flex w-[100px] hover:bg-primary/90 hover:scale-95 self-end active:scale-100 cursor-pointer duration-200 items-center justify-center text-sm rounded-[8px] mb-6 h-[48px] text-black font-medium"
        >
          + Create
        </button>
      )}

      {/* Empty State */}
      {!hasAgents && !loadingAgents && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-16">
          {/* Animated Icon Container */}
          <div className="relative mb-8">
            <div className="absolute opacity-5 inset-0 bg-primary/20 rounded-full blur-md animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-primary/10 to-transparent p-8 rounded-full border border-primary/20">
              <Image
                src="/icons/brain.svg"
                alt="Brain icon"
                width={64}
                height={64}
                className="opacity-60 filter brightness-0 invert"
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="text-center max-w-md">
            <h3 className="text-2xl font-medium text-white mb-3">
              No Agents Created Yet
            </h3>
            <p className="text-gray-400  leading-relaxed mb-8">
              Start building your AI agents to automate tasks, process data, and
              enhance your workflow.
            </p>

            {/* CTA Button */}
            <button
              onClick={handleCreateAgent}
              className="bg-primary text-black px-8 py-3 rounded-lg  hover:bg-primary/90 hover:scale-105 active:scale-100 transition-all font-medium duration-200 cursor-pointer shadow-lg hover:shadow-primary/20"
            >
              Create Your First Agent
            </button>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-primary/30 rounded-full animate-ping"></div>
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-primary/40 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-primary/20 rounded-full animate-ping delay-500"></div>
        </div>
      )}

      {/* Loading State */}
      {loadingAgents && (
        <div className="flex-1 flex flex-col items-center justify-center px-8 py-16">
          <div className="relative mb-8">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-medium text-white mb-2">
              Loading your agents...
            </h3>
            <p className="text-gray-400">
              Please wait while we fetch your deployed agents.
            </p>
          </div>
        </div>
      )}

      <div
        className={`p-6 w-full mb-7 mt-16 bg-dark/80 backdrop-blur-sm h-[202px]  lg:h-[119px] rounded-[20px] flex flex-col lg:flex-row justify-between  lg:hidden items-start gap-3 transition-all duration-300 `}
      >
        <div className="flex w-max h-max items-center gap-2">
          <span className="text-base lg:text-2xl text-primary font-light">
            Agents
          </span>
          <span className="w-2 h-2  animate-pulse   bg-primary rounded-full"></span>
        </div>

        <p className="text-xs text-white/70">
          Take a look at your deployed agents
        </p>
        <button
          onClick={handleCreateAgent}
          className="bg-primary flex w-max items-center px-4 hover:bg-primary/90 hover:scale-95 active:scale-100 cursor-pointer duration-200 text-sm rounded-[8px]  h-[40px] text-black font-medium"
        >
          + Create new agent
        </button>
      </div>

      {hasAgents && !loadingAgents && (
        <div className="flex  flex-col gap-7 items-center justify-center relative">
          {userAgents.map((agent) => (
            <AgentBox
              key={agent.id}
              src={agent.avatarUrl}
              name={agent.name}
              id={agent.id}
              status={agent.status}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentSection;
