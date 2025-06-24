import React, { useState, useCallback } from "react";
import {
  X,
  XCircle,
  ChevronDown,
  ChevronUp,
  User,
  MessageSquare,
  FileText,
  Hash,
  Sparkles,
} from "lucide-react";
import characterConfigs from "@/constants/characters";
import {
  MessageExample,
  ConversationExample,
  CharacterNodeData,
} from "@/types/nodeData";

interface CharacterConfigFormProps {
  localNodeData: CharacterNodeData;
  handleInputChange: (
    field: string,
    value: string | number | boolean | object
  ) => void;
  handleArrayInputChange: (field: string, value: string, index: number) => void;
  addArrayItem: (field: string) => void;
  removeArrayItem: (field: string, index: number) => void;
  onUpdateNode: (nodeId: string, data: Record<string, unknown>) => void;
  nodeId: string;
  setLocalNodeData: (data: Record<string, unknown>) => void;
}

const CharacterConfigForm: React.FC<CharacterConfigFormProps> = ({
  localNodeData,
  handleInputChange,
  handleArrayInputChange,
  addArrayItem,
  removeArrayItem,
  onUpdateNode,
  nodeId,
  setLocalNodeData,
}) => {
  const availableCharacters = Object.keys(characterConfigs);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    bio: false,
    examples: false,
    traits: false,
    style: false,
  });

  const toggleSection = useCallback((section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section as keyof typeof prev]: !prev[section as keyof typeof prev],
    }));
  }, []);

  const SectionHeader = useCallback(
    ({
      title,
      icon: Icon,
      section,
      count,
    }: {
      title: string;
      icon: React.ComponentType<{ size?: number; className?: string }>;
      section: string;
      count?: number;
    }) => (
      <div
        className="flex items-center justify-between cursor-pointer group"
        onClick={() => toggleSection(section)}
      >
        <div className="flex items-center gap-2">
          <Icon size={16} className="text-primary" />
          <h3 className="text-sm font-semibold text-white tracking-wide">
            {title}
          </h3>
          {count !== undefined && (
            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
              {count}
            </span>
          )}
        </div>
        {expandedSections[section as keyof typeof expandedSections] ? (
          <ChevronUp
            size={16}
            className="text-white/50 group-hover:text-white/70 transition-colors"
          />
        ) : (
          <ChevronDown
            size={16}
            className="text-white/50 group-hover:text-white/70 transition-colors"
          />
        )}
      </div>
    ),
    [expandedSections, toggleSection]
  );

  const handleStyleArrayChange = useCallback(
    (styleType: "all" | "chat" | "post", value: string, index: number) => {
      const currentStyle = localNodeData.style || {
        all: [],
        chat: [],
        post: [],
      };
      const updatedStyleArray = [...(currentStyle[styleType] || [])];
      updatedStyleArray[index] = value;

      const updatedStyle = {
        ...currentStyle,
        [styleType]: updatedStyleArray,
      };

      handleInputChange("style", updatedStyle);
    },
    [localNodeData.style, handleInputChange]
  );

  const addStyleArrayItem = useCallback(
    (styleType: "all" | "chat" | "post") => {
      const currentStyle = localNodeData.style || {
        all: [],
        chat: [],
        post: [],
      };
      const updatedStyle = {
        ...currentStyle,
        [styleType]: [...(currentStyle[styleType] || []), ""],
      };

      handleInputChange("style", updatedStyle);
    },
    [localNodeData.style, handleInputChange]
  );

  const removeStyleArrayItem = useCallback(
    (styleType: "all" | "chat" | "post", index: number) => {
      const currentStyle = localNodeData.style || {
        all: [],
        chat: [],
        post: [],
      };
      const updatedStyleArray = (currentStyle[styleType] || []).filter(
        (_: unknown, i: number) => i !== index
      );

      const updatedStyle = {
        ...currentStyle,
        [styleType]: updatedStyleArray,
      };

      handleInputChange("style", updatedStyle);
    },
    [localNodeData.style, handleInputChange]
  );

  const handleMessageExampleChange = useCallback(
    (
      exampleIndex: number,
      messageIndex: number,
      field: string,
      value: string
    ) => {
      const currentExamples = localNodeData.messageExamples || [];
      const updatedExamples = [...currentExamples];

      if (!updatedExamples[exampleIndex]) {
        updatedExamples[exampleIndex] = [];
      }
      if (!updatedExamples[exampleIndex][messageIndex]) {
        updatedExamples[exampleIndex][messageIndex] = {
          name: "",
          content: { text: "" },
        };
      }

      if (field === "name") {
        updatedExamples[exampleIndex][messageIndex].name = value;
      } else if (field === "text") {
        updatedExamples[exampleIndex][messageIndex].content.text = value;
      }

      handleInputChange("messageExamples", updatedExamples);
    },
    [localNodeData.messageExamples, handleInputChange]
  );

  const addMessageExample = useCallback(() => {
    const currentExamples = localNodeData.messageExamples || [];
    const newExample = [
      { name: "User", content: { text: "" } },
      {
        name: localNodeData.characterName || "Character",
        content: { text: "" },
      },
    ];
    handleInputChange("messageExamples", [...currentExamples, newExample]);
  }, [
    localNodeData.messageExamples,
    localNodeData.characterName,
    handleInputChange,
  ]);

  const removeMessageExample = useCallback(
    (exampleIndex: number) => {
      const currentExamples = localNodeData.messageExamples || [];
      const updatedExamples = currentExamples.filter(
        (_: unknown, i: number) => i !== exampleIndex
      );
      handleInputChange("messageExamples", updatedExamples);
    },
    [localNodeData.messageExamples, handleInputChange]
  );

  const addMessageToExample = useCallback(
    (exampleIndex: number) => {
      const currentExamples = localNodeData.messageExamples || [];
      const updatedExamples = [...currentExamples];

      if (!updatedExamples[exampleIndex]) {
        updatedExamples[exampleIndex] = [];
      }

      updatedExamples[exampleIndex].push({
        name: localNodeData.characterName || "Character",
        content: { text: "" },
      });

      handleInputChange("messageExamples", updatedExamples);
    },
    [
      localNodeData.messageExamples,
      localNodeData.characterName,
      handleInputChange,
    ]
  );

  const removeMessageFromExample = useCallback(
    (exampleIndex: number, messageIndex: number) => {
      const currentExamples = localNodeData.messageExamples || [];
      const updatedExamples = [...currentExamples];

      if (updatedExamples[exampleIndex]) {
        updatedExamples[exampleIndex] = updatedExamples[exampleIndex].filter(
          (_: unknown, i: number) => i !== messageIndex
        );
      }

      handleInputChange("messageExamples", updatedExamples);
    },
    [localNodeData.messageExamples, handleInputChange]
  );

  return (
    <div className="space-y-6 py-5 px-3 bg-dark rounded-xl  relative max-h-[80vh] overflow-y-auto">
      {/* Character Template Selection */}
      <div className="pb-4 border-b border-white/10">
        <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
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
                name: character.name,
                system: character.system,
                bio: character.bio,
                messageExamples: character.messageExamples,
                postExamples: character.postExamples,
                adjectives: character.adjectives,
                topics: character.topics,
                style: character.style,
              };
              setLocalNodeData(updatedData);
              onUpdateNode(nodeId, updatedData);
            }
          }}
          className="w-full p-3 bg-bg border border-bg rounded-sm text-white focus:outline-none focus:ring-[0.5px] focus:ring-primary text-sm transition-all duration-300"
        >
          <option value="">Select a character template...</option>
          {availableCharacters.map((charId) => (
            <option key={charId} value={charId}>
              {characterConfigs[charId].name}
            </option>
          ))}
        </select>
      </div>

      {/* Basic Information */}
      <div className="space-y-4">
        <SectionHeader title="Basic Information" icon={User} section="basic" />

        {expandedSections.basic && (
          <div className="space-y-4 pl-6">
            {/* Character Name */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                Name
              </label>
              <input
                type="text"
                value={localNodeData.characterName || ""}
                onChange={(e) =>
                  handleInputChange("characterName", e.target.value)
                }
                placeholder="Enter character name..."
                className="w-full p-3 bg-bg border border-bg rounded-sm text-white placeholder-gray-500 focus:outline-none focus:ring-[0.5px] focus:ring-primary transition-all duration-300 text-sm"
              />
            </div>

            {/* System Prompt */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                System Prompt
              </label>
              <textarea
                value={localNodeData.system || ""}
                onChange={(e) => handleInputChange("system", e.target.value)}
                placeholder="Describe the character's role and personality..."
                rows={4}
                className="w-full p-3 bg-bg border border-bg rounded-sm text-white placeholder-gray-500 focus:outline-none focus:ring-[0.5px] focus:ring-primary transition-all duration-300 resize-none text-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* Bio Section */}
      <div className="space-y-4">
        <SectionHeader
          title="Biography"
          icon={FileText}
          section="bio"
          count={localNodeData.bio?.length || 0}
        />

        {expandedSections.bio && (
          <div className="space-y-3 pl-6">
            {(localNodeData.bio || []).map((bioItem: string, index: number) => (
              <div key={index} className="relative">
                <textarea
                  value={bioItem}
                  onChange={(e) =>
                    handleArrayInputChange("bio", e.target.value, index)
                  }
                  placeholder="Enter biography details..."
                  rows={2}
                  className="w-full p-3 pr-10 bg-bg border border-bg rounded-sm text-white placeholder-gray-500 focus:outline-none focus:ring-[0.5px] focus:ring-primary transition-all duration-300 resize-none text-xs"
                />
                <button
                  onClick={() => removeArrayItem("bio", index)}
                  className="absolute top-1/2 -translate-y-1/2 right-2 text-red-400 hover:text-red-500 transition-colors"
                >
                  <XCircle size={16} />
                </button>
              </div>
            ))}
            <button
              onClick={() => addArrayItem("bio")}
              className="w-full p-2 bg-primary/20 text-primary rounded-sm hover:bg-primary/30 transition-colors text-sm font-medium"
            >
              + Add Bio Entry
            </button>
          </div>
        )}
      </div>

      {/* Message Examples */}
      <div className="space-y-4">
        <SectionHeader
          title="Message Examples"
          icon={MessageSquare}
          section="examples"
          count={localNodeData.messageExamples?.length || 0}
        />

        {expandedSections.examples && (
          <div className="space-y-4 pl-6">
            {(localNodeData.messageExamples || []).map(
              (example: ConversationExample, exampleIndex: number) => (
                <div
                  key={exampleIndex}
                  className="bg-bg/50 rounded-lg p-4 space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium text-white/80">
                      Conversation {exampleIndex + 1}
                    </h4>
                    <button
                      onClick={() => removeMessageExample(exampleIndex)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {example.map(
                    (message: MessageExample, messageIndex: number) => (
                      <div
                        key={messageIndex}
                        className="bg-bg rounded-sm p-3 space-y-2"
                      >
                        <div className="flex gap-2 items-center">
                          <select
                            value={message.name || ""}
                            onChange={(e) =>
                              handleMessageExampleChange(
                                exampleIndex,
                                messageIndex,
                                "name",
                                e.target.value
                              )
                            }
                            className="flex-1 p-2 bg-dark border border-dark rounded text-white focus:outline-none focus:ring-[0.5px] focus:ring-primary text-xs"
                          >
                            <option value="">Select speaker...</option>
                            <option value="User">User</option>
                            <option
                              value={localNodeData.characterName || "Character"}
                            >
                              {localNodeData.characterName || "Character"}
                            </option>
                          </select>
                          <button
                            onClick={() =>
                              removeMessageFromExample(
                                exampleIndex,
                                messageIndex
                              )
                            }
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <textarea
                          value={message.content?.text || ""}
                          onChange={(e) =>
                            handleMessageExampleChange(
                              exampleIndex,
                              messageIndex,
                              "text",
                              e.target.value
                            )
                          }
                          placeholder="Message content..."
                          rows={2}
                          className="w-full p-2 bg-dark border border-dark rounded text-white placeholder-gray-500 focus:outline-none focus:ring-[0.5px] focus:ring-primary resize-none text-xs"
                        />
                      </div>
                    )
                  )}

                  <button
                    onClick={() => addMessageToExample(exampleIndex)}
                    className="w-full p-2 bg-gray-700/50 text-gray-300 rounded text-xs hover:bg-gray-700 transition-colors"
                  >
                    + Add Message
                  </button>
                </div>
              )
            )}

            <button
              onClick={addMessageExample}
              className="w-full p-2 bg-primary/20 text-primary rounded-sm hover:bg-primary/30 transition-colors text-sm font-medium"
            >
              + Add Conversation Example
            </button>

            {/* Post Examples */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                Post Examples
              </label>
              {(localNodeData.postExamples || []).map(
                (post: string, index: number) => (
                  <div key={index} className="relative mb-2">
                    <textarea
                      value={post}
                      onChange={(e) =>
                        handleArrayInputChange(
                          "postExamples",
                          e.target.value,
                          index
                        )
                      }
                      placeholder="Example post content..."
                      rows={2}
                      className="w-full p-3 pr-10 bg-bg border border-bg rounded-sm text-white placeholder-gray-500 focus:outline-none focus:ring-[0.5px] focus:ring-primary transition-all duration-300 resize-none text-sm"
                    />
                    <button
                      onClick={() => removeArrayItem("postExamples", index)}
                      className="absolute top-2 right-2 text-red-400 hover:text-red-500 transition-colors"
                    >
                      <XCircle size={16} />
                    </button>
                  </div>
                )
              )}
              <button
                onClick={() => addArrayItem("postExamples")}
                className="w-full p-2 bg-primary/20 text-primary rounded-sm hover:bg-primary/30 transition-colors text-sm font-medium"
              >
                + Add Post Example
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Character Traits */}
      <div className="space-y-4">
        <SectionHeader
          title="Character Traits"
          icon={Hash}
          section="traits"
          count={
            (localNodeData.adjectives?.length || 0) +
            (localNodeData.topics?.length || 0)
          }
        />

        {expandedSections.traits && (
          <div className="space-y-6 pl-6">
            {/* Adjectives */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                Adjectives
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {(localNodeData.adjectives || []).map(
                  (adj: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-primary/20 text-primary rounded-full px-3 py-1 text-sm"
                    >
                      <input
                        value={adj}
                        onChange={(e) =>
                          handleArrayInputChange(
                            "adjectives",
                            e.target.value,
                            index
                          )
                        }
                        placeholder="adjective"
                        className="bg-transparent focus:outline-none min-w-[80px] text-sm"
                      />
                      <button
                        onClick={() => removeArrayItem("adjectives", index)}
                        className="text-primary/70 hover:text-primary transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )
                )}
              </div>
              <button
                onClick={() => addArrayItem("adjectives")}
                className="w-full p-2 bg-primary/20 text-primary rounded-sm hover:bg-primary/30 transition-colors text-sm font-medium"
              >
                + Add Adjective
              </button>
            </div>

            {/* Topics */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                Topics
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {(localNodeData.topics || []).map(
                  (topic: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-gray-700 rounded-full px-3 py-1 text-sm"
                    >
                      <input
                        value={topic}
                        onChange={(e) =>
                          handleArrayInputChange(
                            "topics",
                            e.target.value,
                            index
                          )
                        }
                        placeholder="topic"
                        className="bg-transparent text-white focus:outline-none min-w-[80px] text-sm"
                      />
                      <button
                        onClick={() => removeArrayItem("topics", index)}
                        className="text-gray-400 hover:text-gray-300 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )
                )}
              </div>
              <button
                onClick={() => addArrayItem("topics")}
                className="w-full p-2 bg-primary/20 text-primary rounded-sm hover:bg-primary/30 transition-colors text-sm font-medium"
              >
                + Add Topic
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Style Configuration */}
      <div className="space-y-4">
        <SectionHeader
          title="Communication Style"
          icon={Sparkles}
          section="style"
          count={Object.values(localNodeData.style || {}).reduce(
            (acc: number, arr: unknown) =>
              acc + (Array.isArray(arr) ? arr.length : 0),
            0
          )}
        />

        {expandedSections.style && (
          <div className="space-y-6 pl-6">
            {/* General Style */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                General Style Rules
              </label>
              {(localNodeData.style?.all || []).map(
                (rule: string, index: number) => (
                  <div key={index} className="relative mb-2">
                    <input
                      type="text"
                      value={rule}
                      onChange={(e) =>
                        handleStyleArrayChange("all", e.target.value, index)
                      }
                      placeholder="Style rule..."
                      className="w-full p-2 pr-8 bg-bg border border-bg rounded-sm text-white placeholder-gray-500 focus:outline-none focus:ring-[0.5px] focus:ring-primary transition-all duration-300 text-sm"
                    />
                    <button
                      onClick={() => removeStyleArrayItem("all", index)}
                      className="absolute top-1/2 right-2 -translate-y-1/2 text-red-400 hover:text-red-500 transition-colors"
                    >
                      <XCircle size={14} />
                    </button>
                  </div>
                )
              )}
              <button
                onClick={() => addStyleArrayItem("all")}
                className="w-full p-2 bg-primary/20 text-primary rounded-sm hover:bg-primary/30 transition-colors text-sm font-medium"
              >
                + Add General Style Rule
              </button>
            </div>

            {/* Chat Style */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                Chat Style Rules
              </label>
              {(localNodeData.style?.chat || []).map(
                (rule: string, index: number) => (
                  <div key={index} className="relative mb-2">
                    <input
                      type="text"
                      value={rule}
                      onChange={(e) =>
                        handleStyleArrayChange("chat", e.target.value, index)
                      }
                      placeholder="Chat style rule..."
                      className="w-full p-2 pr-8 bg-bg border border-bg rounded-sm text-white placeholder-gray-500 focus:outline-none focus:ring-[0.5px] focus:ring-primary transition-all duration-300 text-sm"
                    />
                    <button
                      onClick={() => removeStyleArrayItem("chat", index)}
                      className="absolute top-1/2 right-2 -translate-y-1/2 text-red-400 hover:text-red-500 transition-colors"
                    >
                      <XCircle size={14} />
                    </button>
                  </div>
                )
              )}
              <button
                onClick={() => addStyleArrayItem("chat")}
                className="w-full p-2 bg-primary/20 text-primary rounded-sm hover:bg-primary/30 transition-colors text-sm font-medium"
              >
                + Add Chat Style Rule
              </button>
            </div>

            {/* Post Style */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2 tracking-wide">
                Post Style Rules
              </label>
              {(localNodeData.style?.post || []).map(
                (rule: string, index: number) => (
                  <div key={index} className="relative mb-2">
                    <input
                      type="text"
                      value={rule}
                      onChange={(e) =>
                        handleStyleArrayChange("post", e.target.value, index)
                      }
                      placeholder="Post style rule..."
                      className="w-full p-2 pr-8 bg-bg border border-bg rounded-sm text-white placeholder-gray-500 focus:outline-none focus:ring-[0.5px] focus:ring-primary transition-all duration-300 text-sm"
                    />
                    <button
                      onClick={() => removeStyleArrayItem("post", index)}
                      className="absolute top-1/2 right-2 -translate-y-1/2 text-red-400 hover:text-red-500 transition-colors"
                    >
                      <XCircle size={14} />
                    </button>
                  </div>
                )
              )}
              <button
                onClick={() => addStyleArrayItem("post")}
                className="w-full p-2 bg-primary/20 text-primary rounded-sm hover:bg-primary/30 transition-colors text-sm font-medium"
              >
                + Add Post Style Rule
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(CharacterConfigForm);
