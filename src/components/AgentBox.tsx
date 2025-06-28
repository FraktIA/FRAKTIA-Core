import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppKitAccount } from "@reown/appkit/react";
import { useAppDispatch } from "@/redux/hooks";
import {
  setActiveMenu,
  setShowNodesPanel,
  resetAgentBuilderFlow,
  setEditingAgent,
} from "@/redux/slices/uiSlice";
import { createChatroom } from "@/actions/agent";
import { getAgentById } from "@/actions/user";
import { IconButton } from "./IconButton";

interface AgentCardProps {
  src: string;
  name: string;
  id: string;
  className?: string;
  delay?: number;
}

export const AgentBox = ({ src, name, id, className = "" }: AgentCardProps) => {
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const router = useRouter();
  const { address } = useAppKitAccount();
  const dispatch = useAppDispatch();

  const handleChatClick = async () => {
    if (!address) {
      console.error("User address not available");
      return;
    }

    try {
      setIsCreatingRoom(true);

      // Create or get existing chatroom
      const result = await createChatroom({
        agentId: id,
        userAddress: address,
      });

      if (result.success && result.roomId) {
        // Navigate to the agent page with room ID
        router.push(`/agent/${id}?roomId=${result.roomId}`);
      } else {
        console.error("Failed to create/get chatroom:", result.error);
        // Still navigate even if room creation failed - let the agent page handle it
        router.push(`/agent/${id}`);
      }
    } catch (error) {
      console.error("Error handling chat click:", error);
      // Still navigate even if error occurred
      router.push(`/agent/${id}`);
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const handleEditClick = async () => {
    if (!address) {
      console.error("User address not available");
      return;
    }

    try {
      setIsLoadingEdit(true);

      // Get the agent data from database
      const result = await getAgentById(id, address);

      if (result.success && result.agent) {
        console.log("Loading agent for editing:", result.agent);

        // Set the editing state with agent details
        console.log("Setting editing agent state:", {
          id: result.agent.id || id,
          name: result.agent.name || name,
        });
        dispatch(
          setEditingAgent({
            id: result.agent.id || id,
            name: result.agent.name || name,
          })
        );

        // Set up the UI state - Don't reset flow when editing, we want to go to last step
        // dispatch(resetAgentBuilderFlow()); // Remove this line
        dispatch(setActiveMenu("Arena"));
        dispatch(setShowNodesPanel(true));

        // Store agent nodes in localStorage for now (temporary solution)
        localStorage.setItem(
          "editingAgentNodes",
          JSON.stringify(result.agent.nodes)
        );
        console.log("Stored agent nodes in localStorage");

        // Store agent editing info in sessionStorage (more reliable than URL)
        sessionStorage.setItem(
          "editingAgentInfo",
          JSON.stringify({
            id: result.agent.id || id,
            name: result.agent.name || name,
          })
        );

        console.log("Agent editing mode set successfully");

        // Navigate to arena
        router.push("/");
      } else {
        console.error("Failed to load agent:", result.error);
        // Still navigate to arena even if loading failed
        dispatch(resetAgentBuilderFlow());
        dispatch(setActiveMenu("Arena"));
        dispatch(setShowNodesPanel(true));
        router.push("/");
      }
    } catch (error) {
      console.error("Error handling edit click:", error);
      // Still navigate to arena even if error occurred
      dispatch(resetAgentBuilderFlow());
      dispatch(setActiveMenu("Arena"));
      dispatch(setShowNodesPanel(true));
      router.push("/");
    } finally {
      setIsLoadingEdit(false);
    }
  };

  const handleDeleteClick = () => {
    // TODO: Implement delete functionality
    console.log(`Delete ${name} - ID: ${id}`);
    // This would open a confirmation modal and then call a delete API
  };
  const actionButtons = [
    {
      iconName: "fluent:chat-20-regular",
      text: "Chat",
      color: "#ffffff",
      action: handleChatClick,
      loading: isCreatingRoom,
    },
    {
      iconName: "fluent:edit-32-regular",
      text: "Edit",
      color: "#ffffff",
      action: handleEditClick,
      loading: isLoadingEdit,
    },
    {
      iconName: "fluent:delete-20-regular",
      text: "Delete",
      color: "#EE4F27",
      action: handleDeleteClick,
      loading: false,
    },
  ];

  return (
    <div
      className={`p-6 w-full bg-dark/80 backdrop-blur-sm h-max gap-6  lg:h-[119px] rounded-[20px] flex flex-col lg:flex-row justify-between items-start lg:items-center  transition-all duration-300 ${className} `}
    >
      <div className="flex items-center   justify-center gap-2 lg:gap-4.5">
        <div className="relative w-[48px] h-[48px] lg:w-[67px] lg:h-[67px]">
          <Image src={src} alt={name} fill className="rounded-full" />
        </div>
        <div className="flex flex-col gap-1 lg:gap-2">
          <p className="text-white font-medium text-sm lg:text-[20px]">
            {name}
          </p>
          <p className="text-white/70 font-light text-[10px] lg:text-xs">
            ID: {id}
          </p>
        </div>
      </div>
      <div className="flex   gap-4 items-center">
        {actionButtons.map((button) => (
          <IconButton
            key={`${id}-${button.text.toLowerCase()}`}
            iconName={button.iconName}
            text={button.text}
            color={button.color}
            onClick={button.action}
            // className={`${button.text == "Chat" ? "hidden lg:flex" : ""}`}
          />
        ))}
      </div>
    </div>
  );
};
