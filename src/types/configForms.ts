import {
  ModelNodeData,
  CharacterNodeData,
  PluginNodeData,
  VoiceNodeData,
  FrameworkNodeData,
} from "./nodeData";

/**
 * Props interface for ModelConfigForm component
 * Handles AI model configuration including provider, model selection, and API authentication
 */
export interface ModelConfigFormProps {
  model: ModelNodeData;
  handleInputChange: (field: string, value: string | number | boolean) => void;
  onHighlightCharacter?: (nodeName: string) => void;
}

/**
 * Props interface for CharacterConfigForm component
 * Handles character creation and configuration with comprehensive personality settings
 */
export interface CharacterConfigFormProps {
  character: CharacterNodeData;
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
  onHighlightCharacter?: (nodeName: string) => void;
}

/**
 * Props interface for PluginConfigForm component
 * Handles plugin selection and configuration for social media and other integrations
 */
export interface PluginConfigFormProps {
  localNodeData: PluginNodeData;
  handleInputChange: (
    field: string,
    value: string | boolean | object | unknown[]
  ) => void;
}

/**
 * Props interface for TwitterPluginForm component
 * Handles Twitter/X specific plugin configuration
 */
export interface TwitterPluginFormProps {
  localNodeData: PluginNodeData;
  handleInputChange: (field: string, value: string | boolean) => void;
}

/**
 * Props interface for DiscordPluginForm component
 * Handles Discord bot specific plugin configuration
 */
export interface DiscordPluginFormProps {
  localNodeData: PluginNodeData;
  handleInputChange: (field: string, value: string | boolean) => void;
}

/**
 * Props interface for VoiceConfigForm component
 * Handles voice synthesis configuration including voice model and speech settings
 */
export interface VoiceConfigFormProps {
  localNodeData: VoiceNodeData;
  handleInputChange: (field: string, value: string | boolean) => void;
}

/**
 * Props interface for FrameworkConfigForm component
 * Handles AI framework selection and information display
 */
export interface FrameworkConfigFormProps {
  localNodeData: FrameworkNodeData;
}

/**
 * Common handler function types used across config forms
 */
export type InputChangeHandler<T = string | number | boolean> = (
  field: string,
  value: T
) => void;

export type ArrayInputChangeHandler = (
  field: string,
  value: string,
  index: number
) => void;

export type ArrayItemHandler = (field: string) => void;

export type ArrayItemRemoveHandler = (field: string, index: number) => void;

export type NodeUpdateHandler = (
  nodeId: string,
  data: Record<string, unknown>
) => void;

export type LocalNodeDataSetter = (data: Record<string, unknown>) => void;

export type CharacterHighlightHandler = (nodeName: string) => void;

/**
 * Expanded sections state interface used by config forms
 */
export interface ExpandedSectionsState {
  [key: string]: boolean;
}

/**
 * Common section toggle handler type
 */
export type SectionToggleHandler = (section: string) => void;
