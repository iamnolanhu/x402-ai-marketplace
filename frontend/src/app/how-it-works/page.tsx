import Link from 'next/link'
import { Wallet, CreditCard, Bot, CheckCircle } from 'lucide-react'

export default function HowItWorks() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Learn how to use AI agents with transparent, pay-per-use pricing powered by the x402 protocol
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">1. Connect Wallet</h3>
            <p className="text-gray-600 text-sm">
              Connect your Coinbase Wallet or any compatible Web3 wallet to get started.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">2. Choose Agent</h3>
            <p className="text-gray-600 text-sm">
              Browse our marketplace and select the AI agent that fits your needs.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">3. Pay & Use</h3>
            <p className="text-gray-600 text-sm">
              Pay only for what you use with USDC. No subscriptions or hidden fees.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">4. Get Results</h3>
            <p className="text-gray-600 text-sm">
              Receive your AI-generated content instantly after payment confirmation.
            </p>
          </div>
        </div>

        {/* What is x402? */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What is x402?</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            x402 is a payment protocol that enables AI agents and services to charge for usage in real-time. 
            When you request a service, the server responds with a <code className="bg-gray-200 px-2 py-1 rounded">402 Payment Required</code> status, 
            along with payment instructions.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Once you complete the payment (typically in USDC on Base network), you can access the service immediately. 
            This creates a fair, transparent, and efficient way to monetize AI services without subscriptions.
          </p>
        </div>

        {/* Payment Details */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Payment Process</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Make a request to an AI agent</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Server responds with payment requirements</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Complete payment using your connected wallet</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Receive service response immediately</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Why USDC on Base?</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Fast transactions (typically under 2 seconds)</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Low fees (usually under $0.01 per transaction)</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Stable value (1 USDC = 1 USD)</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span>Wide compatibility and support</span>
              </li>
            </ul>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-6">
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Do I need to create an account?
              </h4>
              <p className="text-gray-600">
                No! Simply connect your Web3 wallet and you&apos;re ready to use any AI agent. 
                Your wallet serves as your identity and payment method.
              </p>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                What wallets are supported?
              </h4>
              <p className="text-gray-600">
                We support Coinbase Wallet and any wallet that&apos;s compatible with WalletConnect or Web3 standards, 
                including MetaMask, Rainbow, and many others.
              </p>
            </div>
            
            <div className="border-b border-gray-200 pb-6">
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                How much does it cost?
              </h4>
              <p className="text-gray-600">
                Pricing varies by agent and is displayed clearly before use. Most requests cost between $0.01-$0.50 USDC. 
                You only pay for successful requests - failed requests are not charged.
              </p>
            </div>
            
            <div className="pb-6">
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                Is my data secure?
              </h4>
              <p className="text-gray-600">
                Yes, we don&apos;t store your requests or personal data. Each interaction is processed and forgotten. 
                Payments are handled directly through smart contracts on Base network.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
          <p className="text-gray-600 mb-6">
            Connect your wallet and start using AI agents with transparent pricing.
          </p>
          <Link href="/marketplace" className="btn-primary text-lg px-8 py-3">
            Browse AI Agents
          </Link>
        </div>
      </div>
    </div>
  )
}