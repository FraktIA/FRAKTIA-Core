"use server";

import clientPromise from "@/lib/mongodb";
import { APINode } from "@/redux/slices/selectedNodesSlice";

export interface AgentData {
  nodes: APINode[];
  name?: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface MessageContent {
  text: string;
  action?: string;
}

interface MessageExample {
  name: string;
  content: MessageContent;
}

interface ElizaSettings {
  secrets: Record<string, string>;
  voice: {
    model?: string;
    language?: string;
    speed?: number;
  };
}

interface ElizaCharacter {
  name: string;
  plugins: string[];
  settings: ElizaSettings;
  system: string;
  bio: string[];
  messageExamples: MessageExample[][];
  postExamples: string[];
  adjectives: string[];
  topics: string[];
  style: {
    all: string[];
    chat: string[];
    post: string[];
  };
}

interface ApiAgentResponse {
  success: boolean;
  data?: {
    id?: string;
    characterPath?: string;
    characterJson?: ElizaCharacter;
    createdAt?: string;
    [key: string]: unknown;
  };
}

function transformToElizaFormat(agentData: AgentData): ElizaCharacter {
  // Find specific nodes
  const characterNode = agentData.nodes.find(
    (node) => node.type === "character"
  );
  const modelNode = agentData.nodes.find((node) => node.type === "model");
  const voiceNode = agentData.nodes.find((node) => node.type === "voice");
  const pluginNodes = agentData.nodes.filter((node) => node.type === "plugin");

  // Extract character data
  const characterData = characterNode?.data;
  const characterName = String(
    characterData?.name || agentData.name || "AI Assistant"
  );

  // Build plugins array
  const plugins: string[] = [];

  // Add model plugin based on provider
  if (modelNode?.data?.provider === "anthropic") {
    plugins.push("@elizaos/plugin-anthropic");
  } else if (modelNode?.data?.provider === "openai") {
    plugins.push("@elizaos/plugin-openai");
  }

  // Add other plugins based on plugin nodes
  pluginNodes.forEach((plugin) => {
    if (plugin.data?.service === "Twitter") {
      plugins.push("@elizaos/plugin-twitter");
    }
  });

  // Default plugins
  plugins.push("@elizaos/plugin-bootstrap");

  // Build settings
  const settings: ElizaSettings = {
    secrets: {},
    voice: {},
  };

  // Add API keys if available
  // if (modelNode?.data?.apiKey) {
  if (modelNode?.data.provider === "anthropic") {
    settings.secrets.ANTHROPIC_API_KEY = modelNode?.data?.apiKey
      ? String(modelNode.data.apiKey)
      : (process.env.ANTHROPIC_API_KEY as string);
  } else if (modelNode?.data.provider === "openai") {
    settings.secrets.OPENAI_API_KEY =
      String(modelNode.data.apiKey) ?? process.env.OPENAI_API_KEY;
  }
  // }

  // Add Twitter credentials if Twitter plugin is configured
  const twitterPlugin = pluginNodes.find(
    (plugin) => plugin.data?.service === "Twitter"
  );
  if (twitterPlugin) {
    settings.secrets.TWITTER_USERNAME = process.env.TWITTER_USERNAME || "";
    settings.secrets.TWITTER_PASSWORD = process.env.TWITTER_PASSWORD || "";
    settings.secrets.TWITTER_EMAIL = process.env.TWITTER_EMAIL || "";
    settings.secrets.TWITTER_2FA_SECRET = process.env.TWITTER_2FA_SECRET || "";
    settings.secrets.TWITTER_DRY_RUN = String(
      twitterPlugin.data?.twitterDryRun || false
    );
    settings.secrets.TWITTER_TARGET_USERS = String(
      twitterPlugin.data?.twitterTargetUsers || ""
    );
    settings.secrets.TWITTER_RETRY_LIMIT = String(
      twitterPlugin.data?.twitterRetryLimit || 5
    );
    settings.secrets.TWITTER_POLL_INTERVAL = String(
      twitterPlugin.data?.twitterPollInterval || 120
    );
    settings.secrets.TWITTER_POST_ENABLE = String(
      twitterPlugin.data?.twitterPostEnable || false
    );
    settings.secrets.TWITTER_POST_INTERVAL_MIN = String(
      twitterPlugin.data?.twitterPostIntervalMin || 90
    );
    settings.secrets.TWITTER_POST_INTERVAL_MAX = String(
      twitterPlugin.data?.twitterPostIntervalMax || 180
    );
    settings.secrets.TWITTER_POST_IMMEDIATELY = String(
      twitterPlugin.data?.twitterPostImmediately || false
    );
    settings.secrets.TWITTER_POST_INTERVAL_VARIANCE = String(
      twitterPlugin.data?.twitterPostIntervalVariance || 0.2
    );
    settings.secrets.TWITTER_SEARCH_ENABLE = String(
      twitterPlugin.data?.twitterSearchEnable || true
    );
    settings.secrets.TWITTER_INTERACTION_INTERVAL_MIN = String(
      twitterPlugin.data?.twitterInteractionIntervalMin || 15
    );
    settings.secrets.TWITTER_INTERACTION_INTERVAL_MAX = String(
      twitterPlugin.data?.twitterInteractionIntervalMax || 30
    );
    settings.secrets.TWITTER_INTERACTION_INTERVAL_VARIANCE = String(
      twitterPlugin.data?.twitterInteractionIntervalVariance || 0.3
    );
    settings.secrets.TWITTER_AUTO_RESPOND_MENTIONS = String(
      twitterPlugin.data?.twitterAutoRespondMentions || true
    );
    settings.secrets.TWITTER_AUTO_RESPOND_REPLIES = String(
      twitterPlugin.data?.twitterAutoRespondReplies || true
    );
    settings.secrets.TWITTER_MAX_INTERACTIONS_PER_RUN = String(
      twitterPlugin.data?.twitterMaxInteractionsPerRun || 10
    );
    settings.secrets.TWITTER_TIMELINE_ALGORITHM = String(
      twitterPlugin.data?.twitterTimelineAlgorithm || "weighted"
    );
    settings.secrets.TWITTER_TIMELINE_USER_BASED_WEIGHT = String(
      twitterPlugin.data?.twitterTimelineUserBasedWeight || 3
    );
    settings.secrets.TWITTER_TIMELINE_TIME_BASED_WEIGHT = String(
      twitterPlugin.data?.twitterTimelineTimeBasedWeight || 2
    );
    settings.secrets.TWITTER_TIMELINE_RELEVANCE_WEIGHT = String(
      twitterPlugin.data?.twitterTimelineRelevanceWeight || 5
    );
    settings.secrets.TWITTER_MAX_TWEET_LENGTH = String(
      twitterPlugin.data?.twitterMaxTweetLength || 4000
    );
    settings.secrets.TWITTER_DM_ONLY = String(
      twitterPlugin.data?.twitterDmOnly || false
    );
    settings.secrets.TWITTER_ENABLE_ACTION_PROCESSING = String(
      twitterPlugin.data?.twitterEnableActionProcessing || false
    );
    settings.secrets.TWITTER_ACTION_INTERVAL = String(
      twitterPlugin.data?.twitterActionInterval || 240
    );
  }

  // Add voice settings
  if (voiceNode?.data) {
    settings.voice.model = String(voiceNode.data.voice || "alloy");
    settings.voice.language = String(voiceNode.data.language || "en");
    settings.voice.speed = Number(voiceNode.data.speed || 1);
  }

  // Create system prompt
  const system = String(
    characterData?.customPersonality ||
      `You are ${characterName}, a helpful AI assistant focused on providing accurate and thoughtful responses.`
  );

  // Use bio or create default
  const bio = Array.isArray(characterData?.customBio)
    ? characterData.customBio
    : [
        "A sophisticated AI assistant designed to help users with various tasks",
        "Specializes in problem-solving and information synthesis",
        "Maintains high accuracy and reliability in responses",
      ];

  // Create sample message examples
  const messageExamples: MessageExample[][] = [
    [
      {
        name: "{{name1}}",
        content: {
          text: "hello there",
        },
      },
      {
        name: characterName,
        content: {
          text: "hello! how can i help you today?",
        },
      },
    ],
    [
      {
        name: "{{name1}}",
        content: {
          text: "what are you good at?",
        },
      },
      {
        name: characterName,
        content: {
          text: "i'm designed to help with various tasks including problem-solving, analysis, and providing information. what would you like assistance with?",
        },
      },
    ],
  ];

  // Create post examples
  const postExamples = [
    "focus on solving problems step by step rather than rushing to conclusions",
    "the best solutions often come from understanding the real problem first",
    "accuracy and reliability matter more than speed when helping others",
    "every challenge is an opportunity to learn something new",
    "clear communication can solve most misunderstandings",
  ];

  // Use custom adjectives or defaults
  const adjectives = Array.isArray(characterData?.customAdjectives)
    ? characterData.customAdjectives
    : ["helpful", "analytical", "precise", "reliable", "knowledgeable"];

  // Use custom topics or defaults
  const topics = Array.isArray(characterData?.customTopics)
    ? characterData.customTopics
    : ["technology", "science", "problem-solving", "learning", "innovation"];

  // Create style configuration
  const style = {
    all: [
      "be helpful and accurate",
      "provide clear and concise responses",
      "focus on being genuinely useful",
      "maintain a friendly and professional tone",
      "be empathetic and understanding",
    ],
    chat: [
      "be direct and helpful",
      "provide actionable information",
      "ask clarifying questions when needed",
      "focus on solving the user's problem",
    ],
    post: [
      "share useful insights and knowledge",
      "focus on practical advice",
      "be informative without being overwhelming",
      "help people learn and grow",
    ],
  };

  const formattedResult = {
    name: characterName,
    plugins,
    settings,
    system,
    bio,
    messageExamples,
    postExamples,
    adjectives,
    topics,
    style,
  };

  return formattedResult;
}

export async function deployAgentAction(
  nodes: APINode[],
  agentName?: string,
  description?: string
): Promise<{ success: boolean; agentId?: string; error?: string }> {
  try {
    // Validate input data
    if (!nodes || nodes.length === 0) {
      return { success: false, error: "No nodes provided for deployment" };
    }

    // Validate that nodes contain only serializable data
    const serializedNodes = nodes.map((node) => ({
      type: node.type,
      data: node.data,
    }));

    // const client = await clientPromise;
    // const db = client.db("agents"); // Use 'agents' database
    // const collection = db.collection("deployments");

    const agentData: AgentData = {
      nodes: serializedNodes,
      name: agentName || `Agent_${Date.now()}`,
      description: description || "AI Agent created with node builder",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    // console.log(JSON.stringify(agentData, null, 2), "agentData");

    // Transform to Eliza format
    const formattedResult = transformToElizaFormat(agentData);
    console.log(JSON.stringify(formattedResult, null, 2), "formattedResult");

    // const { success, data } = await createAgentOnServer(formattedResult);
    // console.log("data", data, "success", success);
    // Simulate API delay for testing modals (3 seconds)
    console.log("Starting deployment simulation...");
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log("Deployment simulation completed!");
    // Insert the agent data into MongoDB
    // const result = await collection.insertOne(agentData);
    return {
      success: true,
      agentId: "mocked-agent-id", // result.insertedId.toString(),
    };

    // if (result.acknowledged) {
    //   return {
    //     success: true,
    //     agentId: result.insertedId.toString(),
    //   };
    // } else {
    //   return {
    //     success: false,
    //     error: "Failed to save agent to database",
    //   };
    // }
  } catch (error) {
    console.error("Error deploying agent:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error occurred during deployment",
    };
  }
}

export async function getDeployedAgentsAction(): Promise<{
  success: boolean;
  agents?: AgentData[];
  error?: string;
}> {
  try {
    const client = await clientPromise;
    const db = client.db("agents");
    const collection = db.collection<AgentData>("deployments");

    const agents = await collection.find({}).sort({ createdAt: -1 }).toArray();

    return {
      success: true,
      agents: agents,
    };
  } catch (error) {
    console.error("Error fetching deployed agents:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error occurred while fetching agents",
    };
  }
}

export async function createAgentOnServer(agentData: ElizaCharacter): Promise<{
  success: boolean;
  data?: ApiAgentResponse["data"];
  error?: string;
}> {
  try {
    // Transform to Eliza format

    // Send to API
    const response = await fetch("http://localhost:3001/api/agents", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        characterJson: agentData,
      }),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Unknown error" }));
      return {
        success: false,
        error: errorData.message || `HTTP error! status: ${response.status}`,
      };
    }

    const result = await response.json();
    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Error creating agent on server:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error occurred during agent creation",
    };
  }
}
