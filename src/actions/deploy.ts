"use server";

import clientPromise from "@/lib/mongodb";
import { apiClient } from "@/lib/api";
import { APINode } from "@/redux/slices/selectedNodesSlice";
import { CharacterNodeData, IndividualPluginConfig } from "@/types/nodeData";

export interface AgentData {
  id?: string;
  nodes: APINode[];
  name?: string;
  description?: string;
  avatarUrl?: string;
  roomId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDocument {
  address: string;
  agents?: AgentData[];
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
  ANTHROPIC_API_KEY?: string;
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
    character?: {
      name?: string;
      bio?: string;
      settings?: object;
      system?: string;
      style?: object;
      lore?: string[];
      messageExamples?: string[];
      topics?: string[];
      plugins?: string[];
    };
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
  const characterData = characterNode?.data as CharacterNodeData | undefined;
  const characterName = String(
    characterData?.name || agentData.name || "AI Assistant"
  );

  // Build plugins array
  const plugins: string[] = [];

  // Build settings
  const settings: ElizaSettings = {
    secrets: {},
    voice: {},
  };

  plugins.push("@elizaos/plugin-sql");

  // Add model plugin based on provider
  if (modelNode?.data?.provider === "anthropic") {
    plugins.push("@elizaos-plugins/plugin-anthropic");
  }
  // else if (modelNode?.data?.provider === "openai") {
  plugins.push("@elizaos/plugin-openai");
  // }

  // Add other plugins based on plugin nodes
  pluginNodes.forEach((pluginNode) => {
    // Handle new multi-plugin structure
    if (pluginNode.data?.plugins && Array.isArray(pluginNode.data.plugins)) {
      pluginNode.data.plugins.forEach((plugin: IndividualPluginConfig) => {
        if (plugin.service === "twitter") {
          plugins.push("@elizaos/plugin-twitter");

          // API credentials from form
          if (plugin?.twitterApiKey) {
            settings.secrets.TWITTER_API_KEY = String(plugin.twitterApiKey);
          }
          if (plugin?.twitterApiSecretKey) {
            settings.secrets.TWITTER_API_SECRET_KEY = String(
              plugin.twitterApiSecretKey
            );
          }
          if (plugin?.twitterAccessToken) {
            settings.secrets.TWITTER_ACCESS_TOKEN = String(
              plugin.twitterAccessToken
            );
          }
          if (plugin?.twitterAccessTokenSecret) {
            settings.secrets.TWITTER_ACCESS_TOKEN_SECRET = String(
              plugin.twitterAccessTokenSecret
            );
          }

          // Configuration options
          settings.secrets.TWITTER_DRY_RUN = String(
            plugin?.twitterDryRun || false
          );
          settings.secrets.TWITTER_TARGET_USERS = String(
            plugin?.twitterTargetUsers || ""
          );
          settings.secrets.TWITTER_RETRY_LIMIT = String(
            plugin?.twitterRetryLimit || 5
          );
          settings.secrets.TWITTER_POLL_INTERVAL = String(
            plugin?.twitterPollInterval || 120
          );
          settings.secrets.TWITTER_POST_ENABLE = String(
            plugin?.twitterPostEnable || true
          );
          settings.secrets.TWITTER_POST_INTERVAL_MIN = String(
            plugin?.twitterPostIntervalMin || 30
          );
          settings.secrets.TWITTER_POST_INTERVAL_MAX = String(
            plugin?.twitterPostIntervalMax || 180
          );
          settings.secrets.TWITTER_POST_IMMEDIATELY = String(
            plugin?.twitterPostImmediately || true
          );
          settings.secrets.TWITTER_POST_INTERVAL_VARIANCE = String(
            plugin?.twitterPostIntervalVariance || 0.2
          );
          settings.secrets.TWITTER_SEARCH_ENABLE = String(
            plugin?.twitterSearchEnable || false
          );
          settings.secrets.TWITTER_INTERACTION_INTERVAL_MIN = String(
            plugin?.twitterInteractionIntervalMin || 15
          );
          settings.secrets.TWITTER_INTERACTION_INTERVAL_MAX = String(
            plugin?.twitterInteractionIntervalMax || 30
          );
          settings.secrets.TWITTER_INTERACTION_INTERVAL_VARIANCE = String(
            plugin?.twitterInteractionIntervalVariance || 0.3
          );
          settings.secrets.TWITTER_AUTO_RESPOND_MENTIONS = String(
            plugin?.twitterAutoRespondMentions || false
          );
          settings.secrets.TWITTER_AUTO_RESPOND_REPLIES = String(
            plugin?.twitterAutoRespondReplies || false
          );
          settings.secrets.TWITTER_MAX_INTERACTIONS_PER_RUN = String(
            plugin?.twitterMaxInteractionsPerRun || 10
          );
          settings.secrets.TWITTER_TIMELINE_ALGORITHM = String(
            plugin?.twitterTimelineAlgorithm || "weighted"
          );
          settings.secrets.TWITTER_TIMELINE_USER_BASED_WEIGHT = String(
            plugin?.twitterTimelineUserBasedWeight || 3
          );
          settings.secrets.TWITTER_TIMELINE_TIME_BASED_WEIGHT = String(
            plugin?.twitterTimelineTimeBasedWeight || 2
          );
          settings.secrets.TWITTER_TIMELINE_RELEVANCE_WEIGHT = String(
            plugin?.twitterTimelineRelevanceWeight || 5
          );
          settings.secrets.TWITTER_MAX_TWEET_LENGTH = String(
            plugin?.twitterMaxTweetLength || 4000
          );
          settings.secrets.TWITTER_DM_ONLY = String(
            plugin?.twitterDmOnly || false
          );
          settings.secrets.TWITTER_ENABLE_ACTION_PROCESSING = String(
            plugin?.twitterEnableActionProcessing || false
          );
          settings.secrets.TWITTER_ACTION_INTERVAL = String(
            plugin?.twitterActionInterval || 240
          );
        }
        if (plugin.service === "discord") {
          plugins.push("@elizaos/plugin-discord");
          if (plugin?.discordApplicationId) {
            settings.secrets.DISCORD_APPLICATION_ID = String(
              plugin.discordApplicationId
            );
          }
          if (plugin?.discordApiToken) {
            settings.secrets.DISCORD_API_TOKEN = String(plugin.discordApiToken);
          }
          // Configuration options
          settings.secrets.DISCORD_DRY_RUN = String(
            plugin?.discordDryRun || false
          );
          settings.secrets.DISCORD_TARGET_CHANNELS = String(
            plugin?.discordTargetChannels || ""
          );
          settings.secrets.DISCORD_RESPONSE_CHANNELS = String(
            plugin?.discordResponseChannels || ""
          );
          settings.secrets.DISCORD_RETRY_LIMIT = String(
            plugin?.discordRetryLimit || 5
          );
          settings.secrets.DISCORD_POLL_INTERVAL = String(
            plugin?.discordPollInterval || 60
          );
          settings.secrets.DISCORD_AUTO_RESPONSE = String(
            plugin?.discordAutoResponse || true
          );
          settings.secrets.DISCORD_MAX_MESSAGE_LENGTH = String(
            plugin?.discordMaxMessageLength || 2000
          );
          settings.secrets.DISCORD_ENABLE_VOICE_CHANNELS = String(
            plugin?.discordEnableVoiceChannels || false
          );
          settings.secrets.DISCORD_MODERATE_CONTENT = String(
            plugin?.discordModerateContent || false
          );
          settings.secrets.DISCORD_ALLOWED_ROLES = String(
            plugin?.discordAllowedRoles || ""
          );
          settings.secrets.DISCORD_BANNED_USERS = String(
            plugin?.discordBannedUsers || ""
          );
          settings.secrets.DISCORD_MESSAGE_INTERVAL_MIN = String(
            plugin?.discordMessageIntervalMin || 30
          );
          settings.secrets.DISCORD_MESSAGE_INTERVAL_MAX = String(
            plugin?.discordMessageIntervalMax || 120
          );
        }
      });
    }
  });

  // Default plugins
  plugins.push("@elizaos/plugin-bootstrap");

  // Add API keys if available
  if (modelNode?.data?.provider === "anthropic") {
    settings.secrets.ANTHROPIC_API_KEY = modelNode?.data?.apiKey
      ? String(modelNode.data.apiKey)
      : (process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY as string);

    // Use separate small and large model fields
    settings.secrets.ANTHROPIC_SMALL_MODEL = modelNode?.data?.model_small
      ? String(modelNode.data.model_small)
      : "claude-3-5-haiku-latest";
    settings.secrets.ANTHROPIC_LARGE_MODEL = modelNode?.data?.model_large
      ? String(modelNode.data.model_large)
      : "claude-3-5-sonnet-latest";
  } else if (modelNode?.data.provider === "openai") {
    settings.secrets.OPENAI_API_KEY = modelNode?.data?.apiKey
      ? String(modelNode.data.apiKey)
      : (process.env.NEXT_PUBLIC_OPENAI_API_KEY as string);

    // Use separate small and large model fields
    settings.secrets.OPENAI_SMALL_MODEL = modelNode?.data?.model_small
      ? String(modelNode.data.model_small)
      : "gpt-4o-mini";
    settings.secrets.OPENAI_LARGE_MODEL = modelNode?.data?.model_large
      ? String(modelNode.data.model_large)
      : "gpt-4o";
    settings.secrets.USE_OPENAI_EMBEDDING = "true";
  }
  settings.secrets.OPENAI_API_KEY = modelNode?.data?.apiKey
    ? String(modelNode.data.apiKey)
    : (process.env.NEXT_PUBLIC_OPENAI_API_KEY as string);
  settings.secrets.USE_OPENAI_EMBEDDING = "true";
  // }

  // Add voice settings
  if (voiceNode?.data) {
    settings.voice.model = String(voiceNode.data.voice || "vits");
    settings.voice.language = String(voiceNode.data.language || "en");
    settings.voice.speed = Number(voiceNode.data.speed || 1);
  } else {
    console.log("No voice node found or voice node has no data");
  }

  // Create system prompt
  const system = String(
    characterData?.system ||
      `You are ${characterName}, a helpful AI assistant focused on providing accurate and thoughtful responses.`
  );

  // Use bio or create default
  const bio = Array.isArray(characterData?.bio)
    ? characterData.bio
    : [
        "A sophisticated AI assistant designed to help users with various tasks",
        "Specializes in problem-solving and information synthesis",
        "Maintains high accuracy and reliability in responses",
      ];

  // Create sample message examples
  const messageExamples: MessageExample[][] = Array.isArray(
    characterData?.messageExamples
  )
    ? characterData.messageExamples
    : [
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
  const postExamples = Array.isArray(characterData?.postExamples)
    ? characterData.postExamples
    : [
        "focus on solving problems step by step rather than rushing to conclusions",
        "the best solutions often come from understanding the real problem first",
        "accuracy and reliability matter more than speed when helping others",
        "every challenge is an opportunity to learn something new",
        "clear communication can solve most misunderstandings",
      ];

  // Use custom adjectives or defaults
  const adjectives = Array.isArray(characterData?.adjectives)
    ? characterData.adjectives
    : ["helpful", "analytical", "precise", "reliable", "knowledgeable"];

  // Use custom topics or defaults
  const topics = Array.isArray(characterData?.topics)
    ? characterData.topics
    : ["technology", "science", "problem-solving", "learning", "innovation"];

  // Create style configuration

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
    style: characterData?.style || {},
  } as ElizaCharacter;

  return formattedResult;
}

export async function deployAgentAction(
  address: string,
  nodes: APINode[],
  agentName?: string,
  description?: string,
  agentId?: string
): Promise<{ success: boolean; agentId?: string; error?: string }> {
  // console.log(nodes, "oheoss");
  try {
    // Validate input data
    if (!address || !address.trim()) {
      return { success: false, error: "Address is required for deployment" };
    }

    if (!nodes || nodes.length === 0) {
      return { success: false, error: "No nodes provided for deployment" };
    }

    // Validate that nodes contain only serializable data
    const serializedNodes = nodes.map((node) => ({
      type: node.type,
      data: node.data,
    }));

    // console.log(JSON.stringify(nodes, null, 2), "nodes");

    const client = await clientPromise;
    const db = client.db("Fraktia");
    const collection = db.collection<UserDocument>("users");

    // Check if user exists
    const existingUser = await collection.findOne({ address: address });
    if (!existingUser) {
      return {
        success: false,
        error:
          "User address not found. Please ensure the address is registered.",
      };
    }

    const agentData: AgentData = {
      nodes: serializedNodes,
      name: agentName || `Agent_${Date.now()}`,
      description: description || "AI Agent created with node builder",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Transform to Eliza format for API deployment
    const formattedResult = transformToElizaFormat(agentData);
    console.log(JSON.stringify(formattedResult, null, 2), "formattedResult");
    // return { success: true, agentId: formattedResult.name };

    let elizaAgentId: string;

    if (agentId) {
      // Update existing agent
      const {
        success: updateSuccess,
        data: updateData,
        error: updateError,
      } = await updateAgentOnServer(agentId, formattedResult);

      if (!updateSuccess || !updateData?.id) {
        return {
          success: false,
          error: updateError || "Failed to update agent on ElizaOS server",
        };
      }

      elizaAgentId = updateData.id;
      console.log("Agent updated on ElizaOS server with ID:", updateData);
      console.log("previde agentId:", agentId);
      console.log("new agentId:", elizaAgentId);
    } else {
      // Create new agent
      const {
        success: serverSuccess,
        data: serverData,
        error: serverError,
      } = await createAgentOnServer(formattedResult);

      if (!serverSuccess || !serverData?.id) {
        return {
          success: false,
          error: serverError || "Failed to deploy agent to ElizaOS server",
        };
      }

      elizaAgentId = serverData.id;
      console.log("Agent deployed to ElizaOS server with ID:", elizaAgentId);
    }

    // Create agent data with the ElizaOS agent ID
    const agentWithId = {
      ...agentData,
      id: elizaAgentId, // Use the ID from ElizaOS
    };

    let updateResult;

    if (agentId) {
      // Update existing agent in database - only update nodes and name
      updateResult = await collection.updateOne(
        {
          address: address,
          "agents.id": elizaAgentId,
        },
        {
          $set: {
            "agents.$.nodes": agentWithId.nodes,
            "agents.$.name": agentWithId.name,
            "agents.$.updatedAt": new Date(),
            updatedAt: new Date(),
          },
        }
      );

      if (updateResult.modifiedCount > 0) {
        console.log(
          `Agent ${elizaAgentId} updated successfully for address: ${address}`
        );
        return {
          success: true,
          agentId: elizaAgentId,
        };
      } else {
        console.warn(
          `Failed to update agent ${elizaAgentId} in database for address: ${address}`
        );
        return {
          success: false,
          error:
            "Failed to update agent in user profile. Agent updated on ElizaOS but not in database.",
        };
      }
    } else {
      // Add new agent to the user's agents array
      updateResult = await collection.updateOne(
        { address: address },
        {
          $push: {
            agents: agentWithId,
          },
          $setOnInsert: {
            createdAt: new Date(),
          },
          $set: {
            updatedAt: new Date(),
          },
        },
        { upsert: false } // Don't create new user, only update existing
      );

      if (updateResult.modifiedCount > 0) {
        console.log(`Agent deployed successfully for address: ${address}`);
        console.log("Agent saved to database with ElizaOS ID:", elizaAgentId);

        return {
          success: true,
          agentId: elizaAgentId,
        };
      } else {
        console.warn(
          `Agent ${elizaAgentId} deployed to ElizaOS but failed to save to database for address: ${address}`
        );

        return {
          success: false,
          error:
            "Failed to save agent to user profile. Agent deployed to ElizaOS but not linked to user.",
        };
      }
    }
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
    // Send to API using the correct endpoint and body structure
    const response = await apiClient.post("/agents", {
      characterJson: agentData,
    });

    if (response.status >= 400) {
      const errorMessage =
        response.data?.message || `HTTP error! status: ${response.status}`;
      return {
        success: false,
        error: errorMessage,
      };
    }

    const result: ApiAgentResponse = response.data;
    console.log(result, "result from server");

    return {
      success: result.success || true, // Assume success if response is 201
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

export async function updateAgentOnServer(
  agentId: string,
  agentData: ElizaCharacter
): Promise<{
  success: boolean;
  data?: ApiAgentResponse["data"];
  error?: string;
}> {
  try {
    // console.log(JSON.stringify(agentData, null, 2), "agentData to update");
    // Send PATCH request to update existing agent
    const response = await apiClient.patch(`/agents/${agentId}`, agentData);

    if (response.status >= 400) {
      const errorMessage =
        response.data?.message || `HTTP error! status: ${response.status}`;
      return {
        success: false,
        error: errorMessage,
      };
    }

    const result: ApiAgentResponse = response.data;
    console.log(JSON.stringify(result, null, 2), "result from server update");

    return {
      success: result.success || true,
      data: result.data,
    };
  } catch (error) {
    console.error("Error updating agent on server:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error occurred during agent update",
    };
  }
}

export async function getUserAgentsAction(address: string): Promise<{
  success: boolean;
  agents?: AgentData[];
  error?: string;
}> {
  try {
    if (!address || !address.trim()) {
      return { success: false, error: "Address is required" };
    }

    const client = await clientPromise;
    const db = client.db("Fraktia");
    const collection = db.collection<UserDocument>("users");

    const user = await collection.findOne({ address: address });

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    return {
      success: true,
      agents: user.agents || [],
    };
  } catch (error) {
    console.error("Error fetching user agents:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error occurred while fetching user agents",
    };
  }
}
