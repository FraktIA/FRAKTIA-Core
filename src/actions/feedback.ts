"use server";

import clientPromise from "@/lib/mongodb";

export async function sendFeedback({
  message,
  address = null,
  createdAt = new Date(),
}: {
  message: string;
  address?: string | null;
  createdAt?: Date;
}): Promise<{ success: boolean; error?: string }> {
  try {
    if (!message || typeof message !== "string") {
      return { success: false, error: "Feedback message is required." };
    }

    const client = await clientPromise;
    const db = client.db("Fraktia");
    const feedbackCollection = db.collection("feedback");

    const feedbackDoc = {
      message,
      address,
      createdAt,
    };

    await feedbackCollection.insertOne(feedbackDoc);

    return { success: true };
  } catch (error) {
    console.error("Error saving feedback:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error occurred while saving feedback",
    };
  }
}
