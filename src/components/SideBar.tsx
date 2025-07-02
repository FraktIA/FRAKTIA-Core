"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectActiveMenu,
  selectActiveNav,
  setActiveMenu,
  selectAgentBuilderFlow,
  setActiveNav,
  setShowNodesPanel,
  setShowWalletDropdown,
  toggleWalletDropdown,
  goToStep,
  selectAgentsRefreshTrigger,
  clearEditingMode,
  setShowFeedbackModal,
} from "@/redux/slices/uiSlice";
import { useAppKitAccount, useDisconnect } from "@reown/appkit/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAgents } from "@/actions/user";
import { createChatroom } from "@/actions/agent";

type NodePanelProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

const SideBar = ({ sidebarOpen, setSidebarOpen }: NodePanelProps) => {
  // const [activeNav, setActiveNav] = useState("Framework");
  const activeNav = useAppSelector(selectActiveNav);
  const activeMenu = useAppSelector(selectActiveMenu);
  const agentBuilderFlow = useAppSelector(selectAgentBuilderFlow);

  const navItems = [
    {
      key: "Framework",
      label: "Framework",
      svg: (active: boolean, completed: boolean) => (
        <svg
          width="24"
          height="24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 4h2c1.414 0 2.121 0 2.56.44C19 4.878 19 5.585 19 7m-9-3H8c-1.414 0-2.121 0-2.56.44C5 4.878 5 5.585 5 7m5 13H8c-1.414 0-2.121 0-2.56-.44C5 19.122 5 18.415 5 17m9 3h2c1.414 0 2.121 0 2.56-.44.44-.439.44-1.146.44-2.56m-9-5h4M13 2h-2a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1V3a1 1 0 00-1-1zm0 16h-2a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 00-1-1zm8-5v-2a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1zM7 13v-2a1 1 0 00-1-1H4a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1z"
            stroke={completed ? "#232323" : active ? "#232323" : "#fff"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      key: "AI Model",
      label: "AI Model",
      svg: (active: boolean, completed: boolean) => (
        <svg
          width="24"
          height="24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 4.5a3 3 0 00-2.567 4.554 3.001 3.001 0 000 5.893M7 4.5a2.5 2.5 0 115 0m-5 0c0 .818.393 1.544 1 2m-3.567 8.447A3 3 0 007 19.5a2.5 2.5 0 005 0m-7.567-4.553A3 3 0 016 13.67m6-9.17v15m0-15a2.5 2.5 0 015 0 3 3 0 012.567 4.554M12 19.5a2.5 2.5 0 005 0m0 0a3 3 0 002.567-4.553 3.002 3.002 0 000-5.893M17 19.5c0-.818-.393-1.544-1-2m3.567-8.446A3 3 0 0118 10.329"
            stroke={completed ? "#232323" : active ? "#232323" : "#fff"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      key: "Voice",
      label: "Voice",
      svg: (active: boolean, completed: boolean) => (
        <svg
          width="24"
          height="24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 10v1a6 6 0 006 6m6-7v1a6 6 0 01-6 6m0 0v4m0 0h4m-4 0H8m4-7a3 3 0 01-3-3V6a3 3 0 116 0v5a3 3 0 01-3 3z"
            stroke={completed ? "#232323" : active ? "#232323" : "#fff"}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      key: "Character",
      label: "Character",
      svg: (active: boolean, completed: boolean) => (
        <svg
          width="24"
          height="24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16 9a4 4 0 11-8 0 4 4 0 018 0zm-2 0a2 2 0 11-4 0 2 2 0 014 0z"
            fill={completed ? "#232323" : active ? "#232323" : "#fff"}
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM3 12c0 2.09.713 4.014 1.908 5.542A8.99 8.99 0 0112.065 14a8.98 8.98 0 017.092 3.458A9.001 9.001 0 103 12zm9 9a8.96 8.96 0 01-5.672-2.012A6.99 6.99 0 0112.065 16a6.99 6.99 0 015.689 2.92A8.96 8.96 0 0112 21z"
            fill={completed ? "#232323" : active ? "#232323" : "#fff"}
          />
        </svg>
      ),
    },
    {
      key: "Plugins",
      label: "Plugins",
      svg: (active: boolean, completed: boolean) => (
        <svg
          width="24"
          height="24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.116 8.5h7.769v-1h-7.77l.001 1zm0 4h4.769v-1h-4.77l.001 1zm10.384 7v-3h-3v-1h3v-3h1v3h3v1h-3v3h-1zm-14-.711V5.115c0-.445.158-.825.475-1.141a1.56 1.56 0 011.14-.475h11.77c.444 0 .824.158 1.14.475.316.317.474.697.475 1.14v4.902a9.297 9.297 0 00-.385-.014 24.579 24.579 0 00-.384-.003c-1.593 0-2.947.557-4.06 1.672-1.113 1.115-1.67 2.468-1.671 4.059l.003.385c.002.128.007.256.014.384H5.79l-2.29 2.29z"
            fill={completed ? "#232323" : active ? "#232323" : "#fff"}
          />
        </svg>
      ),
    },
  ];
  // const agentsOpen = activeMenu === "Agents";
  // const arenaOpen = activeMenu === "Arena";
  const [agentsOpen, setAgentsOpen] = useState(false);
  const [arenaOpen, setArenaOpen] = useState(false);
  const [userAgents, setUserAgents] = useState<
    Array<{
      id: string;
      name: string;
      avatarUrl: string;
      roomId?: string;
    }>
  >([]);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [creatingRoom, setCreatingRoom] = useState<string | null>(null);
  const { isConnected, address } = useAppKitAccount();
  const router = useRouter();
  const pathname = usePathname();
  const agentsRefreshTrigger = useAppSelector(selectAgentsRefreshTrigger);
  // const address = "0x8b315372696Ba1aaB397684018f7C33C033187E9";
  const { disconnect } = useDisconnect();
  const dispatch = useAppDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { showWalletDropdown } = useAppSelector((state) => state.ui);

  const handleAgentClick = async (agentId: string) => {
    if (!address) {
      console.error("User address not available");
      return;
    }

    try {
      setCreatingRoom(agentId);

      // Create or get existing chatroom
      const result = await createChatroom({
        agentId,
        userAddress: address,
      });

      if (result.success && result.roomId) {
        // Navigate to the agent page
        router.push(`/agent/${agentId}?roomId=${result.roomId}`);
      } else {
        console.error("Failed to create/get chatroom:", result.error);
        // Still navigate even if room creation failed - let the agent page handle it
        router.push(`/agent/${agentId}`);
      }
    } catch (error) {
      console.error("Error handling agent click:", error);
      // Still navigate even if error occurred
      router.push(`/agent/${agentId}`);
    } finally {
      setCreatingRoom(null);
    }
  };

  const setNodePanel = (item: string) => {
    dispatch(setShowNodesPanel(true));
    dispatch(setActiveNav(item));
  };

  const isStepCompleted = (stepName: string) => {
    return agentBuilderFlow.completedSteps.includes(stepName);
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

  const handleWalletClick = () => {
    // if (!isConnected) {
    //   // If not connected, directly open the connect modal
    //   open();
    // } else {
    // If connected, show the dropdown
    dispatch(toggleWalletDropdown());
    // }
  };

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

  // Sync dropdown state with activeMenu
  useEffect(() => {
    if (activeMenu === "Agents") {
      setAgentsOpen(true);
      setArenaOpen(false);
    } else if (activeMenu === "Arena") {
      setArenaOpen(true);
      setAgentsOpen(false);
    }
  }, [activeMenu]);

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

  return (
    <aside
      className={`absolute    overflow-scroll lg:fixed z-30 p-5 top-1/2 -translate-y-1/2 left-0 lg:left-4 h-[100%] transition-transform duration-300 mt-0 lg:mt-5 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } w-[270px] bg-dark rounded-[20px] text-white flex flex-col`}
    >
      {/* Logo and items */}
      <div className="h-max">
        <div className="flex w-max h-max mb-6  items-center gap-2   relative">
          <Image
            src={"/icons/LogoX.png"}
            className="rounded-full"
            width={20}
            height={20}
            alt="logo"
          />
          <span className="text-2xl text-primary font-light">FRAKTIA</span>
          {/* Minimize/Show icon */}
          <button
            className="ml-2 p-1 hidden lg:flex rounded hover:bg-[#23262F] transition-colors absolute right-[-32px] top-1/2 -translate-y-1/2 z-40"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Minimize sidebar" : "Show sidebar"}
            type="button"
          >
            <svg
              className={`w-6 h-6 text-primary transition-transform duration-200 ${
                sidebarOpen ? "rotate-180" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
      </div>
      {/* Arena Steps */}

      <nav className="flex h-max  border-b-[0.5px] border-[#D9D9D9]/40  flex-col justify-start py-5 relative z-20">
        <div
          className={`flex ${
            activeMenu === "Arena" ? "text-primary" : "text-white"
          }  justify-between  items-center gap-2 w-full mb-4 select-none`}
        >
          <button
            className=" cursor-pointer"
            onClick={() => {
              // Navigate to home if not already there
              if (pathname !== "/") {
                router.push("/");
              }
              dispatch(setActiveMenu("Arena"));
            }}
            aria-expanded={arenaOpen}
          >
            <h6 className={` text-sm font-semibold uppercase flex-1 text-left`}>
              Arena
            </h6>
          </button>
          <svg
            onClick={() => {
              setArenaOpen(!arenaOpen);
              setAgentsOpen(false);
            }}
            className={`transition-transform cursor-pointer duration-200 w-4 h-4 ${
              arenaOpen ? "rotate-90" : "rotate-0"
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
        {arenaOpen && (
          <div className="mt-0 flex flex-col gap-6">
            {navItems.map((item, index) => (
              <button
                key={item.key}
                className={`flex pl-[23px] relative items-center gap-[13px] py-1.5  focus:outline-none group`}
                onClick={() => {
                  setNodePanel(item.key);
                  dispatch(goToStep(index + 1));
                }}
              >
                {/* L-shaped SVG with rightward curve towards the item */}
                {index === 0 ? (
                  <svg
                    className="absolute  left-0 top-[18px] h-max -z-5"
                    width="20"
                    height="65"
                    viewBox="0 0 20 65"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 40 V10 a8 8 0 0 1 8 -8 h4"
                      stroke={
                        isStepCompleted(item.key) ||
                        index <= agentBuilderFlow.currentStep - 1
                          ? "#F8FF99"
                          : "#fff"
                      }
                      strokeWidth="4"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                ) : index === 1 ? (
                  <svg
                    className="absolute left-0 bottom-[18px] h-max -z-10"
                    width="20"
                    height="65" // Reduced from 85
                    viewBox="0 0 20 65" // Reduced from 85
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 0 v50 a8 8 0 0 0 8 8 h4" // Changed v70 to v50
                      stroke={
                        isStepCompleted(item.key) ||
                        index <= agentBuilderFlow.currentStep - 1
                          ? "#F8FF99"
                          : "#fff"
                      }
                      strokeWidth="4"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                ) : (
                  <svg
                    className="absolute  left-0 bottom-[18px] h-max -z-10"
                    width="20"
                    height="85"
                    viewBox="0 0 20 85"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4 0 v75 a8 8 0 0 0 8 8 h4"
                      stroke={
                        isStepCompleted(item.key) ||
                        index <= agentBuilderFlow.currentStep - 1
                          ? "#F8FF99"
                          : "#fff"
                      }
                      strokeWidth="4"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                )}
                <span
                  className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 ${
                    isStepCompleted(item.key)
                      ? "bg-primary border border-[#F8FF99]/30"
                      : activeNav === item.key
                      ? "bg-primary border border-primary"
                      : "bg-[#302C2C]"
                  }`}
                >
                  {item.svg(activeNav === item.key, isStepCompleted(item.key))}
                </span>
                <span
                  className={`text-base cursor-pointer font-light transition-all duration-200 ${
                    isStepCompleted(item.key)
                      ? "text-[#F8FF99]"
                      : activeNav === item.key
                      ? "text-primary"
                      : "text-white"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </nav>
      {/*Agent list */}
      <div className=" h-max pt-5">
        <div
          className={`flex ${
            activeMenu === "Agents" ? "text-primary" : "text-white"
          }  justify-between items-center gap-2 w-full mb-6 select-none`}
        >
          <button
            className="cursor-pointer"
            onClick={() => {
              // Clear editing mode when navigating to Agents
              dispatch(clearEditingMode());
              // Navigate to home if not already there
              if (pathname !== "/") {
                router.push("/");
              }
              dispatch(setActiveMenu("Agents"));
            }}
            aria-expanded={agentsOpen}
          >
            <h6 className={`text-sm font-semibold uppercase flex-1 text-left`}>
              Agents
            </h6>
          </button>
          <svg
            className={`transition-transform cursor-pointer duration-200 w-4 h-4 ${
              agentsOpen ? "rotate-90" : "rotate-0"
            }`}
            onClick={() => {
              setAgentsOpen(!agentsOpen);
              setArenaOpen(false);
            }}
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
        {agentsOpen && (
          <div className="flex flex-col gap-6">
            {loadingAgents ? (
              <div className="flex items-center gap-[13px]">
                <div className="w-6 h-6 rounded-full bg-gray-600 animate-pulse"></div>
                <span className="text-sm font-light text-gray-400">
                  Loading agents...
                </span>
              </div>
            ) : userAgents.length > 0 ? (
              userAgents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => handleAgentClick(agent.id)}
                  disabled={creatingRoom === agent.id}
                  className={`flex items-center gap-[13px] cursor-pointer hover:opacity-80 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-left w-full`}
                >
                  <Image
                    src={agent.avatarUrl}
                    alt={agent.name}
                    className="w-6 h-6 rounded-full object-cover border-2 border-[#23262F] flex-shrink-0"
                    width={24}
                    height={24}
                  />
                  <span className="text-sm font-light text-white truncate">
                    {creatingRoom === agent.id ? "Opening..." : agent.name}
                  </span>
                </button>
              ))
            ) : (
              <div className="flex items-center gap-[13px]">
                <div className="w-6 h-6 rounded-full bg-gray-600 flex items-center justify-center">
                  <svg
                    className="w-3 h-3 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
                <span className="text-sm font-light text-gray-400">
                  No agents deployed yet
                </span>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Footer */}
      <div className="w-max h-max py-5 lg:hidden  gap-6 justify-center flex flex-col-reverse  items-start">
        <a
          href="https://app.uniswap.org/#/swap?exactField=input&inputCurrency=ETH&outputCurrency=0xCDBdD8a173C385d8A3C8CAB7914a99e8c3d9C3a1"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs mb-6 bg-bg p-3 rounded-xl lg:mb-0 hover:bg-primary/10 transition-colors cursor-pointer"
        >
          BUY FRAKTIA
        </a>
        <div className="relative">
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

      {/* Feedback Button */}
      <div className="mt-auto pt-4 border-t border-[#D9D9D9]/20">
        <button
          className="flex items-center gap-2 text-xs text-white/70 hover:text-primary transition-colors px-3 py-2 rounded focus:outline-none w-full"
          onClick={() => dispatch(setShowFeedbackModal(true))}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          Feedback
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
