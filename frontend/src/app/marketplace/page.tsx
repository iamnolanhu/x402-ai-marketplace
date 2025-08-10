'use client'

import { useState, useMemo } from 'react'
import { AgentCard } from '@/components/AgentCard'
import { Search, Filter, SlidersHorizontal } from 'lucide-react'

// Mock data - in a real app this would come from an API
const mockAgents = [
  {
    id: 'image-gen-pro',
    name: 'Image Generator Pro',
    description: 'Advanced AI image generation with custom styles, high resolution output, and multiple format support. Perfect for creative professionals and content creators.',
    price: '0.10',
    currency: 'USDC' as const,
    category: 'Image Generation',
    rating: 4.8,
    reviews: 1247,
    isPopular: true,
  },
  {
    id: 'data-analyzer',
    name: 'Data Analyzer',
    description: 'Powerful data analysis and visualization tool that can process CSV files, generate insights, and create beautiful charts and graphs.',
    price: '0.05',
    currency: 'USDC' as const,
    category: 'Data Analysis',
    rating: 4.6,
    reviews: 892,
  },
  {
    id: 'code-assistant',
    name: 'Code Assistant',
    description: 'AI-powered code generation, debugging, and optimization assistant supporting multiple programming languages and frameworks.',
    price: '0.02',
    currency: 'USDC' as const,
    category: 'Code Assistant',
    rating: 4.7,
    reviews: 2103,
    isPopular: true,
  },
  {
    id: 'text-writer',
    name: 'Content Writer AI',
    description: 'Professional content generation for blogs, articles, marketing copy, and social media posts with SEO optimization.',
    price: '0.03',
    currency: 'USDC' as const,
    category: 'Text Generation',
    rating: 4.5,
    reviews: 756,
  },
  {
    id: 'voice-synthesis',
    name: 'Voice Synthesizer',
    description: 'High-quality text-to-speech conversion with multiple voices, languages, and custom voice cloning capabilities.',
    price: '0.08',
    currency: 'USDC' as const,
    category: 'Audio Processing',
    rating: 4.4,
    reviews: 433,
  },
  {
    id: 'translation-pro',
    name: 'Translation Pro',
    description: 'Professional-grade translation service supporting 100+ languages with context awareness and cultural adaptation.',
    price: '0.01',
    currency: 'USDC' as const,
    category: 'Text Generation',
    rating: 4.9,
    reviews: 1888,
    isPopular: true,
  },
]

const categories = [
  'All Categories',
  'Image Generation',
  'Data Analysis', 
  'Code Assistant',
  'Text Generation',
  'Audio Processing'
]

const sortOptions = [
  { label: 'Most Popular', value: 'popular' },
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Lowest Price', value: 'price-low' },
  { label: 'Highest Price', value: 'price-high' },
  { label: 'Most Reviews', value: 'reviews' },
]

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [sortBy, setSortBy] = useState('popular')
  const [showFilters, setShowFilters] = useState(false)

  const filteredAndSortedAgents = useMemo(() => {
    let filtered = mockAgents.filter(agent => {
      const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          agent.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'All Categories' || agent.category === selectedCategory
      
      return matchesSearch && matchesCategory
    })

    // Sort agents
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'price-low':
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
        break
      case 'price-high':
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
        break
      case 'reviews':
        filtered.sort((a, b) => b.reviews - a.reviews)
        break
      case 'popular':
      default:
        filtered.sort((a, b) => {
          if (a.isPopular && !b.isPopular) return -1
          if (!a.isPopular && b.isPopular) return 1
          return b.rating - a.rating
        })
        break
    }

    return filtered
  }, [searchTerm, selectedCategory, sortBy])

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Agent Marketplace</h1>
        <p className="text-gray-600">
          Discover and interact with AI agents using transparent, pay-per-use pricing
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search agents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="w-4 h-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredAndSortedAgents.length} of {mockAgents.length} agents
        </p>
      </div>

      {/* Agent Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredAndSortedAgents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      {/* No Results */}
      {filteredAndSortedAgents.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No agents found</h3>
          <p className="text-gray-600 mb-4">
            Try adjusting your search criteria or browse all categories
          </p>
          <button
            onClick={() => {
              setSearchTerm('')
              setSelectedCategory('All Categories')
            }}
            className="btn-primary"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  )
}