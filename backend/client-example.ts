#!/usr/bin/env tsx
import 'dotenv/config';

/**
 * Example client for testing the x402 AI Marketplace API
 * 
 * This demonstrates how to:
 * 1. List available agents
 * 2. Attempt to invoke an agent (will get 402 Payment Required)
 * 3. Use x402-fetch for automatic payment handling
 */

const API_BASE = process.env.API_BASE || 'http://localhost:3001';

async function main() {
  console.log('🤖 x402 AI Marketplace Client Example');
  console.log('=====================================\n');

  try {
    // 1. Check API health
    console.log('1. Checking API health...');
    const healthResponse = await fetch(`${API_BASE}/health`);
    const health = await healthResponse.json();
    console.log('✅ API Status:', health.status);
    console.log('');

    // 2. List available agents
    console.log('2. Fetching available agents...');
    const agentsResponse = await fetch(`${API_BASE}/api/agents`);
    const agentsData = await agentsResponse.json();
    
    console.log(`📊 Found ${agentsData.total} agents:`);
    agentsData.agents.forEach((agent: any, index: number) => {
      console.log(`   ${index + 1}. ${agent.name} (${agent.id})`);
      console.log(`      Model: ${agent.model}`);
      console.log(`      Price: ${agent.pricing?.price || 'N/A'}`);
      console.log(`      Invocations: ${agent.totalInvocations}`);
      console.log('');
    });

    if (agentsData.agents.length === 0) {
      console.log('❌ No agents found. Make sure the server is running.');
      return;
    }

    // 3. Try to invoke an agent (without payment - should get 402)
    const firstAgent = agentsData.agents[0];
    console.log(`3. Attempting to invoke agent "${firstAgent.name}" without payment...`);
    
    const invokeResponse = await fetch(`${API_BASE}/api/agents/${firstAgent.id}/invoke`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Request-ID': `req_${Date.now()}`
      },
      body: JSON.stringify({
        input: 'Write a simple hello world function in Python',
        parameters: {
          temperature: 0.7,
          max_tokens: 200
        }
      })
    });

    console.log(`📡 Response Status: ${invokeResponse.status}`);
    
    if (invokeResponse.status === 402) {
      console.log('💰 Payment Required! This is expected for x402 protocol.');
      const paymentInfo = await invokeResponse.json();
      console.log('Payment details:', JSON.stringify(paymentInfo, null, 2));
      console.log('\n💡 To complete payment, use x402-fetch client or implement payment flow.');
    } else if (invokeResponse.status === 200) {
      const result = await invokeResponse.json();
      console.log('✅ Agent Response:', result.result.response);
    } else {
      const error = await invokeResponse.json();
      console.log('❌ Error:', error.message);
    }

    console.log('');

    // 4. Get available AI models
    console.log('4. Fetching available AI models...');
    const modelsResponse = await fetch(`${API_BASE}/api/agents/models`);
    const modelsData = await modelsResponse.json();
    
    console.log(`🧠 Available Models (${modelsData.count}):`);
    modelsData.models.forEach((model: string, index: number) => {
      console.log(`   ${index + 1}. ${model}`);
    });
    console.log('');

    // 5. Get wallet info
    console.log('5. Fetching wallet information...');
    const walletResponse = await fetch(`${API_BASE}/api/agents/wallet/info`);
    
    if (walletResponse.ok) {
      const walletData = await walletResponse.json();
      console.log('💳 Wallet Info:');
      console.log(`   Address: ${walletData.wallet.address}`);
      console.log(`   Network: ${walletData.wallet.networkId}`);
      console.log(`   Balances:`);
      walletData.wallet.balances.forEach((balance: any) => {
        console.log(`     ${balance.currency}: ${balance.amount}`);
      });
    } else {
      console.log('❌ Could not fetch wallet info (check CDP configuration)');
    }

    console.log('\n🎉 Client example completed successfully!');
    console.log('\nNext steps:');
    console.log('- Set up x402-fetch for automatic payment handling');
    console.log('- Deploy custom agents via POST /api/agents/deploy');
    console.log('- Integrate with your frontend application');

  } catch (error) {
    console.error('❌ Client error:', error.message);
    console.log('\nTroubleshooting:');
    console.log('- Make sure the backend server is running (npm run dev)');
    console.log('- Check that all environment variables are configured');
    console.log('- Verify API_BASE URL is correct');
  }
}

// Run the example
if (require.main === module) {
  main().catch(console.error);
}