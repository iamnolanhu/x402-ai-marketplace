import { Hex } from "viem";

export interface Agent {
  id: string;
  name: string;
  description: string;
  model: string;
  version: string;
  endpoint: string;
  pricing: {
    inputTokens: number;   // Cost per 1K input tokens in Wei
    outputTokens: number;  // Cost per 1K output tokens in Wei
    fixedCost: number;     // Fixed cost per request in Wei
  };
  creator: string;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AgentInvokeRequest {
  input: string;
  parameters?: {
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    stream?: boolean;
    [key: string]: any;
  };
}

export interface AgentInvokeResponse {
  success: boolean;
  result: {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<{
      index: number;
      message: {
        role: string;
        content: string;
      };
      finish_reason: string;
    }>;
    usage: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  };
  agent: {
    id: string;
    name: string;
  };
  timestamp: string;
}

export interface AgentDeployRequest {
  name: string;
  description: string;
  model: string;
  endpoint: string;
  pricing: {
    inputTokens: number;
    outputTokens: number;
    fixedCost: number;
  };
  tags?: string[];
}

export interface AgentDeployResponse {
  success: boolean;
  agent: Agent;
  message: string;
  timestamp: string;
}

export interface ListAgentsResponse {
  agents: Agent[];
  total: number;
  timestamp: string;
}

export interface GetAgentResponse {
  agent: Agent;
  timestamp: string;
}

export interface SDKConfig {
  baseUrl: string;
  account: any; // viem Account type
  network?: string;
  timeout?: number;
}

export interface PaymentResponse {
  transaction: Hex;
  network: string;
  payer: Hex;
  amount: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
  requestId?: string;
  timestamp: string;
}