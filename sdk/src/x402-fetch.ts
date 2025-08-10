import { Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { randomUUID } from "crypto";

export interface PaymentResponse {
  transaction: Hex;
  network: string;
  payer: Hex;
  amount: string;
}

export interface X402FetchOptions {
  account: any; // viem Account
  requestId?: string;
  network?: string;
}

/**
 * Decode X-PAYMENT-RESPONSE header from x402 protocol
 */
export function decodeXPaymentResponse(header: string): PaymentResponse {
  try {
    const decoded = Buffer.from(header, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch (error) {
    throw new Error(`Failed to decode X-PAYMENT-RESPONSE header: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Wrapper around fetch that automatically handles x402 payments
 * Based on the x402-fetch library pattern
 */
export function wrapFetchWithPayment(
  fetchFn: typeof fetch,
  options: X402FetchOptions
): (input: string | URL, init?: RequestInit) => Promise<Response> {
  return async (input: string | URL, init: RequestInit = {}): Promise<Response> => {
    const requestId = options.requestId || randomUUID();
    
    // Add required headers for x402
    const headers = new Headers(init.headers);
    headers.set('X-Request-ID', requestId);
    headers.set('Accept', 'application/json');
    
    // If we have an account, set the payer address
    if (options.account) {
      headers.set('X-Payer-Address', options.account.address);
    }

    const requestInit: RequestInit = {
      ...init,
      headers,
    };

    try {
      // First attempt - might return 402 Payment Required
      let response = await fetchFn(input, requestInit);

      // Handle 402 Payment Required
      if (response.status === 402) {
        const paymentRequired = response.headers.get('x-payment-required');
        if (!paymentRequired) {
          throw new Error('402 response missing X-PAYMENT-REQUIRED header');
        }

        if (!options.account) {
          throw new Error('Payment required but no account provided');
        }

        // Parse payment requirements
        const paymentInfo = JSON.parse(
          Buffer.from(paymentRequired, 'base64').toString('utf-8')
        );

        console.log('Payment required:', paymentInfo);

        // In a real implementation, this would trigger the payment flow
        // For now, we'll simulate it by adding payment headers and retrying
        const paymentHeaders = new Headers(requestInit.headers);
        
        // Add payment simulation headers
        paymentHeaders.set('X-Payment', paymentRequired); // Echo back the requirement
        paymentHeaders.set('X-Payment-Network', options.network || 'base-sepolia');
        paymentHeaders.set('X-Payment-Payer', options.account.address);

        const paymentRequestInit: RequestInit = {
          ...requestInit,
          headers: paymentHeaders,
        };

        // Retry with payment headers
        response = await fetchFn(input, paymentRequestInit);
      }

      return response;
    } catch (error) {
      throw new Error(`x402 fetch failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
}

/**
 * Create a payment-enabled fetch function
 */
export function createX402Fetch(privateKey: Hex, network: string = 'base-sepolia'): (input: string | URL, init?: RequestInit) => Promise<Response> {
  const account = privateKeyToAccount(privateKey);
  
  return wrapFetchWithPayment(fetch, {
    account,
    network,
  });
}