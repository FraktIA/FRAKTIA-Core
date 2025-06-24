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

    const client = await clientPromise;
    const db = client.db("agents"); // Use 'agents' database
    // const collection = db.collection("deployments");

    const agentData: AgentData = {
      nodes: serializedNodes,
      name: agentName || `Agent_${Date.now()}`,
      description: description || "AI Agent created with node builder",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log(JSON.stringify(agentData, null, 2), "agentData");

    // Insert the agent data into MongoDB
    // const result = await collection.insertOne(agentData);

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
