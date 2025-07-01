import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
  toggleWalletDropdown,
  setShowWalletDropdown,
  selectActiveMenu,
  selectIsEditingAgent,
  selectEditingAgentDetails,
} from "@/redux/slices/uiSlice";
import {
  useAppKit,
  useAppKitAccount,
  useDisconnect,
} from "@reown/appkit/react";
import React, { useRef, useEffect } from "react";
import Image from "next/image";
import { AgentDetails } from "@/actions/agent";

const Header = ({
  agentId,
  agent,
  agentDetails,
}: {
  agentId?: string;
  agent?: boolean;
  agentDetails?: AgentDetails | null;
}) => {
  const dispatch = useAppDispatch();
  const { showNodesPanel, showPropertiesPanel, showWalletDropdown } =
    useAppSelector((state) => state.ui);
  const { open } = useAppKit();
  const { address, isConnected } = useAppKitAccount();
  const { disconnect } = useDisconnect();
  const activeMenu = useAppSelector(selectActiveMenu);
  const isEditingAgent = useAppSelector(selectIsEditingAgent);
  const editingAgentDetails = useAppSelector(selectEditingAgentDetails);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debug logging
  useEffect(() => {
    console.log(
      "Header - isEditingAgent:",
      isEditingAgent,
      "editingAgentDetails:",
      editingAgentDetails
    );
  }, [isEditingAgent, editingAgentDetails]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        dispatch(setShowWalletDropdown(false));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dispatch]);

  const handleWalletClick = () => {
    if (!isConnected) {
      // If not connected, directly open the connect modal
      open();
    } else {
      // If connected, show the dropdown
      dispatch(toggleWalletDropdown());
    }
  };

  const handleLogout = async () => {
    try {
      // Open the AppKit modal with disconnect option
      await disconnect();
      dispatch(setShowWalletDropdown(false));
    } catch (error) {
      console.error("Error during logout:", error);
      dispatch(setShowWalletDropdown(false));
    }
  };

  return (
    <div
      className={`bg-dark ${
        activeMenu == "Agents" ? "rounded-[20px] rounded-br-[20px]" : ""
      }  hidden lg:flex justify-between ${
        showNodesPanel ? "" : "rounded-tl-[20px]"
      }  ${
        showPropertiesPanel ? "rounded-br-[20px]" : "rounded-br-[0px]"
      }  items-center rounded-tr-[20px]   w-full  h-[11vh] pl-10 pr-9 py-4`}
    >
      {agent ? (
        <div
          className={`flex gap-4.5 justify-center  h-[97px] rounded-[20px] items-center cursor-pointer transition-all duration-300`}
        >
          <div>
            <Image
              src={"https://randomuser.me/api/portraits/men/32.jpg"}
              width={67}
              height={67}
              alt={"agent"}
              className="rounded-full"
            />
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-white font-semibold text-[20px]">
              {agentDetails?.name || "Unknown Agent"}
            </p>
            <div className="flex items-center gap-2">
              <p className="text-white/70 font-light text-xs">ID: {agentId}</p>
              {agentDetails?.status && (
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    agentDetails.status === "active"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {agentDetails.status}
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        // <AgentCard
        //   src="/images/claude.png"
        //   name="Claudia AI"
        //   id="1923e984fg991"
        //   className="mx-none"
        // />
        <div className="max-w-[260px] font-light flex flex-col gap-2">
          <div className="flex w-max h-max items-center gap-2">
            <span className="text-base lg:text-2xl text-primary font-light">
              {isEditingAgent && editingAgentDetails
                ? `Editing: ${editingAgentDetails.name}`
                : activeMenu}
            </span>
            <span className="w-2 h-2  animate-pulse   bg-primary rounded-full"></span>
          </div>

          {activeMenu === "Agents" ? (
            <p className="text-xs text-white/70">
              Take a look at your deployed agents
            </p>
          ) : isEditingAgent ? (
            <p className="text-xs text-white/70">
              <span className="font-medium">Modify</span> components{" "}
              <span className="font-medium">and</span> re-deploy your agent
            </p>
          ) : (
            <p className="text-xs text-white/70">
              <span className="font-medium">Select</span> components{" "}
              <span className="font-medium">to</span> configure and build your
              agent
            </p>
          )}
        </div>
      )}
      <div className="w-[335px] h-[60px] gap-6 justify-center flex items-center rounded-[15px] bg-bg">
        <a
          href="https://app.uniswap.org/#/swap?exactField=input&inputCurrency=ETH&outputCurrency=0xCDBdD8a173C385d8A3C8CAB7914a99e8c3d9C3a1"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-primary transition-colors cursor-pointer"
        >
          BUY FRAKTIA
        </a>
        <div className="relative" ref={dropdownRef}>
          <div
            className="flex text-[#232323] rounded-[4px] justify-center items-center gap-1 w-[171px] h-[36px] bg-primary hover:cursor-pointer transition-colors hover:bg-primary/90"
            onClick={handleWalletClick}
          >
            <p className="text-sm">
              {address
                ? `${address.slice(0, 6)}...${address.slice(-6)}`
                : "Connect Wallet"}
            </p>
            <svg
              className={`transition-transform duration-200 w-4 h-4 ${
                showWalletDropdown ? "rotate-90" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>

          {showWalletDropdown && (
            <div className="absolute top-full mt-2 right-0 w-[171px] bg-bg border border-gray-600 rounded-[8px] shadow-lg z-50">
              <div className="py-1">
                {isConnected ? (
                  <>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700 transition-colors rounded-[8px]"
                    >
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      open();
                      dispatch(setShowWalletDropdown(false));
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-white hover:bg-gray-700 transition-colors rounded-[8px]"
                  >
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
