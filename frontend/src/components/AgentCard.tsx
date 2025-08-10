'use client'

import Link from 'next/link'
import { Bot, Star, ArrowRight } from 'lucide-react'

interface AgentCardProps {
  agent: {
    id: string
    name: string
    description: string
    price: string
    currency: 'USDC' | 'ETH'
    category: string
    rating: number
    reviews: number
    image?: string
    isPopular?: boolean
  }
}

export function AgentCard({ agent }: AgentCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'image generation':
        return 'bg-blue-100 text-blue-800'
      case 'data analysis':
        return 'bg-green-100 text-green-800'
      case 'code assistant':
        return 'bg-purple-100 text-purple-800'
      case 'text generation':
        return 'bg-yellow-100 text-yellow-800'
      case 'audio processing':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    // For now, using Bot icon for all categories
    // In a real app, you'd have specific icons per category
    return <Bot className="w-5 h-5" />
  }

  return (
    <div className="card p-6 hover:shadow-lg transition-all duration-200 group">
      {agent.isPopular && (
        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mb-3">
          <Star className="w-3 h-3 mr-1" />
          Popular
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            agent.image ? 'bg-gray-100' : getCategoryColor(agent.category).replace('text-', 'text-').split(' ')[0]
          }`}>
            {agent.image ? (
              <div className="w-8 h-8 rounded bg-gray-200" />
            ) : (
              getCategoryIcon(agent.category)
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">{agent.name}</h3>
            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(agent.category)}`}>
              {agent.category}
            </span>
          </div>
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {agent.description}
      </p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium text-gray-900 ml-1">
              {agent.rating.toFixed(1)}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            ({agent.reviews} reviews)
          </span>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-gray-900">
            {agent.price} {agent.currency}
          </div>
          <div className="text-xs text-gray-500">per request</div>
        </div>
      </div>

      <Link 
        href={`/agent/${agent.id}`}
        className="btn-primary w-full flex items-center justify-center space-x-2 group-hover:bg-primary-700 transition-colors"
      >
        <span>Try Agent</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  )
}