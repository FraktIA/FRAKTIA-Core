import React from "react";
import { Trash2, X } from "lucide-react";

interface CharacterConfigFormProps {
  localNodeData: any;
  handleInputChange: (field: string, value: any) => void;
  handleArrayInputChange: (field: string, value: string, index: number) => void;
  addArrayItem: (field: string) => void;
  removeArrayItem: (field: string, index: number) => void;
  characterConfigs: any;
  onUpdateNode: (nodeId: string, data: any) => void;
  nodeId: string;
  setLocalNodeData: (data: any) => void;
}

const CharacterConfigForm: React.FC<CharacterConfigFormProps> = ({
  localNodeData,
  handleInputChange,
  handleArrayInputChange,
  addArrayItem,
  removeArrayItem,
  characterConfigs,
  onUpdateNode,
  nodeId,
  setLocalNodeData,
}) => {
  const availableCharacters = Object.keys(characterConfigs);

  return (
    <div className="space-y-4">
      {/* Character Selection */}
      <div>
        <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
          Character Template
        </label>
        <select
          value={localNodeData.characterId || ""}
          onChange={(e) => {
            const characterId = e.target.value;
            const character = characterConfigs[characterId];
            if (character) {
              const updatedData = {
                ...localNodeData,
                characterId,
                characterName: character.name,
                customPersonality: character.system,
                customBio: character.bio,
                customAdjectives: character.adjectives,
                customTopics: character.topics,
                plugins: {
                  enabled: character.plugins || [],
                  disabled: [],
                  customConfig: {},
                },
              };
              setLocalNodeData(updatedData);
              onUpdateNode(nodeId, updatedData);
            }
          }}
          className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
        >
          <option value="">Select a character template...</option>
          {availableCharacters.map((charId) => (
            <option key={charId} value={charId}>
              {characterConfigs[charId].name}
            </option>
          ))}
        </select>
      </div>

      {/* Character Name */}
      <div>
        <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
          Character Name
        </label>
        <input
          type="text"
          value={localNodeData.characterName || ""}
          onChange={(e) => handleInputChange("characterName", e.target.value)}
          placeholder="Enter character name..."
          className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300"
        />
      </div>

      {/* Personality */}
      <div>
        <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
          Personality
        </label>
        <textarea
          value={localNodeData.customPersonality || ""}
          onChange={(e) =>
            handleInputChange("customPersonality", e.target.value)
          }
          placeholder="Describe the character's personality..."
          rows={4}
          className="w-full p-3 bg-dark border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 resize-none"
        />
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
          Bio
        </label>
        {(localNodeData.customBio || []).map((bio: string, index: number) => (
          <div key={index} className="flex gap-2 mb-2">
            <textarea
              value={bio}
              onChange={(e) =>
                handleArrayInputChange("customBio", e.target.value, index)
              }
              placeholder="Enter bio line..."
              rows={2}
              className="flex-1 p-3 bg-dark border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 resize-none"
            />
            <button
              onClick={() => removeArrayItem("customBio", index)}
              className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
        <button
          onClick={() => addArrayItem("customBio")}
          className="w-full p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
        >
          + Add Bio Line
        </button>
      </div>

      {/* Adjectives */}
      <div>
        <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
          Adjectives
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {(localNodeData.customAdjectives || []).map(
            (adj: string, index: number) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-gray-700 rounded-full px-3 py-1"
              >
                <input
                  value={adj}
                  onChange={(e) =>
                    handleArrayInputChange(
                      "customAdjectives",
                      e.target.value,
                      index
                    )
                  }
                  placeholder="adjective"
                  className="bg-transparent text-white text-sm focus:outline-none min-w-[80px]"
                />
                <button
                  onClick={() => removeArrayItem("customAdjectives", index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X size={14} />
                </button>
              </div>
            )
          )}
        </div>
        <button
          onClick={() => addArrayItem("customAdjectives")}
          className="w-full p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
        >
          + Add Adjective
        </button>
      </div>

      {/* Topics */}
      <div>
        <label className="block text-sm font-bold text-gray-300 mb-2 tracking-wide uppercase">
          Topics
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {(localNodeData.customTopics || []).map(
            (topic: string, index: number) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-gray-700 rounded-full px-3 py-1"
              >
                <input
                  value={topic}
                  onChange={(e) =>
                    handleArrayInputChange(
                      "customTopics",
                      e.target.value,
                      index
                    )
                  }
                  placeholder="topic"
                  className="bg-transparent text-white text-sm focus:outline-none min-w-[80px]"
                />
                <button
                  onClick={() => removeArrayItem("customTopics", index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <X size={14} />
                </button>
              </div>
            )
          )}
        </div>
        <button
          onClick={() => addArrayItem("customTopics")}
          className="w-full p-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors"
        >
          + Add Topic
        </button>
      </div>
    </div>
  );
};

export default CharacterConfigForm;
