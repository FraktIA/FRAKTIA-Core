"use server";

import axios from "axios";
import clientPromise from "@/lib/mongodb";
import { UserDocument } from "@/actions/deploy";
import { addressToUuid } from "@/lib/utils";

// // Re-export the helper function for backward compatibility
// export { addressToUuid } from "@/lib/utils";

import {
  GetAgentMemoriesParams,
  GetAgentMemoriesResponse,
  GetAgentDetailsResponse,
  SendMessageParams,
  MessageResponse,
  MessageHistoryParams,
  MessageHistoryResponse,
  CreateChatroomParams,
  CreateChatroomResponse,
} from "@/types/agent";

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
    const response = await axios.get(
      `https://app.fraktia.ai/api/memory/${agentId}/memories?${searchParams.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 second timeout
        validateStatus: (status) => status < 500,
      }
    );

    if (response.status >= 400) {
      const errorMessage =
        response.data?.message || `HTTP error! status: ${response.status}`;
      return {
        success: false,
        error: errorMessage,
      };
    }

    const result = response.data;
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

export async function getAgentDetails(
  agentId: string
): Promise<GetAgentDetailsResponse> {
  try {
    const response = await axios.get(
      `https://app.fraktia.ai/api/agents/${agentId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 second timeout
        validateStatus: (status) => status < 500,
      }
    );

    if (response.status >= 400) {
      const errorMessage =
        response.data?.message || `HTTP error! status: ${response.status}`;
      return {
        success: false,
        error: errorMessage,
      };
    }

    const result = response.data;

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

export async function sendMessageToAgent({
  agentId,
  text,
  roomId = "default-room",
  source = "fraktia_client",
  authorId,
  serverId = "00000000-0000-0000-0000-000000000000",
  currentMessageCount = 0, // Pass current message count from UI
}: SendMessageParams): Promise<MessageResponse> {
  try {
    // Convert author ID to UUID format if it's an Ethereum address
    const validAuthorId = authorId
      ? authorId.startsWith("0x")
        ? addressToUuid(authorId)
        : authorId
      : "00000000-0000-0000-0000-000000000001";

    // Retry function for network requests
    const retryRequest = async (
      requestFn: () => Promise<unknown>,
      maxRetries = 3
    ) => {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await requestFn();
        } catch (error: unknown) {
          if (attempt === maxRetries) {
            throw error;
          }

          // Only retry on timeout or network errors
          const errorCode =
            error && typeof error === "object" && "code" in error
              ? (error as { code: string }).code
              : "";
          const errorMessage =
            error && typeof error === "object" && "message" in error
              ? (error as { message: string }).message
              : "Unknown error";

          console.log(`Request failed on attempt ${attempt}:`, {
            errorCode,
            errorMessage,
          });

          if (
            errorCode === "ETIMEDOUT" ||
            errorCode === "ENOTFOUND" ||
            errorCode === "ECONNRESET"
          ) {
            console.log(
              `Attempt ${attempt} failed with ${errorCode}, retrying in ${
                attempt * 1000
              }ms...`
            );
            await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
            continue;
          }

          // Don't retry on other types of errors
          console.log(`Not retrying error: ${errorCode} - ${errorMessage}`);
          throw error;
        }
      }
    };

    // Use the channel messaging API instead of agent-specific API with retry
    const response = (await retryRequest(() =>
      axios.post(
        `https://app.fraktia.ai/api/messaging/central-channels/${roomId}/messages`,
        {
          author_id: validAuthorId, // Fixed: was incorrectly set to serverId
          content: text,
          server_id: serverId,
          source_type: source,
          metadata: {
            user_display_name: "User",
            agentId: agentId,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 15000, // 15 second timeout for message sending
          validateStatus: (status) => status < 500,
        }
      )
    )) as { status: number; data?: { error?: { message?: string } } };
    console.log(response.data, "response from sendMessageToAgent");

    if (response.status >= 400) {
      const errorMessage =
        response.data?.error?.message ||
        `HTTP error! status: ${response.status}`;
      return {
        success: false,
        error: errorMessage,
      };
    }

    // const result = response.data;

    // After successfully sending the message, wait for agent response by polling
    const maxRetries = 10; // Maximum number of polling attempts
    const retryDelay = 2000; // 2 seconds delay between attempts

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      // Wait before checking (except for first attempt)
      if (attempt > 0) {
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
      }

      const historyResponse = await getMessageHistory({
        roomId: roomId,
        limit: 50,
      });

      if (!historyResponse.success) {
        console.warn(
          "Failed to retrieve channel messages:",
          historyResponse.error
        );
        continue; // Try again
      }

      const messages = historyResponse.data || [];

      // Check if we have more messages than before AND there's an agent response
      if (messages.length > currentMessageCount) {
        // Look for a message that's NOT from the user's source type (i.e., an agent response)
        const hasAgentResponse =
          messages[messages.length - 1].sourceType === "agent_response";
        if (hasAgentResponse) {
          console.log(`Found agent response after ${attempt + 1} attempts`);
          return {
            success: true,
            data: messages,
          };
        }
      }

      // Log progress
      if (attempt === 0) {
        console.log("Message sent, waiting for agent response...");
      }
    }

    // If we've exhausted all retries, return what we have
    console.warn(
      "Agent response not received within timeout, returning current messages"
    );
    const finalHistoryResponse = await getMessageHistory({
      roomId: roomId,
      limit: 50,
    });

    return {
      success: true,
      data: finalHistoryResponse.success ? finalHistoryResponse.data || [] : [],
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

export async function getMessageHistory({
  roomId,
  limit = 50,
}: MessageHistoryParams): Promise<MessageHistoryResponse> {
  try {
    // Use the channel messages API instead of memory API
    const response = await axios.get(
      `https://app.fraktia.ai/api/messaging/central-channels/${roomId}/messages`,
      {
        params: {
          limit: limit,
        },
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 second timeout
        validateStatus: (status) => status < 500,
      }
    );

    if (response.status >= 400) {
      const errorMessage =
        response.data?.message || `HTTP error! status: ${response.status}`;
      return {
        success: false,
        error: errorMessage,
      };
    }

    const result = response.data;
    console.log("channel messages", result.data);

    return {
      success: true,
      data: result.data.messages.reverse() || [],
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

    // Retry function for network requests
    const retryRequest = async (
      requestFn: () => Promise<unknown>,
      maxRetries = 3
    ) => {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await requestFn();
        } catch (error: unknown) {
          if (attempt === maxRetries) {
            throw error;
          }

          // Only retry on timeout or network errors
          const errorCode =
            error && typeof error === "object" && "code" in error
              ? (error as { code: string }).code
              : "";
          const errorMessage =
            error && typeof error === "object" && "message" in error
              ? (error as { message: string }).message
              : "Unknown error";

          console.log(`Agent start attempt ${attempt} failed:`, {
            errorCode,
            errorMessage,
          });

          if (
            errorCode === "ETIMEDOUT" ||
            errorCode === "ENOTFOUND" ||
            errorCode === "ECONNRESET"
          ) {
            console.log(
              `Attempt ${attempt} failed with ${errorCode}, retrying in ${
                attempt * 1000
              }ms...`
            );
            await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
            continue;
          }

          // Don't retry on other types of errors
          console.log(`Not retrying error: ${errorCode} - ${errorMessage}`);
          throw error;
        }
      }
    };

    // Start the agent first before creating chatroom with retry mechanism
    try {
      const startResponse = (await retryRequest(() =>
        axios.post(
          `https://app.fraktia.ai/api/agents/${agentId}/start`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
            },
            timeout: 15000, // 15 second timeout for agent start
            validateStatus: (status) => status < 500,
          }
        )
      )) as { status: number; data?: unknown };

      if (startResponse.status >= 400) {
        console.warn(
          `Failed to start agent: ${startResponse.status}`,
          startResponse.data
        );
        // Continue with chatroom creation even if agent start fails
        // as the agent might already be running
      } else {
        console.log("Agent started successfully:", startResponse.data);
      }
    } catch (startError) {
      console.warn("Error starting agent after retries:", startError);
      // Continue with chatroom creation even if agent start fails
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
      serverId: "00000000-0000-0000-0000-000000000000",
      type: "text",
    };

    const response = await axios.post(
      `https://app.fraktia.ai/api/messaging/channels`,
      roomData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 second timeout
        validateStatus: (status) => status < 500,
      }
    );

    if (response.status >= 400) {
      const errorMessage =
        response.data?.message || `Failed to create room: ${response.status}`;
      console.log(response.data, "errorData");
      return {
        success: false,
        error: errorMessage,
      };
    }

    const result = response.data;
    const newRoomId = result.data?.channel?.id;
    console.log(result, "result");

    if (!newRoomId) {
      return {
        success: false,
        error: "No room ID returned from ElizaOS API",
      };
    }

    // Add the agent to the newly created channel
    try {
      const addAgentResponse = await axios.post(
        `https://app.fraktia.ai/api/messaging/central-channels/${newRoomId}/agents`,
        {
          agentId: agentId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 10000, // 10 second timeout
          validateStatus: (status) => status < 500,
        }
      );

      if (addAgentResponse.status >= 400) {
        console.warn(
          `Failed to add agent to channel: ${addAgentResponse.status}`,
          addAgentResponse.data
        );
        // Continue even if adding agent fails - the channel exists
      } else {
        console.log(
          "Agent added to channel successfully:",
          addAgentResponse.data
        );
      }
    } catch (addAgentError) {
      console.warn("Error adding agent to channel:", addAgentError);
      // Continue even if adding agent fails - the channel exists
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
