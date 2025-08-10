import { randomUUID } from "crypto";
import { wrapFetchWithPayment, decodeXPaymentResponse } from "./x402-fetch";
import {
  Agent,
  AgentInvokeRequest,
  AgentInvokeResponse,
  AgentDeployRequest,
  AgentDeployResponse,
  ListAgentsResponse,
  GetAgentResponse,
  SDKConfig,
  ErrorResponse,
  PaymentResponse
} from "./types";

export class X402AIMarketplaceClient {
  private baseUrl: string;
  private account: any;
  private network: string;
  private timeout: number;
  private fetchWithPayment: (input: string | URL, init?: RequestInit) => Promise<Response>;

  constructor(config: SDKConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.account = config.account;
    this.network = config.network || 'base-sepolia';
    this.timeout = config.timeout || 30000;
    
    // Create payment-enabled fetch
    this.fetchWithPayment = wrapFetchWithPayment(fetch, {
      account: this.account,
      network: this.network,
    });
  }

  /**
   * List all available agents
   */
  async listAgents(): Promise<ListAgentsResponse> {
    const url = `${this.baseUrl}/api/agents`;
    
    try {
      const response = await this.makeRequest(url, {
        method: 'GET',
      });

      if (!response.ok) {
        throw await this.handleErrorResponse(response);
      }

      return await response.json() as ListAgentsResponse;
    } catch (error) {
      throw new Error(`Failed to list agents: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get specific agent details
   */
  async getAgent(id: string): Promise<GetAgentResponse> {
    const url = `${this.baseUrl}/api/agents/${encodeURIComponent(id)}`;
    
    try {
      const response = await this.makeRequest(url, {
        method: 'GET',
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Agent ${id} not found`);
        }
        throw await this.handleErrorResponse(response);
      }

      return await response.json() as GetAgentResponse;
    } catch (error) {
      throw new Error(`Failed to get agent ${id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Invoke an agent (requires payment via x402)
   */
  async invokeAgent(id: string, payload: AgentInvokeRequest): Promise<AgentInvokeResponse & { payment?: PaymentResponse }> {
    const url = `${this.baseUrl}/api/agents/${encodeURIComponent(id)}/invoke`;
    
    try {
      const response = await this.makeRequest(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Agent ${id} not found`);
        }
        throw await this.handleErrorResponse(response);
      }

      const result = await response.json() as AgentInvokeResponse;

      // Check for payment response header
      const paymentHeader = response.headers.get("x-payment-response");
      if (paymentHeader) {
        const paymentResponse = decodeXPaymentResponse(paymentHeader);
        
        // Log transaction confirmation (optional)
        await this.logTransaction(paymentResponse, {
          agentId: id,
          model: result.result?.model,
          tokens: result.result?.usage?.total_tokens
        });

        return {
          ...result,
          payment: paymentResponse
        };
      }

      return result;
    } catch (error) {
      throw new Error(`Failed to invoke agent ${id}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Deploy a new agent (requires payment via x402)
   */
  async deployAgent(config: AgentDeployRequest): Promise<AgentDeployResponse & { payment?: PaymentResponse }> {
    const url = `${this.baseUrl}/api/agents/deploy`;
    
    try {
      const response = await this.makeRequest(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw await this.handleErrorResponse(response);
      }

      const result = await response.json() as AgentDeployResponse;

      // Check for payment response header
      const paymentHeader = response.headers.get("x-payment-response");
      if (paymentHeader) {
        const paymentResponse = decodeXPaymentResponse(paymentHeader);
        
        // Log transaction confirmation
        await this.logTransaction(paymentResponse, {
          agentId: result.agent?.id,
          operation: 'deploy',
          agentName: result.agent?.name
        });

        return {
          ...result,
          payment: paymentResponse
        };
      }

      return result;
    } catch (error) {
      throw new Error(`Failed to deploy agent: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get available AI models
   */
  async getAvailableModels(): Promise<{ models: string[]; count: number; timestamp: string }> {
    const url = `${this.baseUrl}/api/agents/models`;
    
    try {
      const response = await this.makeRequest(url, {
        method: 'GET',
      });

      if (!response.ok) {
        throw await this.handleErrorResponse(response);
      }

      return await response.json() as { models: string[]; count: number; timestamp: string };
    } catch (error) {
      throw new Error(`Failed to get available models: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get wallet information
   */
  async getWalletInfo(): Promise<{ wallet: any; timestamp: string }> {
    const url = `${this.baseUrl}/api/agents/wallet/info`;
    
    try {
      const response = await this.makeRequest(url, {
        method: 'GET',
      });

      if (!response.ok) {
        throw await this.handleErrorResponse(response);
      }

      return await response.json() as { wallet: any; timestamp: string };
    } catch (error) {
      throw new Error(`Failed to get wallet info: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Fund wallet via faucet (testnet only)
   */
  async fundWallet(): Promise<{ success: boolean; transactionHash: string; message: string; timestamp: string }> {
    const url = `${this.baseUrl}/api/agents/wallet/fund`;
    
    try {
      const response = await this.makeRequest(url, {
        method: 'POST',
      });

      if (!response.ok) {
        throw await this.handleErrorResponse(response);
      }

      return await response.json() as { success: boolean; transactionHash: string; message: string; timestamp: string };
    } catch (error) {
      throw new Error(`Failed to fund wallet: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Make an HTTP request with payment support
   */
  private async makeRequest(url: string, init: RequestInit): Promise<Response> {
    const requestId = randomUUID();
    
    // Add required headers
    const headers = new Headers(init.headers);
    headers.set('X-Request-ID', requestId);
    headers.set('Accept', 'application/json');
    
    if (this.account) {
      headers.set('X-Payer-Address', this.account.address);
    }

    const requestInit: RequestInit = {
      ...init,
      headers,
      signal: AbortSignal.timeout(this.timeout),
    };

    return await this.fetchWithPayment(url, requestInit);
  }

  /**
   * Log transaction confirmation
   */
  private async logTransaction(
    paymentResponse: PaymentResponse,
    metadata: { agentId?: string; model?: string; tokens?: number; operation?: string; agentName?: string }
  ): Promise<void> {
    const url = `${this.baseUrl}/api/agents/transaction-log`;
    
    try {
      const requestId = randomUUID();
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Request-ID': requestId,
          'X-Transaction-Hash': paymentResponse.transaction,
          'X-Payment-Network': paymentResponse.network,
          'X-Payer-Address': paymentResponse.payer,
        },
        body: JSON.stringify({
          requestId,
          transactionHash: paymentResponse.transaction,
          network: paymentResponse.network,
          payer: paymentResponse.payer,
          ...metadata
        })
      });

      if (response.ok) {
        console.log('Transaction logged:', paymentResponse.transaction);
      } else {
        console.warn('Failed to log transaction:', response.status);
      }
    } catch (error) {
      console.warn('Error logging transaction:', error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Handle error responses
   */
  private async handleErrorResponse(response: Response): Promise<Error> {
    try {
      const errorData = await response.json() as ErrorResponse;
      return new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    } catch {
      return new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  /**
   * Get account address
   */
  getAccountAddress(): string {
    return this.account?.address || '';
  }

  /**
   * Get network
   */
  getNetwork(): string {
    return this.network;
  }

  /**
   * Get base URL
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }
}