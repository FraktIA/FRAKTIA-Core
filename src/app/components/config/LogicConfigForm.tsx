import React from "react";

interface LogicConfigFormProps {
  localNodeData: any;
  handleInputChange: (field: string, value: any) => void;
}

const LogicConfigForm: React.FC<LogicConfigFormProps> = ({
  localNodeData,
  handleInputChange,
}) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
        Logic Type
      </label>
      <select
        value={String(localNodeData.condition || "if")}
        onChange={(e) => handleInputChange("condition", e.target.value)}
        className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
      >
        <option value="if">If/Then</option>
        <option value="switch">Switch/Case</option>
        <option value="loop">Loop</option>
        <option value="filter">Filter</option>
        <option value="transform">Transform</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
        Condition
      </label>
      <textarea
        value={String(localNodeData.expression || "")}
        onChange={(e) => handleInputChange("expression", e.target.value)}
        placeholder="Enter condition logic..."
        rows={3}
        className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 resize-none font-mono text-sm"
      />
    </div>
  </div>
);

export default LogicConfigForm;
