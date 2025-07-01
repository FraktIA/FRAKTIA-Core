"use server";

import axios from "axios";
import clientPromise from "@/lib/mongodb";
import { UserDocument, AgentData } from "@/actions/deploy";

export async function addUserToDatabase(address: string): Promise<{
  success: boolean;
  error?: string;
  isNewUser?: boolean;
}> {
  try {
    if (!address || !address.trim()) {
      return {
        success: false,
        error: "Address is required",
      };
    }

    const client = await clientPromise;
    const db = client.db("Fraktia");
    const collection = db.collection<UserDocument>("users");

    // Check if user already exists
    const existingUser = await collection.findOne({ address: address });

    if (existingUser) {
      console.log(`User ${address} already exists in database`);
      return {
        success: true,
        isNewUser: false,
      };
    }

    // Create new user document
    const newUser: UserDocument = {
      address: address,
      agents: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newUser);

    if (result.acknowledged) {
      console.log(`New user ${address} added to database`);
      return {
        success: true,
        isNewUser: true,
      };
    } else {
      return {
        success: false,
        error: "Failed to add user to database",
      };
    }
  } catch (error) {
    console.error("Error adding user to database:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function getUserByAddress(address: string): Promise<{
  success: boolean;
  user?: UserDocument;
  error?: string;
}> {
  try {
    if (!address || !address.trim()) {
      return {
        success: false,
        error: "Address is required",
      };
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
      user: user,
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function getAgents(address: string): Promise<{
  success: boolean;
  agents?: Array<{
    id: string;
    name: string;
    avatarUrl: string;
    roomId?: string;
  }>;
  error?: string;
}> {
  try {
    if (!address || !address.trim()) {
      return {
        success: false,
        error: "Address is required",
      };
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

    // If user has no agents, return empty array
    if (!user.agents || user.agents.length === 0) {
      return {
        success: true,
        agents: [],
      };
    }

    // Generate random avatars from randomuser.me for agents without avatar URLs
    const randomAvatars = [
      "https://randomuser.me/api/portraits/women/41.jpg",
      "https://randomuser.me/api/portraits/men/32.jpg",
      "https://randomuser.me/api/portraits/men/65.jpg",
      "https://randomuser.me/api/portraits/women/24.jpg",
      "https://randomuser.me/api/portraits/men/18.jpg",
      "https://randomuser.me/api/portraits/women/67.jpg",
      "https://randomuser.me/api/portraits/men/84.jpg",
      "https://randomuser.me/api/portraits/women/15.jpg",
    ];

    // Transform agent data for the UI
    const transformedAgents = user.agents.map((agent, index) => ({
      id: agent.id || `agent-${index}`,
      name: agent.name || `Agent ${index + 1}`,
      avatarUrl: agent.avatarUrl || randomAvatars[index % randomAvatars.length],
      roomId: agent.roomId || "default-room",
    }));

    return {
      success: true,
      agents: transformedAgents,
    };
  } catch (error) {
    console.error("Error fetching agents:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function getAgentById(
  agentId: string,
  userAddress: string
): Promise<{
  success: boolean;
  agent?: AgentData;
  error?: string;
}> {
  try {
    if (!agentId || !agentId.trim() || !userAddress || !userAddress.trim()) {
      return {
        success: false,
        error: "Agent ID and user address are required",
      };
    }

    const client = await clientPromise;
    const db = client.db("Fraktia");
    const collection = db.collection<UserDocument>("users");

    // Find the user and get the specific agent
    const user = await collection.findOne(
      { address: userAddress },
      { projection: { agents: 1 } }
    );

    if (!user) {
      return {
        success: false,
        error: "User not found",
      };
    }

    const agent = user.agents?.find((a) => a.id === agentId);

    if (!agent) {
      return {
        success: false,
        error: "Agent not found",
      };
    }

    return {
      success: true,
      agent,
    };
  } catch (error) {
    console.error("Error fetching agent by ID:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error occurred while fetching agent",
    };
  }
}

export async function deleteAgent(
  agentId: string,
  userAddress: string
): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    if (!agentId || !agentId.trim() || !userAddress || !userAddress.trim()) {
      return {
        success: false,
        error: "Agent ID and user address are required",
      };
    }

    // First, call the ElizaOS API to delete the agent
    try {
      const response = await axios.delete(
        `https://app.fraktia.ai
/api/agents/${agentId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          // Don't throw on HTTP error status codes
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

      console.log(
        "Agent deleted from ElizaOS server:",
        response.status === 200 ? "Success" : response.data
      );
    } catch (apiError) {
      console.error("Error deleting agent from API:", apiError);
      return {
        success: false,
        error: `Failed to delete agent from server: ${
          apiError instanceof Error ? apiError.message : "Unknown API error"
        }`,
      };
    }

    // If API deletion successful, remove agent from user's agents array in MongoDB
    const client = await clientPromise;
    const db = client.db("Fraktia");
    const collection = db.collection<UserDocument>("users");

    const updateResult = await collection.updateOne(
      { address: userAddress },
      {
        $pull: { agents: { id: agentId } },
        $set: { updatedAt: new Date() },
      }
    );

    if (updateResult.modifiedCount > 0) {
      console.log(
        `Agent ${agentId} deleted successfully for user ${userAddress}`
      );
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        error: "Agent not found in user's agent list or already deleted",
      };
    }
  } catch (error) {
    console.error("Error deleting agent:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error occurred while deleting agent",
    };
  }
}
