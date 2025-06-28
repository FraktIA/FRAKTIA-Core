// Character configuration options for Eliza OS
export interface CharacterConfig {
  name: string;
  system: string;
  bio: string[];
  plugins?: string[];
  settings?: {
    secrets?: Record<string, string>;
    voice?: {
      model: string;
    };
  };
  messageExamples?: Array<
    Array<{
      name: string;
      content: {
        text: string;
        action?: string;
      };
    }>
  >;
  postExamples?: string[];
  adjectives?: string[];
  topics?: string[];
  style?: {
    all?: string[];
    chat?: string[];
    post?: string[];
  };
}

// Character Node Interface
export interface CharacterNode {
  id: string;
  name: string;
  type: "character";

  // Character configuration
  config: {
    // Character selection
    characterName: string;

    // Character customization
    customBio?: string[];
    customPersonality?: string;
    customAdjectives?: string[];
    customTopics?: string[];

    // Voice settings
    voice?: {
      model: string;
      language?: string;
      speed?: number;
      pitch?: number;
    };

    // Behavior settings
    behavior: {
      temperature: number;
      maxTokens: number;
      responseStyle: "casual" | "formal" | "creative" | "technical";
      conversationLength: "short" | "medium" | "long";
    };

    // Plugin configuration
    plugins: {
      enabled: string[];
      disabled: string[];
      customConfig?: Record<string, unknown>;
    };
  };

  // Node state
  state: {
    isConfigured: boolean;
    isActive: boolean;
    lastActivity: Date;
    conversationCount: number;
    userSatisfaction: number;
  };

  // Connection points
  connections: {
    inputs: string[];
    outputs: string[];
  };

  // Metadata
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    version: string;
    description?: string;
    tags?: string[];
  };
}

// Plugin configuration for Eliza OS
export interface PluginConfig {
  id: string;
  name: string;
  version: string;
  enabled: boolean;
  config?: Record<string, unknown>;
  dependencies?: string[];
  permissions?: string[];
}

// Eliza OS Node Framework Interface
export interface ElizaOSNode {
  // Basic identification
  id: string;
  name: string;
  type: "elizaos";

  // Framework configuration
  config: {
    // Character configuration using character file options
    character: CharacterConfig;

    // System settings
    system: {
      temperature: number; // 0-2
      maxTokens: number;
      model: string;
      provider: "openai" | "anthropic" | "local" | "custom";
      apiKey?: string;
      endpoint?: string;
      secrets?: Record<string, string>;
    };

    // Voice settings
    voice?: {
      model: string;
      language?: string;
      speed?: number;
      pitch?: number;
    };

    // Memory and context management
    memory: {
      enabled: boolean;
      maxContextLength: number;
      persistenceType: "session" | "file" | "database";
      autoCleanup: boolean;
    };

    // Conversation flow settings
    conversation: {
      maxTurns: number;
      timeout: number;
      retryAttempts: number;
      fallbackResponses: string[];
    };
  };

  // Plugin system - using actual plugin names from character files
  plugins: string[];

  // Node state
  state: {
    isConfigured: boolean;
    isActive: boolean;
    lastActivity: Date;
    errorCount: number;
    performance: {
      responseTime: number;
      successRate: number;
      totalInteractions: number;
    };
  };

  // Connection points
  connections: {
    inputs: string[];
    outputs: string[];
  };

  // Metadata
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    version: string;
    description?: string;
    tags?: string[];
  };
}

// Utility types for Eliza OS
export type ElizaOSNodeType = "basic" | "advanced" | "enterprise";
export type ElizaOSProvider = "openai" | "anthropic" | "local" | "custom";
export type ElizaOSMemoryType = "session" | "file" | "database";
export type ElizaOSStressResponse =
  | "calm"
  | "anxious"
  | "aggressive"
  | "withdrawn";

// Configuration validation
export interface ElizaOSValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}
