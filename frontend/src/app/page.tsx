'use client'

import Link from 'next/link'
import { Bot, Zap, Shield, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FaucetLinksCard, FaucetLinks } from '../components/FaucetLinks'
import { useWallet } from '../components/WalletProvider'

export default function Home() {
  const { isConnected, currentChain } = useWallet()
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Faucet Links for Testnet Users */}
      {isConnected && currentChain?.isTestnet && (
        <div className="mb-8">
          <FaucetLinks />
        </div>
      )}
      {/* Hero Section */}
      <section className="text-center py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            AI Agents That
            <span className="text-primary-600"> Actually Pay</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Discover and interact with AI agents using the x402 payment protocol. 
            Pay only for what you use, powered by USDC on Base.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-3">
              <Link href="/marketplace">
                Explore Agents
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3">
              <Link href="/how-it-works">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose x402 AI Marketplace?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Diverse AI Agents</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  From image generation to data analysis, find the perfect AI agent for your needs.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Pay-Per-Use</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  No subscriptions. Pay only for the AI services you actually use with USDC.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Instant Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Lightning-fast payments on Base network with minimal fees.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Secure & Transparent</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Transparent pricing with secure blockchain-based payments.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Agents Preview */}
      <section className="py-16 bg-white rounded-2xl mx-4">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Agents</h2>
            <Link 
              href="/marketplace"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View All →
            </Link>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Sample Featured Agents */}
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Bot className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg">Image Generator Pro</CardTitle>
                <CardDescription>
                  Advanced AI image generation with custom styles and high resolution output.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">$0.10 USDC per image</span>
                  <Button asChild variant="link" size="sm">
                    <Link href="/agent/image-gen">
                      Try Now →
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Bot className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg">Data Analyzer</CardTitle>
                <CardDescription>
                  Powerful data analysis and visualization for your datasets.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">$0.05 USDC per query</span>
                  <Button asChild variant="link" size="sm">
                    <Link href="/agent/data-analyzer">
                      Try Now →
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Bot className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-lg">Code Assistant</CardTitle>
                <CardDescription>
                  AI-powered code generation and debugging assistance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">$0.02 USDC per request</span>
                  <Button asChild variant="link" size="sm">
                    <Link href="/agent/code-assistant">
                      Try Now →
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Faucet Information for Testnet */}
      {(!isConnected || currentChain?.isTestnet) && (
        <section className="py-16">
          <div className="max-w-4xl mx-auto">
            <FaucetLinksCard />
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="text-center py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Connect your wallet and start using AI agents with transparent, pay-per-use pricing.
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-3">
            <Link href="/marketplace">
              Browse AI Agents
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}