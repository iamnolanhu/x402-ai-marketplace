#!/usr/bin/env tsx
import { config } from "dotenv";
import { Hex } from "viem";
import { X402AIMarketplaceClient, privateKeyToAccount } from "../src";

// Load environment variables
config({ path: '../../.env' });

async function basicExample() {
  console.log('📚 Basic SDK Usage Example');
  console.log('===========================');

  // 1. Setup client
  const privateKey = process.env.PRIVATE_KEY as Hex;
  const account = privateKeyToAccount(privateKey);
  
  const client = new X402AIMarketplaceClient({
    baseUrl: process.env.MARKETPLACE_URL || 'http://localhost:3001',
    account,
    network: 'base-sepolia'
  });

  console.log(`🏦 Connected with account: ${client.getAccountAddress()}`);
  console.log(`🌐 Network: ${client.getNetwork()}`);
  console.log('');

  // 2. List agents
  console.log('📋 Listing agents...');
  const agentsResponse = await client.listAgents();
  console.log(`Found ${agentsResponse.total} agents`);
  agentsResponse.agents.forEach(agent => {
    console.log(`  • ${agent.name} (${agent.id}) - ${agent.model}`);
  });
  console.log('');

  if (agentsResponse.agents.length > 0) {
    // 3. Get agent details
    const agent = agentsResponse.agents[0];
    console.log(`🔍 Getting details for: ${agent.name}`);
    const details = await client.getAgent(agent.id);
    console.log(`  Description: ${details.agent.description}`);
    console.log(`  Tags: ${details.agent.tags.join(', ')}`);
    console.log(`  Pricing: ${details.agent.pricing.fixedCost} wei + ${details.agent.pricing.inputTokens}/1K tokens`);
    console.log('');

    // 4. Invoke agent (with payment)
    console.log(`🤖 Invoking agent: ${agent.name}`);
    try {
      const response = await client.invokeAgent(agent.id, {
        input: "What is the capital of France?",
        parameters: {
          max_tokens: 50,
          temperature: 0.1
        }
      });

      console.log(`✅ Success!`);
      console.log(`Response: ${response.result.choices[0]?.message?.content}`);
      console.log(`Tokens used: ${response.result.usage.total_tokens}`);
      
      if (response.payment) {
        console.log(`💳 Payment: ${response.payment.transaction}`);
      }
    } catch (error) {
      console.log(`❌ Failed: ${error.message}`);
    }
  }

  console.log('');
  console.log('✨ Example completed');
}

// Run if called directly
if (require.main === module) {
  basicExample().catch(console.error);
}

export { basicExample };