import React from "react";

interface IntegrationConfigFormProps {
  localNodeData: any;
  handleInputChange: (field: string, value: any) => void;
}

const IntegrationConfigForm: React.FC<IntegrationConfigFormProps> = ({
  localNodeData,
  handleInputChange,
}) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
        Service
      </label>
      <select
        value={String(localNodeData.service || "twitter")}
        onChange={(e) => handleInputChange("service", e.target.value)}
        className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
      >
        <option value="twitter">Twitter/X</option>
        <option value="discord">Discord</option>
        <option value="telegram">Telegram</option>
        <option value="slack">Slack</option>
        <option value="blockchain">Blockchain</option>
        <option value="webhook">Webhook</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
        API Key/Token
        <span className="text-primary ml-1">*</span>
      </label>
      <input
        type="password"
        value={String(localNodeData.apiKey || "")}
        onChange={(e) => handleInputChange("apiKey", e.target.value)}
        placeholder="Enter API key or token..."
        className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
      />
    </div>
    <div>
      <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
        Endpoint URL
      </label>
      <input
        type="url"
        value={String(localNodeData.endpoint || "")}
        onChange={(e) => handleInputChange("endpoint", e.target.value)}
        placeholder="https://api.example.com"
        className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
      />
    </div>
  </div>
);

export default IntegrationConfigForm;
