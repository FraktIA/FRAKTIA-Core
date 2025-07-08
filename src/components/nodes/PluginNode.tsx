"use client";

import React from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Puzzle, CheckCircle, AlertCircle } from "lucide-react";
import { PluginNodeData, IndividualPluginConfig } from "@/types/nodeData";

export function PluginNode({
  data,
  selected,
}: NodeProps & { data: PluginNodeData }) {
  // Get plugins array or fall back to legacy single plugin mode
  const plugins = data.plugins || [];
  const legacyService = (data.service as string) || (data.label as string);

  // In multi-plugin mode, show count and services, otherwise show legacy service
  const displayName =
    plugins.length > 0
      ? `${plugins.length} Plugin${plugins.length > 1 ? "s" : ""}`
      : legacyService || "Plugin";

  // Get plugin service icon based on the services
  const getPluginIcon = (
    plugins: IndividualPluginConfig[],
    legacyService?: string
  ) => {
    if (plugins.length > 0) {
      // Multi-plugin mode - show count or mixed icon
      if (plugins.length > 1) return "🔌";

      const service = plugins[0].service;
      if (service === "twitter") return "🐦";
      if (service === "discord") return "💬";
      return "🔌";
    }

    // Legacy single plugin mode
    const name = legacyService || "";
    if (name.includes("Web Scraper")) return "🕷️";
    if (name.includes("Database")) return "🗄️";
    if (name.includes("API Gateway")) return "🚪";
    if (name.includes("Analytics")) return "📊";
    if (name.includes("Twitter")) return "🐦";
    if (name.includes("Discord")) return "💬";
    if (name.includes("Telegram")) return "📱";
    if (name.includes("Blockchain")) return "⛓️";
    return "🔌";
  };

  // Check if plugins are configured
  const isConfigured = () => {
    if (plugins.length > 0) {
      return plugins.every((plugin) => {
        if (plugin.service === "twitter") {
          return !!(
            plugin.twitterApiKey &&
            plugin.twitterApiSecretKey &&
            plugin.twitterAccessToken &&
            plugin.twitterAccessTokenSecret
          );
        } else if (plugin.service === "discord") {
          return !!(plugin.discordApplicationId && plugin.discordApiToken);
        }
        return plugin.configured || false;
      });
    }

    // Legacy mode
    return data.configured || false;
  };

  const configured = isConfigured();

  // Get service names for display
  const getServicesList = () => {
    if (plugins.length > 0) {
      return plugins.map((p) => p.service?.toUpperCase()).join(", ");
    }
    return legacyService?.toUpperCase() || "PLUGIN";
  };

  return (
    <div
      className={`relative bg-black border-2 ${
        selected ? "border-lime-400 shadow-glow" : "border-gray-800"
      } rounded-lg transition-all duration-300 hover:border-lime-400/50`}
    >
      <div className="p-4 w-[240px] h-[220px] 5xl:w-[280px] 5xl:h-[260px]">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-lime-400 rounded-lg flex items-center justify-center">
              <Puzzle className="w-4 h-4 text-black" />
            </div>
            <span className="text-lg">
              {getPluginIcon(plugins, legacyService)}
            </span>
          </div>
          {configured ? (
            <CheckCircle className="w-5 h-5 text-lime-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-yellow-400" />
          )}
        </div>

        {/* Title */}
        <h3 className="text-white font-bold text-sm mb-1 tracking-wide">
          {displayName}
        </h3>
        <p className="text-gray-400 text-xs mb-3 font-mono">
          PLUGIN SERVICE • INTEGRATION
        </p>

        {/* Plugin Details */}
        <div className="mb-3 p-2 bg-gray-900 rounded-lg border border-gray-800">
          <div className="text-lime-400 text-xs font-bold tracking-wide uppercase mb-1">
            {getServicesList()}
          </div>

          {/* Show plugin count and details */}
          {plugins.length > 0 ? (
            <div className="space-y-1">
              {plugins.length > 1 && (
                <div className="text-gray-400 text-xs">
                  {plugins.length} services configured
                </div>
              )}
              {plugins.length === 1 && plugins[0].endpoint && (
                <div className="text-gray-400 text-xs">
                  {`Endpoint: ${plugins[0].endpoint.substring(0, 20)}...`}
                </div>
              )}
            </div>
          ) : (
            <div className="text-gray-400 text-xs">
              {data.endpoint
                ? `Endpoint: ${data.endpoint.substring(0, 20)}...`
                : "No endpoint configured"}
            </div>
          )}
        </div>

        {/* Status */}
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              configured ? "bg-lime-400" : "bg-yellow-400"
            }`}
          ></div>
          <span className="text-xs text-gray-300 font-medium tracking-wide">
            {configured ? "CONNECTED" : "SETUP REQUIRED"}
          </span>
        </div>

        {/* Handles */}
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-lime-400 border-2 border-black"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-lime-400 border-2 border-black"
        />
      </div>
    </div>
  );
}
