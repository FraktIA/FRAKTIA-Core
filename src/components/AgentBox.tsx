import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppKitAccount } from "@reown/appkit/react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  setActiveMenu,
  setShowNodesPanel,
  resetAgentBuilderFlow,
  setEditingAgent,
  openModal,
  closeModal,
  selectActiveModal,
  triggerAgentsRefresh,
} from "@/redux/slices/uiSlice";
import { createChatroom } from "@/actions/agent";
import { getAgentById, deleteAgent } from "@/actions/user";
import { IconButton } from "./IconButton";
import Modal from "./Modal";
import { Icon } from "@iconify/react/dist/iconify.js";

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
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { address } = useAppKitAccount();
  const dispatch = useAppDispatch();
  const activeModal = useAppSelector(selectActiveModal);

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
    // Open confirmation modal
    dispatch(openModal(`deleteConfirm-${id}`));
  };

  const handleConfirmDelete = async () => {
    if (!address) {
      console.error("User address not available");
      return;
    }

    try {
      setIsDeleting(true);

      // Call the delete action
      const result = await deleteAgent(id, address);

      if (result.success) {
        // Close confirmation modal and open success modal
        dispatch(closeModal());

        // Add a small delay to ensure the modal state is properly set
        setTimeout(() => {
          dispatch(openModal(`deleteSuccess-${id}`));
        }, 50);

        console.log(`Agent ${name} deleted successfully`);

        // Trigger refresh after a delay to avoid interfering with modal state
        setTimeout(() => {
          dispatch(triggerAgentsRefresh());
        }, 5000);
      } else {
        console.error("Failed to delete agent:", result.error);
        // Close confirmation modal and show error
        dispatch(closeModal());
        // You could implement an error modal here if needed
      }
    } catch (error) {
      console.error("Error deleting agent:", error);
      dispatch(closeModal());
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    dispatch(closeModal());
  };

  const handleDeleteSuccessClose = () => {
    dispatch(closeModal());
    // Ensure agents refresh happens when modal is closed
    dispatch(triggerAgentsRefresh());
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
      loading: isDeleting,
    },
  ];

  return (
    <>
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={activeModal === `deleteConfirm-${id}`}
        onClose={handleCancelDelete}
      >
        <div className="bg-dark justify-center w-[327px] h-[339px] lg:w-[691px] lg:h-[352px] rounded-[20px] shadow-lg flex flex-col items-center">
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-12 mb-8 h-12">
              <Icon
                icon={"streamline-ultimate:garbage-bin-bold"}
                fontSize={48}
                color="#F8FF99"
              />
            </div>
            <h2 className="text-white mb-6 text-center">
              Are you sure you want to delete{" "}
              <span className="text-primary font-semibold">{name}</span>?
            </h2>
            <p className="text-white/70 text-sm mb-8 text-center px-8">
              This action cannot be undone. The agent will be permanently
              removed from your account.
            </p>
          </div>
          <div className="flex gap-4 mb-8">
            <button
              className="w-[120px] cursor-pointer border-[#757575] border text-white rounded-[8px] flex items-center justify-center hover:bg-white/10 duration-200 h-[48px]"
              onClick={handleCancelDelete}
              disabled={isDeleting}
            >
              <p className="text-sm">Cancel</p>
            </button>
            <button
              className={`w-[120px] cursor-pointer border-[#EE4F27] border text-white rounded-[8px] flex items-center justify-center bg-[#EE4F27] hover:bg-[#EE4F27]/80 duration-200 h-[48px] ${
                isDeleting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              <p className="text-sm">{isDeleting ? "Deleting..." : "Delete"}</p>
            </button>
          </div>
          {/* <div className="flex w-max h-max items-center gap-2 py-5 relative">
            <span className="w-[14px] h-[14px] lg:w-5 lg:h-5 bg-primary rounded-full"></span>
            <span className="text-base lg:text-[20px] text-primary font-light">
              FRAKTIA
            </span>
          </div> */}
        </div>
      </Modal>

      {/* Delete Success Modal */}
      <Modal
        isOpen={activeModal === `deleteSuccess-${id}`}
        onClose={handleDeleteSuccessClose}
      >
        <div className="bg-dark justify-center w-[327px] h-[339px] lg:w-[691px] lg:h-[352px] rounded-[20px] shadow-lg flex flex-col items-center">
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-12 mb-8 h-12">
              <Image
                src={"/icons/check-circle.svg"}
                fill
                alt="success"
                className=""
              />
            </div>
            <h2 className="text-white mb-6 text-center">
              <span className="text-primary font-semibold">{name}</span> Deleted
              Successfully
            </h2>
            <p className="text-white/70 text-sm mb-8 text-center px-8">
              The agent has been permanently removed from your account.
            </p>
          </div>
          <button
            className="w-[263px] mb-8 border-[#232323] border text-black rounded-[8px] flex items-center gap-1 justify-center bg-primary cursor-pointer hover:bg-primary/80 duration-200 h-[48px] lg:w-[320px]"
            onClick={handleDeleteSuccessClose}
          >
            <p>Continue</p>
          </button>
          <div className="flex w-max h-max items-center gap-2 py-5 relative">
            <span className="w-[14px] h-[14px] lg:w-5 lg:h-5 bg-primary rounded-full"></span>
            <span className="text-base lg:text-[20px] text-primary font-light">
              FRAKTIA
            </span>
          </div>
        </div>
      </Modal>
    </>
  );
};
