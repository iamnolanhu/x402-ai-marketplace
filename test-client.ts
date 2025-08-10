#!/usr/bin/env tsx
import { config } from "dotenv";
import { Hex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { X402AIMarketplaceClient } from "./sdk/src";

// Load environment variables
config();

async function main() {
  // Configuration
  const privateKey = process.env.PRIVATE_KEY as Hex;
  const baseURL = process.env.MARKETPLACE_URL || 'http://localhost:3001';
  
  if (!privateKey) {
    console.error("❌ Missing PRIVATE_KEY environment variable");
    console.log("   Set your private key: export PRIVATE_KEY=0x...");
    process.exit(1);
  }

  // Create account and client
  const account = privateKeyToAccount(privateKey);
  const client = new X402AIMarketplaceClient({
    baseUrl: baseURL,
    account,
    network: 'base-sepolia',
    timeout: 30000
  });

  console.log('🚀 x402 AI Marketplace Test Client');
  console.log('=====================================');
  console.log(`📍 Base URL: ${client.getBaseUrl()}`);
  console.log(`🏦 Account: ${client.getAccountAddress()}`);
  console.log(`🌐 Network: ${client.getNetwork()}`);
  console.log('');

  try {
    // 1. List all available agents
    console.log('📋 Listing available agents...');
    const agentsResponse = await client.listAgents();
    console.log(`   Found ${agentsResponse.total} agents:`);
    
    agentsResponse.agents.forEach((agent, index) => {
      console.log(`   ${index + 1}. ${agent.name} (${agent.id})`);
      console.log(`      Model: ${agent.model}`);
      console.log(`      Description: ${agent.description}`);
      console.log(`      Pricing: ${agent.pricing.fixedCost} wei fixed + ${agent.pricing.inputTokens}/1K input tokens`);
      console.log(`      Active: ${agent.isActive ? '✅' : '❌'}`);
      console.log('');
    });

    if (agentsResponse.agents.length === 0) {
      console.log('   No agents available. Try deploying one first!');
      return;
    }

    // 2. Get details for first agent
    const firstAgent = agentsResponse.agents[0];
    console.log(`🔍 Getting details for agent: ${firstAgent.name}`);
    const agentResponse = await client.getAgent(firstAgent.id);
    console.log('   Agent details:');
    console.log(`   Name: ${agentResponse.agent.name}`);
    console.log(`   Description: ${agentResponse.agent.description}`);
    console.log(`   Model: ${agentResponse.agent.model}`);
    console.log(`   Creator: ${agentResponse.agent.creator}`);
    console.log(`   Tags: ${agentResponse.agent.tags.join(', ')}`);
    console.log('');

    // 3. Invoke the agent (this will trigger x402 payment)
    console.log(`🤖 Invoking agent: ${firstAgent.name}`);
    console.log('   This will require payment via x402 protocol...');
    
    const invokeResponse = await client.invokeAgent(firstAgent.id, {
      input: "Hello! Can you tell me a short joke?",
      parameters: {
        max_tokens: 100,
        temperature: 0.7
      }
    });

    console.log('   ✅ Agent invoked successfully!');
    console.log(`   Model: ${invokeResponse.result.model}`);
    console.log(`   Response: ${invokeResponse.result.choices[0]?.message?.content || 'No response'}`);
    console.log(`   Usage: ${invokeResponse.result.usage.total_tokens} tokens`);
    
    if (invokeResponse.payment) {
      console.log('   💳 Payment details:');
      console.log(`   Transaction: ${invokeResponse.payment.transaction}`);
      console.log(`   Network: ${invokeResponse.payment.network}`);
      console.log(`   Payer: ${invokeResponse.payment.payer}`);
    }
    console.log('');

    // 4. Get available models
    console.log('🤖 Getting available AI models...');
    const modelsResponse = await client.getAvailableModels();
    console.log(`   Available models (${modelsResponse.count}):`);
    modelsResponse.models.forEach((model, index) => {
      console.log(`   ${index + 1}. ${model}`);
    });
    console.log('');

    // 5. Get wallet info
    console.log('💰 Getting wallet information...');
    const walletResponse = await client.getWalletInfo();
    console.log('   Wallet details:');
    console.log(`   ID: ${walletResponse.wallet.id}`);
    console.log(`   Address: ${walletResponse.wallet.address}`);
    console.log(`   Network: ${walletResponse.wallet.network}`);
    console.log('');

    // 6. Fund wallet (testnet only)
    console.log('🚰 Funding wallet via faucet...');
    try {
      const fundResponse = await client.fundWallet();
      console.log('   ✅ Wallet funded successfully!');
      console.log(`   Transaction: ${fundResponse.transactionHash}`);
    } catch (error) {
      console.log(`   ⚠️  Funding failed: ${error.message}`);
      console.log('   (This is expected if not on testnet or faucet is unavailable)');
    }
    console.log('');

    // 7. Example: Deploy a new agent (commented out to avoid charges)
    console.log('🚀 Example: Deploy a new agent (commented out)');
    console.log('   // Uncomment the code below to deploy a new agent');
    console.log('   // This will require payment via x402 protocol');
    /*
    const deployResponse = await client.deployAgent({
      name: "Test Echo Agent",
      description: "A simple agent that echoes input back",
      model: "meta-llama/Meta-Llama-3.1-8B-Instruct",
      endpoint: "https://api.hyperbolic.xyz/v1/chat/completions",
      pricing: {
        inputTokens: 10,    // 10 wei per 1K input tokens
        outputTokens: 20,   // 20 wei per 1K output tokens
        fixedCost: 100      // 100 wei fixed cost per request
      },
      tags: ["test", "echo", "demo"]
    });
    
    console.log('   ✅ Agent deployed successfully!');
    console.log(`   Agent ID: ${deployResponse.agent.id}`);
    console.log(`   Agent Name: ${deployResponse.agent.name}`);
    
    if (deployResponse.payment) {
      console.log('   💳 Deployment payment:');
      console.log(`   Transaction: ${deployResponse.payment.transaction}`);
    }
    */
    console.log('');

    console.log('✅ Test completed successfully!');
    console.log('=====================================');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.error('   💡 Make sure the marketplace backend is running');
      console.error('   Try: npm run dev (from project root)');
    } else if (error.message.includes('402') || error.message.includes('payment')) {
      console.error('   💡 Payment-related error - check your wallet balance');
      console.error('   Try funding your wallet on testnet first');
    }
    
    process.exit(1);
  }
}

// Helper function to display usage
function displayUsage() {
  console.log('x402 AI Marketplace Test Client');
  console.log('===============================');
  console.log('');
  console.log('Usage: tsx test-client.ts');
  console.log('       npm run test-client');
  console.log('');
  console.log('Environment Variables:');
  console.log('  PRIVATE_KEY          - Your private key (required)');
  console.log('  MARKETPLACE_URL      - Marketplace base URL (default: http://localhost:3001)');
  console.log('');
  console.log('Example:');
  console.log('  export PRIVATE_KEY=0x1234...abcd');
  console.log('  export MARKETPLACE_URL=https://your-marketplace.vercel.app');
  console.log('  tsx test-client.ts');
}

// Run main function
if (require.main === module) {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    displayUsage();
    process.exit(0);
  }
  
  main().catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}