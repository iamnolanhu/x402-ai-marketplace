'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useWallet } from '@/components/WalletProvider'
import { PaymentModal } from '@/components/PaymentModal'
import { AgentInvokeForm } from '@/components/AgentInvokeForm'
import { Bot, Star, Clock, Shield, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// Mock agent data - in real app this would come from API
const getAgentById = (id: string) => {
  const agents = {
    'image-gen-pro': {
      id: 'image-gen-pro',
      name: 'Image Generator Pro',
      description: 'Advanced AI image generation with custom styles, high resolution output, and multiple format support. Perfect for creative professionals and content creators.',
      longDescription: 'Image Generator Pro uses state-of-the-art diffusion models to create stunning, high-quality images from text descriptions. Features include multiple art styles, aspect ratios, resolution up to 4K, batch generation, and custom model fine-tuning.',
      price: '0.10',
      currency: 'USDC' as const,
      category: 'Image Generation',
      rating: 4.8,
      reviews: 1247,
      isPopular: true,
      features: [
        'Multiple art styles (realistic, artistic, cartoon, etc.)',
        'High resolution output up to 4K',
        'Batch generation (up to 10 images)',
        'Custom aspect ratios',
        'Negative prompts support',
        'Style transfer capabilities'
      ],
      avgResponseTime: '15-30 seconds',
      provider: 'AI Labs Inc.',
      lastUpdated: '2024-08-01'
    },
    'data-analyzer': {
      id: 'data-analyzer',
      name: 'Data Analyzer',
      description: 'Powerful data analysis and visualization tool that can process CSV files, generate insights, and create beautiful charts and graphs.',
      longDescription: 'Data Analyzer leverages advanced machine learning algorithms to automatically discover patterns, correlations, and insights in your datasets. Upload CSV files and receive comprehensive analysis reports with interactive visualizations.',
      price: '0.05',
      currency: 'USDC' as const,
      category: 'Data Analysis',
      rating: 4.6,
      reviews: 892,
      features: [
        'Automatic pattern detection',
        'Statistical analysis and correlations',
        'Interactive charts and graphs',
        'Data cleaning and preprocessing', 
        'Trend analysis and forecasting',
        'Export results in multiple formats'
      ],
      avgResponseTime: '30-60 seconds',
      provider: 'DataCorp Analytics',
      lastUpdated: '2024-07-28'
    },
    'code-assistant': {
      id: 'code-assistant',
      name: 'Code Assistant',
      description: 'AI-powered code generation, debugging, and optimization assistant supporting multiple programming languages and frameworks.',
      longDescription: 'Code Assistant is trained on millions of code repositories to help you write better code faster. Get code suggestions, bug fixes, optimizations, and explanations across 50+ programming languages.',
      price: '0.02',
      currency: 'USDC' as const,
      category: 'Code Assistant',
      rating: 4.7,
      reviews: 2103,
      isPopular: true,
      features: [
        'Support for 50+ programming languages',
        'Code generation and completion',
        'Bug detection and fixing',
        'Performance optimization suggestions',
        'Code documentation generation',
        'Framework-specific best practices'
      ],
      avgResponseTime: '5-15 seconds',
      provider: 'DevTools AI',
      lastUpdated: '2024-08-05'
    }
  }
  
  return agents[id as keyof typeof agents] || null
}

export default function AgentDetailPage() {
  const params = useParams()
  const agentId = params.id as string
  const { isConnected } = useWallet()
  
  const [agent, setAgent] = useState<any>(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      const agentData = getAgentById(agentId)
      setAgent(agentData)
      setIsLoading(false)
    }, 500)
  }, [agentId])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-8"></div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Agent not found</h3>
          <p className="text-gray-600 mb-4">
            The agent you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link href="/marketplace" className="btn-primary">
            Browse Agents
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link 
        href="/marketplace"
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Marketplace
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Agent Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Bot className="w-8 h-8 text-primary-600" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{agent.name}</h1>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="text-lg font-medium text-gray-900 ml-1">
                        {agent.rating.toFixed(1)}
                      </span>
                      <span className="text-gray-500 ml-1">({agent.reviews} reviews)</span>
                    </div>
                    {agent.isPopular && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                        Popular
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <p className="text-lg text-gray-600 leading-relaxed">{agent.longDescription}</p>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {agent.features.map((feature: string, index: number) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Response Time</div>
                <div className="font-medium text-gray-900">{agent.avgResponseTime}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Provider</div>
                <div className="font-medium text-gray-900">{agent.provider}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Bot className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-500">Last Updated</div>
                <div className="font-medium text-gray-900">
                  {new Date(agent.lastUpdated).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-8">
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-gray-900">
                {agent.price} {agent.currency}
              </div>
              <div className="text-gray-500">per request</div>
            </div>

            {!isConnected ? (
              <div className="text-center">
                <p className="text-gray-600 mb-4">Connect your wallet to use this agent</p>
                {/* The wallet connect button is handled by the WalletConnect component in header */}
              </div>
            ) : (
              <AgentInvokeForm 
                agent={agent}
                onPaymentRequired={() => setShowPaymentModal(true)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal 
          agent={agent}
          onClose={() => setShowPaymentModal(false)}
          onPaymentComplete={() => {
            setShowPaymentModal(false)
            // Handle successful payment
          }}
        />
      )}
    </div>
  )
}