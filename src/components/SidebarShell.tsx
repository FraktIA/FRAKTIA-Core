"use client";
import { useState } from "react";
import NodePanel from "@/components/NodePanel";

export default function SidebarShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="relative flex gap-5 py-5 px-5">
      <NodePanel sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      {/* Floating button to show sidebar when hidden */}
      {!sidebarOpen && (
        <button
          className="fixed z-20 left-2 top-6 bg-dark border border-[#23262F] rounded-full p-2 shadow-lg hover:bg-[#23262F] transition-colors"
          onClick={() => setSidebarOpen(true)}
          aria-label="Show sidebar"
          type="button"
        >
          <svg
            className="w-6 h-6 text-primary"
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
      )}
      {/* Main content grows/shrinks with sidebar */}
      <main
        className={`flex-1  text-white transition-all duration-300 ${
          sidebarOpen ? "ml-[270px]" : "ml-0"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
