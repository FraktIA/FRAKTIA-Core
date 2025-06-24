import React from "react";

interface OutputConfigFormProps {
  localNodeData: any;
  handleInputChange: (field: string, value: any) => void;
}

const OutputConfigForm: React.FC<OutputConfigFormProps> = ({
  localNodeData,
  handleInputChange,
}) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
        Output Type
      </label>
      <select
        value={String(localNodeData.type || "text")}
        onChange={(e) => handleInputChange("type", e.target.value)}
        className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
      >
        <option value="text">Text</option>
        <option value="action">Action</option>
        <option value="webhook">Webhook</option>
        <option value="file">File</option>
        <option value="email">Email</option>
        <option value="notification">Notification</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
        Format Template
      </label>
      <textarea
        value={String(localNodeData.template || "")}
        onChange={(e) => handleInputChange("template", e.target.value)}
        placeholder="Output format template..."
        rows={3}
        className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 resize-none font-mono text-sm"
      />
    </div>
  </div>
);

export default OutputConfigForm;
