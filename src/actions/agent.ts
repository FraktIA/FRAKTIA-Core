"use server";

import clientPromise from "@/lib/mongodb";
import { UserDocument } from "@/actions/deploy";

export interface AgentMemory {
  id: string;
  content: { text: string; source?: string };
  userId: string;
  agentId: string;
  entityId: string; // Added entityId field
  roomId?: string;
  channelId?: string;
  createdAt: string | number; // Can be string or timestamp number
  embedding?: number[];
  metadata?: Record<string, unknown>;
}

export interface GetAgentMemoriesParams {
  agentId: string;
  tableName?: string;
  includeEmbedding?: boolean;
  channelId?: string;
  roomId?: string;
}

export interface GetAgentMemoriesResponse {
  success: boolean;
  data?: AgentMemory[];
  error?: string;
}

export async function getAgentMemories({
  agentId,
  tableName = "messages",
  includeEmbedding = false,
  channelId,
  roomId,
}: GetAgentMemoriesParams): Promise<GetAgentMemoriesResponse> {
  try {
    // Build query parameters
    const searchParams = new URLSearchParams({
      tableName,
      includeEmbedding: includeEmbedding.toString(),
    });

    if (channelId) {
      searchParams.append("channelId", channelId);
    }

    if (roomId) {
      searchParams.append("roomId", roomId);
    }

    // Make API request to ElizaOS
    const response = await fetch(
      `http://localhost:3001/api/memory/${agentId}/memories?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", // Ensure fresh data
      }
    );

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
    // console.log(result.data.memories, "res");

    return {
      success: true,
      data: result.data.memories || [],
    };
  } catch (error) {
    console.error("Error fetching agent memories:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error occurred while fetching agent memories",
    };
  }
}

export interface AgentDetails {
  id: string;
  name: string;
  status: "active" | "inactive";
}

export interface GetAgentDetailsResponse {
  success: boolean;
  data?: AgentDetails;
  error?: string;
}

export async function getAgentDetails(
  agentId: string
): Promise<GetAgentDetailsResponse> {
  try {
    const response = await fetch(
      `http://localhost:3001/api/agents/${agentId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store", // Ensure fresh data
      }
    );

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
    console.error("Error fetching agent details:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error occurred while fetching agent details",
    };
  }
}

export interface SendMessageParams {
  agentId: string;
  text: string;
  senderId?: string;
  roomId?: string;
  source?: string;
}

export interface MessageResponse {
  success: boolean;
  data?: {
    messageId: string;
    message: {
      text: string;
    };
  };
  error?: string;
}

export async function sendMessageToAgent({
  agentId,
  text,
  senderId = "client",
  roomId = "default-room",
  source = "web",
}: SendMessageParams): Promise<MessageResponse> {
  try {
    const response = await fetch(
      `http://localhost:3001/api/agents/${agentId}/message`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          senderId,
          roomId,
          source,
        }),
      }
    );

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
    console.error("Error sending message to agent:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error occurred while sending message",
    };
  }
}

export interface MessageHistoryParams {
  agentId: string;
  roomId?: string;
  limit?: number;
}

export interface MessageHistoryResponse {
  success: boolean;
  data?: AgentMemory[];
  error?: string;
}

export async function getMessageHistory({
  agentId,
  roomId = "default-room",
  limit = 50,
}: MessageHistoryParams): Promise<MessageHistoryResponse> {
  try {
    const searchParams = new URLSearchParams({
      tableName: "messages",
      includeEmbedding: "false",
      limit: limit.toString(),
    });

    if (roomId) {
      searchParams.append("roomId", roomId);
    }

    const response = await fetch(
      `http://localhost:3001/api/memory/${agentId}/memories?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

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

    console.log("memories", result.data.memories);
    return {
      success: true,
      data: result.data.memories || [],
    };
  } catch (error) {
    console.error("Error fetching message history:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error occurred while fetching message history",
    };
  }
}

export interface CreateChatroomParams {
  agentId: string;
  userAddress: string;
  roomName?: string;
}

export interface CreateChatroomResponse {
  success: boolean;
  roomId?: string;
  error?: string;
  isNewRoom?: boolean;
}

export async function createChatroom({
  agentId,
  userAddress,
  roomName,
}: CreateChatroomParams): Promise<CreateChatroomResponse> {
  try {
    if (!agentId || !userAddress) {
      return {
        success: false,
        error: "Agent ID and user address are required",
      };
    }

    const client = await clientPromise;
    const db = client.db("Fraktia");
    const usersCollection = db.collection<UserDocument>("users");

    // Check if user exists
    const user = await usersCollection.findOne({ address: userAddress });
    if (!user) {
      return {
        success: false,
        error: "User not found in database",
      };
    }

    // Check if agent exists for this user
    const agent = user.agents?.find((a) => a.id === agentId);
    if (!agent) {
      return {
        success: false,
        error: "Agent not found for this user",
      };
    }

    // If agent already has a roomId, return it
    if (agent.roomId) {
      return {
        success: true,
        roomId: agent.roomId,
        isNewRoom: false,
      };
    }

    // Create a new room using ElizaOS API
    const roomData = {
      name:
        roomName ||
        `${agent.name} - ${userAddress.slice(0, 6)}...${userAddress.slice(-4)}`,
    };

    const response = await fetch(
      `http://localhost:3001/api/memory/${agentId}/rooms`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roomData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch((res) => {
        console.log(res, "response");
        return { message: "Unknown error" };
      });
      console.log(errorData, "errorData");

      return {
        success: false,
        error: errorData.message || `Failed to create room: ${response.status}`,
      };
    }

    const result = await response.json();
    const newRoomId = result.data?.id;
    console.log(result, "result");

    if (!newRoomId) {
      return {
        success: false,
        error: "No room ID returned from ElizaOS API",
      };
    }

    // Update the agent in the database with the new roomId
    const updateResult = await usersCollection.updateOne(
      {
        address: userAddress,
        "agents.id": agentId,
      },
      {
        $set: {
          "agents.$.roomId": newRoomId,
          updatedAt: new Date(),
        },
      }
    );

    if (!updateResult.acknowledged) {
      console.error("Failed to update agent with roomId in database");
      // Room was created in ElizaOS but not saved to DB - still return success with roomId
    }

    return {
      success: true,
      roomId: newRoomId,
      isNewRoom: true,
    };
  } catch (error) {
    console.error("Error creating chatroom:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error occurred while creating chatroom",
    };
  }
}
