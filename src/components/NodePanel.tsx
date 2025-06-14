"use client";

import Image from "next/image";
import { useState } from "react";

type NodePanelProps = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

const NodePanel = ({ sidebarOpen, setSidebarOpen }: NodePanelProps) => {
  const [activeNav, setActiveNav] = useState("Framework");
  const [componentsOpen, setComponentsOpen] = useState(true);
  const [agentsOpen, setAgentsOpen] = useState(true);
  const navItems = [
    {
      key: "Framework",
      label: "Framework",
      svg: (active: boolean) => (
        <svg
          width="24"
          height="24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 4h2c1.414 0 2.121 0 2.56.44C19 4.878 19 5.585 19 7m-9-3H8c-1.414 0-2.121 0-2.56.44C5 4.878 5 5.585 5 7m5 13H8c-1.414 0-2.121 0-2.56-.44C5 19.122 5 18.415 5 17m9 3h2c1.414 0 2.121 0 2.56-.44.44-.439.44-1.146.44-2.56m-9-5h4M13 2h-2a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1V3a1 1 0 00-1-1zm0 16h-2a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 00-1-1zm8-5v-2a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1zM7 13v-2a1 1 0 00-1-1H4a1 1 0 00-1 1v2a1 1 0 001 1h2a1 1 0 001-1z"
            stroke={active ? "#F8FF99" : "#fff"}
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
      svg: (active: boolean) => (
        <svg
          width="24"
          height="24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7 4.5a3 3 0 00-2.567 4.554 3.001 3.001 0 000 5.893M7 4.5a2.5 2.5 0 115 0m-5 0c0 .818.393 1.544 1 2m-3.567 8.447A3 3 0 007 19.5a2.5 2.5 0 005 0m-7.567-4.553A3 3 0 016 13.67m6-9.17v15m0-15a2.5 2.5 0 015 0 3 3 0 012.567 4.554M12 19.5a2.5 2.5 0 005 0m0 0a3 3 0 002.567-4.553 3.002 3.002 0 000-5.893M17 19.5c0-.818-.393-1.544-1-2m3.567-8.446A3 3 0 0118 10.329"
            stroke={active ? "#F8FF99" : "#fff"}
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
      svg: (active: boolean) => (
        <svg
          width="24"
          height="24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 10v1a6 6 0 006 6m6-7v1a6 6 0 01-6 6m0 0v4m0 0h4m-4 0H8m4-7a3 3 0 01-3-3V6a3 3 0 116 0v5a3 3 0 01-3 3z"
            stroke={active ? "#F8FF99" : "#fff"}
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
      svg: (active: boolean) => (
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
            fill={active ? "#F8FF99" : "#fff"}
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM3 12c0 2.09.713 4.014 1.908 5.542A8.99 8.99 0 0112.065 14a8.98 8.98 0 017.092 3.458A9.001 9.001 0 103 12zm9 9a8.96 8.96 0 01-5.672-2.012A6.99 6.99 0 0112.065 16a6.99 6.99 0 015.689 2.92A8.96 8.96 0 0112 21z"
            fill={active ? "#F8FF99" : "#fff"}
          />
        </svg>
      ),
    },
    {
      key: "Add-ons",
      label: "Add-ons",
      svg: (active: boolean) => (
        <svg
          width="24"
          height="24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.116 8.5h7.769v-1h-7.77l.001 1zm0 4h4.769v-1h-4.77l.001 1zm10.384 7v-3h-3v-1h3v-3h1v3h3v1h-3v3h-1zm-14-.711V5.115c0-.445.158-.825.475-1.141a1.56 1.56 0 011.14-.475h11.77c.444 0 .824.158 1.14.475.316.317.474.697.475 1.14v4.902a9.297 9.297 0 00-.385-.014 24.579 24.579 0 00-.384-.003c-1.593 0-2.947.557-4.06 1.672-1.113 1.115-1.67 2.468-1.671 4.059l.003.385c.002.128.007.256.014.384H5.79l-2.29 2.29z"
            fill={active ? "#F8FF99" : "#fff"}
          />
        </svg>
      ),
    },
  ];
  return (
    <aside
      className={`fixed z-30 top-0 left-4 my-5 h-[97%] transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } w-[270px] bg-dark rounded-[20px] text-white flex flex-col`}
    >
      {/* Top: Logo and navigation */}
      <div className="h-[65%]">
        <div className="flex w-max h-max items-center gap-2 px-6 py-5 relative">
          <span className="w-5 h-5 bg-primary rounded-full"></span>
          <span className="text-2xl text-primary font-light">FRAKTIA</span>
          {/* Minimize/Show icon */}
          <button
            className="ml-2 p-1 rounded hover:bg-[#23262F] transition-colors absolute right-[-32px] top-1/2 -translate-y-1/2 z-40"
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
        <nav className="flex h-[85%] border-b-[0.5px] pb-11 border-[#D9D9D9]/40  flex-col gap-4 px-6 mt-2.5 relative z-20">
          <div className="mt-8">
            <button
              className="flex hover:cursor-pointer items-center gap-2 w-full mb-6 select-none"
              onClick={() => setComponentsOpen((v) => !v)}
              aria-expanded={componentsOpen}
            >
              <h6 className="text-white text-sm font-semibold uppercase flex-1 text-left">
                Components
              </h6>
              <svg
                className={`transition-transform duration-200 w-4 h-4 ${
                  componentsOpen ? "rotate-90" : "rotate-0"
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
            </button>
            {componentsOpen && (
              <div className="mt-0 flex flex-col gap-6">
                {navItems.map((item, index) => (
                  <button
                    key={item.key}
                    className={`flex pl-[23px] relative items-center gap-[13px] py-1.5  focus:outline-none group`}
                    onClick={() => setActiveNav(item.key)}
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
                            index <=
                            navItems.findIndex((nav) => nav.key === activeNav)
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
                            index <=
                            navItems.findIndex((nav) => nav.key === activeNav)
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
                            index <=
                            navItems.findIndex((nav) => nav.key === activeNav)
                              ? "#F8FF99"
                              : "#fff"
                          }
                          strokeWidth="4"
                          strokeLinecap="round"
                          fill="none"
                        />
                      </svg>
                    )}
                    <span className="w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-200 bg-[#302C2C]">
                      {item.svg(activeNav === item.key)}
                    </span>
                    <span
                      className={`text-base cursor-pointer font-light transition-all duration-200 ${
                        activeNav === item.key ? "text-primary" : "text-white"
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>
      </div>
      {/* Bottom: Agent list */}
      <div className="px-6 mt-12 pb-8">
        <button
          className="flex hover:cursor-pointer items-center gap-2 w-full mb-6 select-none"
          onClick={() => setAgentsOpen((v) => !v)}
          aria-expanded={agentsOpen}
        >
          <h6 className="text-white text-sm font-semibold uppercase flex-1 text-left">
            Your Agents
          </h6>
          <svg
            className={`transition-transform duration-200 w-4 h-4 ${
              agentsOpen ? "rotate-90" : "rotate-0"
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
        </button>
        {agentsOpen && (
          <div className="flex flex-col gap-6">
            {[
              {
                name: "Claudia AI",
                img: "https://randomuser.me/api/portraits/women/41.jpg",
              },
              {
                name: "Javanu",
                img: "https://randomuser.me/api/portraits/men/32.jpg",
              },
              {
                name: "Zeffyr NU",
                img: "https://randomuser.me/api/portraits/men/65.jpg",
              },
            ].map((agent) => (
              <div key={agent.name} className="flex items-center gap-[13px]">
                <Image
                  src={agent.img}
                  alt={agent.name}
                  className="w-6 h-6 rounded-full object-cover border-2 border-[#23262F]"
                  width={24}
                  height={24}
                />
                <span className="text-sm font-light text-white">
                  {agent.name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default NodePanel;
