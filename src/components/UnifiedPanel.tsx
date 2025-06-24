"use client";

import React, { useState, useCallback } from "react";
import { Node } from "@xyflow/react";
import { X, Settings, Plus } from "lucide-react";
import { PropertiesContent } from "./PropertiesContent";
import { NodesContent } from "./NodesContent";

interface UnifiedPanelProps {
  // Properties Panel props
  selectedNode?: Node | null;
  onUpdateNode: (nodeId: string, data: Record<string, unknown>) => void;
  onClose: () => void;

  // Nodes Panel props
  onAddNode?: (nodeType: string, position?: { x: number; y: number }) => void;
  onOpenTemplates?: () => void;
  currentReactFlowNodes?: Array<{ type?: string; data?: { label?: string } }>;
}

type TabType = "config" | "nodes";

export function UnifiedPanel({
  selectedNode,
  onUpdateNode,
  onClose,
  onAddNode,
  onOpenTemplates,
  currentReactFlowNodes,
}: UnifiedPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>("nodes");
  const [isAnimating, setIsAnimating] = useState(false);

  const handleTabChange = useCallback(
    (tab: TabType) => {
      if (tab === activeTab) return;

      setIsAnimating(true);
      setTimeout(() => {
        setActiveTab(tab);
        setIsAnimating(false);
      }, 150);
    },
    [activeTab]
  );

  // Switch to config tab when a node is selected
  //   useEffect(() => {
  //     if (selectedNode) {
  //       handleTabChange("config");
  //     }
  //   }, [selectedNode]);

  const tabs = [
    {
      id: "config" as const,
      label: "Config",
      icon: Settings,
      disabled: !selectedNode,
    },
    {
      id: "nodes" as const,
      label: "Nodes",
      icon: Plus,
      disabled: false,
    },
  ];

  return (
    <aside
      className="h-full w-full relative rounded-tl-[0px] max-w-md mx-auto flex flex-col bg-dark shadow-xl  border border-dark/60 overflow-hidden transition-all duration-300 md:max-w-sm lg:max-w-md"
      aria-label="Unified Panel"
    >
      {/* Header with Tabs */}
      <header className="flex flex-col bg-dark border-b border-primary/60">
        {/* Close button and title
        <div className="flex items-center justify-between px-5 py-3">
          <h2 className="text-lg font-bold text-white tracking-wide uppercase">
            {activeTab === "config" ? "Configuration" : "Add Nodes"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="text-gray-400 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div> */}

        {/* Tab Navigation */}
        <div className="flex bg-dark/50">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                disabled={tab.disabled}
                className={`
                  flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200
                  ${
                    activeTab === tab.id
                      ? "bg-primary/20 text-primary border-b-2 border-primary"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }
                  ${
                    tab.disabled
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
          <button
            onClick={onClose}
            aria-label="Close panel"
            className="w-8 flex items-center justify-center py-3 text-gray-400 hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Content Area with Animation */}
      <div className="flex-1 relative overflow-hidden">
        <div
          className={`
            absolute inset-0 transition-all duration-300 ease-in-out
            ${
              isAnimating
                ? "opacity-0 transform translate-x-4"
                : "opacity-100 transform translate-x-0"
            }
          `}
        >
          {activeTab === "config" && selectedNode ? (
            <div className="h-full">
              <PropertiesContent
                node={selectedNode}
                onUpdateNode={onUpdateNode}
              />
            </div>
          ) : activeTab === "nodes" ? (
            <div className="h-full">
              <NodesContent
                onAddNode={onAddNode}
                onOpenTemplates={onOpenTemplates}
                currentReactFlowNodes={currentReactFlowNodes}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No Node Selected</p>
                <p className="text-sm">
                  Select a node to configure its properties
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
