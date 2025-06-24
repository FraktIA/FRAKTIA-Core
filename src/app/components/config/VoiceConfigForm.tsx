import React from "react";

interface VoiceConfigFormProps {
  localNodeData: any;
  handleInputChange: (field: string, value: any) => void;
}

const VoiceConfigForm: React.FC<VoiceConfigFormProps> = ({
  localNodeData,
  handleInputChange,
}) => (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
        Voice Model
      </label>
      <select
        value={String(localNodeData.voice || "alloy")}
        onChange={(e) => handleInputChange("voice", e.target.value)}
        className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
      >
        <option value="alloy">Alloy</option>
        <option value="echo">Echo</option>
        <option value="fable">Fable</option>
        <option value="onyx">Onyx</option>
        <option value="nova">Nova</option>
        <option value="shimmer">Shimmer</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
        Language
      </label>
      <select
        value={String(localNodeData.language || "en")}
        onChange={(e) => handleInputChange("language", e.target.value)}
        className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
      >
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="de">German</option>
        <option value="it">Italian</option>
        <option value="pt">Portuguese</option>
        <option value="zh">Chinese</option>
        <option value="ja">Japanese</option>
      </select>
    </div>
  </div>
);

export default VoiceConfigForm;
