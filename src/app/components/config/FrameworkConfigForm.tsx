import React from "react";

interface FrameworkConfigFormProps {
  localNodeData: any;
  handleInputChange: (field: string, value: any) => void;
}

const FrameworkConfigForm: React.FC<FrameworkConfigFormProps> = ({
  localNodeData,
  handleInputChange,
}) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
        Framework
      </label>
      <select
        value={String(localNodeData.framework || "elizaos")}
        onChange={(e) => handleInputChange("framework", e.target.value)}
        className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
      >
        <option value="elizaos">ElizaOS</option>
        <option value="autogen">AutoGen</option>
        <option value="crewai">CrewAI</option>
        <option value="langchain">LangChain</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
        Character Name
      </label>
      <input
        type="text"
        value={String(localNodeData.characterName || "")}
        onChange={(e) => handleInputChange("characterName", e.target.value)}
        placeholder="Enter agent name..."
        className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
      />
    </div>
    <div>
      <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
        Personality
      </label>
      <textarea
        value={String(localNodeData.personality || "")}
        onChange={(e) => handleInputChange("personality", e.target.value)}
        placeholder="Describe the agent's personality..."
        rows={3}
        className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 resize-none"
      />
    </div>
  </div>
);

export default FrameworkConfigForm;
