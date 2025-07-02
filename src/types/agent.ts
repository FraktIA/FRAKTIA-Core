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

export interface AgentDetails {
  id: string;
  name: string;
  status: "active" | "inactive";
  avatarUrl: string;
  description?: string;
  roomId?: string;
}

export interface GetAgentDetailsResponse {
  success: boolean;
  data?: AgentDetails;
  error?: string;
}

export interface SendMessageParams {
  agentId: string;
  text: string;
  roomId?: string;
  source?: string;
  authorId?: string;
  serverId?: string;
  currentMessageCount?: number; // Pass current message count from UI
}

export interface ChannelMessage {
  id: string;
  content: string;
  author_id: string;
  server_id: string;
  sourceType: string; // Fixed: should be source_type to match API response
  created_at: string;
  metadata?: Record<string, unknown>;
}

export interface MessageResponse {
  success: boolean;
  data?: ChannelMessage[]; // Array of channel messages retrieved after sending
  error?: string;
}

export interface MessageHistoryParams {
  agentId?: string; // Made optional since we're using channelId now
  roomId: string; // Made required since this is the channelId
  limit?: number;
}

export interface MessageHistoryResponse {
  success: boolean;
  data?: ChannelMessage[]; // Changed from AgentMemory to ChannelMessage
  error?: string;
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
