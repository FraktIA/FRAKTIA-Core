// Shared Node Data Types for Config Forms

// Character Node Data Interface
export interface CharacterNodeData {
  characterId?: string;
  characterName?: string;
  system?: string;
  bio?: string[];
  messageExamples?: Array<Array<{ name: string; content: { text: string } }>>;
  postExamples?: string[];
  adjectives?: string[];
  topics?: string[];
  style?: {
    all?: string[];
    chat?: string[];
    post?: string[];
  };
  plugins?: {
    enabled: string[];
    disabled: string[];
    customConfig?: Record<string, unknown>;
  };
  settings?: {
    secrets?: Record<string, string>;
    voice?: {
      model: string;
    };
  };
  // Legacy fields for backward compatibility
  customBio?: string[];
  customPersonality?: string;
  customAdjectives?: string[];
  customTopics?: string[];
  personality?: string;
  framework?: string;
  configured?: boolean;
  label?: string;
}

// Framework Node Data Interface
export interface FrameworkNodeData {
  label: string;
  framework: "elizaos" | "copilot" | "crewai" | "langgraph";
  configured: boolean;
  characterName?: string;
  personality?: string;
}

// Model Node Data Interface
export interface ModelNodeData {
  provider: string;
  model: string;
  apiKey?: string;
  temperature?: number;
  customModel?: string;
  configured?: boolean;
}

// Voice Node Data Interface
export interface VoiceNodeData {
  voice?: string;
  language?: string;
  speed?: number;
  pitch?: number;
  configured?: boolean;
}

// Plugin Node Data Interface
export interface PluginNodeData {
  service?: string;
  apiKey?: string;
  endpoint?: string;
  configured?: boolean;

  // Twitter-specific configuration
  twitterApiKey?: string;
  twitterApiSecretKey?: string;
  twitterAccessToken?: string;
  twitterAccessTokenSecret?: string;
  twitterDryRun?: boolean;
  twitterTargetUsers?: string;
  twitterRetryLimit?: number;
  twitterPollInterval?: number;
  twitterPostEnable?: boolean;
  twitterPostIntervalMin?: number;
  twitterPostIntervalMax?: number;
  twitterPostImmediately?: boolean;
  twitterPostIntervalVariance?: number;
  twitterSearchEnable?: boolean;
  twitterInteractionIntervalMin?: number;
  twitterInteractionIntervalMax?: number;
  twitterInteractionIntervalVariance?: number;
  twitterAutoRespondMentions?: boolean;
  twitterAutoRespondReplies?: boolean;
  twitterMaxInteractionsPerRun?: number;
  twitterTimelineAlgorithm?: string;
  twitterTimelineUserBasedWeight?: number;
  twitterTimelineTimeBasedWeight?: number;
  twitterTimelineRelevanceWeight?: number;
  twitterMaxTweetLength?: number;
  twitterDmOnly?: boolean;
  twitterEnableActionProcessing?: boolean;
  twitterActionInterval?: number;
}

// Logic Node Data Interface
export interface LogicNodeData {
  condition?: string;
  expression?: string;
  configured?: boolean;
}

// Output Node Data Interface
export interface OutputNodeData {
  type?: string;
  template?: string;
  configured?: boolean;
}

// Union type for all possible node data
export type NodeData =
  | CharacterNodeData
  | FrameworkNodeData
  | ModelNodeData
  | VoiceNodeData
  | PluginNodeData
  | LogicNodeData
  | OutputNodeData;

// Message Example types
export interface MessageExample {
  name: string;
  content: { text: string };
}

export type ConversationExample = MessageExample[];
