import { z } from 'zod';
import winston from 'winston';

// Validation schemas
export const ChatCompletionSchema = z.object({
  model: z.string().min(1),
  messages: z.array(z.object({
    role: z.enum(['system', 'user', 'assistant']),
    content: z.string().min(1)
  })).min(1),
  max_tokens: z.number().int().min(1).max(4000).optional(),
  temperature: z.number().min(0).max(2).optional(),
  top_p: z.number().min(0).max(1).optional(),
  stream: z.boolean().optional()
});

export const AgentInvokeSchema = z.object({
  input: z.string().min(1),
  parameters: z.object({
    model: z.string().optional(),
    temperature: z.number().min(0).max(2).optional(),
    max_tokens: z.number().int().min(1).max(4000).optional()
  }).optional()
});

export const AgentDeploySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().min(1).max(500),
  model: z.string().min(1),
  systemPrompt: z.string().min(1).max(2000),
  pricing: z.object({
    price: z.string().regex(/^\$\d+(\.\d{1,2})?$/), // e.g., "$0.10"
    network: z.enum(['base', 'base-sepolia']).default('base')
  }).optional(),
  capabilities: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([])
});

// Types
export type ChatCompletionRequest = z.infer<typeof ChatCompletionSchema>;
export type AgentInvokeRequest = z.infer<typeof AgentInvokeSchema>;
export type AgentDeployRequest = z.infer<typeof AgentDeploySchema>;

export interface Agent {
  id: string;
  name: string;
  description: string;
  model: string;
  systemPrompt: string;
  pricing?: {
    price: string;
    network: string;
  };
  capabilities: string[];
  tags: string[];
  owner: string;
  createdAt: string;
  updatedAt: string;
  totalInvocations: number;
  rating?: number;
  status: 'active' | 'inactive' | 'deploying';
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: 'assistant' | 'user' | 'system';
      content: string;
    };
    finish_reason: string | null;
    logprobs: any | null;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class AIService {
  private hyperbolicApiKey: string;
  private logger: winston.Logger;
  private agents: Map<string, Agent> = new Map();

  constructor(logger: winston.Logger) {
    this.hyperbolicApiKey = process.env.HYPERBOLIC_API_KEY!;
    this.logger = logger;
    
    if (!this.hyperbolicApiKey) {
      throw new Error('HYPERBOLIC_API_KEY environment variable is required');
    }

    // Initialize with some demo agents
    this.initializeDemoAgents();
  }

  /**
   * Get all available agents
   */
  getAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  /**
   * Get agent by ID
   */
  getAgent(id: string): Agent | undefined {
    return this.agents.get(id);
  }

  /**
   * Deploy a new agent
   */
  async deployAgent(agentData: AgentDeployRequest, ownerId: string = 'anonymous'): Promise<Agent> {
    const agentId = this.generateAgentId();
    const now = new Date().toISOString();

    const agent: Agent = {
      id: agentId,
      name: agentData.name,
      description: agentData.description,
      model: agentData.model,
      systemPrompt: agentData.systemPrompt,
      pricing: agentData.pricing ? {
        price: agentData.pricing.price,
        network: agentData.pricing.network
      } : undefined,
      capabilities: agentData.capabilities,
      tags: agentData.tags,
      owner: ownerId,
      createdAt: now,
      updatedAt: now,
      totalInvocations: 0,
      status: 'active'
    };

    this.agents.set(agentId, agent);

    this.logger.info('Agent deployed', {
      agentId,
      name: agent.name,
      model: agent.model,
      owner: ownerId
    });

    return agent;
  }

  /**
   * Invoke an agent with the given input
   */
  async invokeAgent(agentId: string, request: AgentInvokeRequest, requestId?: string): Promise<any> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    if (agent.status !== 'active') {
      throw new Error(`Agent ${agentId} is not active`);
    }

    // Prepare chat completion request
    const messages = [
      { role: 'system' as const, content: agent.systemPrompt },
      { role: 'user' as const, content: request.input }
    ];

    const chatRequest: ChatCompletionRequest = {
      model: request.parameters?.model || agent.model,
      messages,
      max_tokens: request.parameters?.max_tokens || 1000,
      temperature: request.parameters?.temperature || 0.7
    };

    // Call Hyperbolic API
    const response = await this.callHyperbolic(chatRequest, requestId);

    // Update agent statistics
    agent.totalInvocations += 1;
    agent.updatedAt = new Date().toISOString();

    this.logger.info('Agent invoked', {
      agentId,
      requestId,
      model: chatRequest.model,
      inputLength: request.input.length,
      totalInvocations: agent.totalInvocations
    });

    return {
      agentId,
      response: response.choices[0]?.message?.content || '',
      model: response.model,
      usage: response.usage
    };
  }

  /**
   * Call Hyperbolic API for chat completions
   */
  private async callHyperbolic(request: ChatCompletionRequest, requestId?: string): Promise<ChatCompletionResponse> {
    const response = await fetch('https://api.hyperbolic.xyz/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.hyperbolicApiKey}`,
        ...(requestId && { 'X-Request-ID': requestId })
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const errorText = await response.text();
      this.logger.error(`Hyperbolic API error ${response.status}`, {
        requestId,
        model: request.model,
        error: errorText
      });

      // Parse error message for better user experience
      let errorMessage = 'The AI service is currently unavailable';
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.message) {
          if (errorData.message.includes('allowed now')) {
            const match = errorData.message.match(/Only (.+?) allowed now/);
            if (match) {
              const validModels = match[1]
                .split(' && ')
                .map(model => model.trim())
                .filter(model => model.length > 0)
                .sort();
              errorMessage = `Invalid model: "${request.model}". Valid models are: ${validModels.join(', ')}`;
            } else {
              errorMessage = `Invalid model: ${request.model}. Please check the model name.`;
            }
          } else {
            errorMessage = errorData.message;
          }
        }
      } catch {
        // Keep generic message if we can't parse the error response
      }

      const error = new Error(errorMessage);
      error.name = 'HyperbolicAPIError';
      throw error;
    }

    const json = await response.json() as ChatCompletionResponse;

    if (!json.choices || !Array.isArray(json.choices)) {
      throw new Error('Invalid response format from Hyperbolic API');
    }

    return json;
  }

  /**
   * Get available Hyperbolic models
   */
  async getAvailableModels(requestId?: string): Promise<string[]> {
    try {
      const response = await fetch('https://api.hyperbolic.xyz/v1/models', {
        headers: { 
          'Authorization': `Bearer ${this.hyperbolicApiKey}`,
          ...(requestId && { 'X-Request-ID': requestId })
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status}`);
      }

      const data: any = await response.json();
      return data.data?.map((model: any) => model.id) || [];
    } catch (error) {
      this.logger.error('Failed to fetch available models', { requestId, error: error.message });
      // Return default models if API fails
      return [
        'meta-llama/Meta-Llama-3.1-8B-Instruct',
        'meta-llama/Meta-Llama-3.1-70B-Instruct',
        'microsoft/Phi-3-medium-4k-instruct'
      ];
    }
  }

  /**
   * Generate unique agent ID
   */
  private generateAgentId(): string {
    return `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Initialize demo agents for testing
   */
  private initializeDemoAgents(): void {
    const demoAgents: Omit<Agent, 'id' | 'createdAt' | 'updatedAt' | 'totalInvocations' | 'owner'>[] = [
      {
        name: 'Code Assistant',
        description: 'Helps with coding questions and debugging',
        model: 'meta-llama/Meta-Llama-3.1-8B-Instruct',
        systemPrompt: 'You are a helpful coding assistant. Provide clear, accurate code examples and explanations.',
        capabilities: ['coding', 'debugging', 'code-review'],
        tags: ['development', 'programming', 'ai-assistant'],
        pricing: { price: '$0.05', network: 'base' },
        status: 'active' as const
      },
      {
        name: 'Content Writer',
        description: 'Professional content creation and copywriting',
        model: 'meta-llama/Meta-Llama-3.1-70B-Instruct',
        systemPrompt: 'You are a professional content writer. Create engaging, well-structured content tailored to the audience.',
        capabilities: ['writing', 'copywriting', 'content-strategy'],
        tags: ['content', 'marketing', 'writing'],
        pricing: { price: '$0.15', network: 'base' },
        status: 'active' as const
      },
      {
        name: 'Data Analyst',
        description: 'Analyze data and generate insights',
        model: 'meta-llama/Meta-Llama-3.1-70B-Instruct',
        systemPrompt: 'You are a data analyst. Provide clear insights, statistical analysis, and data-driven recommendations.',
        capabilities: ['data-analysis', 'statistics', 'insights'],
        tags: ['data', 'analytics', 'business-intelligence'],
        pricing: { price: '$0.20', network: 'base' },
        status: 'active' as const
      }
    ];

    demoAgents.forEach(agentData => {
      const agentId = this.generateAgentId();
      const now = new Date().toISOString();
      
      const agent: Agent = {
        id: agentId,
        ...agentData,
        owner: 'system',
        createdAt: now,
        updatedAt: now,
        totalInvocations: Math.floor(Math.random() * 100)
      };

      this.agents.set(agentId, agent);
    });

    this.logger.info('Demo agents initialized', { count: demoAgents.length });
  }
}