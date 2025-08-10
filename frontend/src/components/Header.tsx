'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useWallet } from './WalletProvider'
import { WalletConnect } from './WalletConnect'
import { NetworkSwitcher } from './NetworkSwitcher'
import { Bot } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">x402 AI</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/">
                Home
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/marketplace">
                Marketplace
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/how-it-works">
                How it Works
              </Link>
            </Button>
          </nav>

          {/* Network Switcher & Wallet Connection */}
          <div className="flex items-center space-x-3">
            <NetworkSwitcher />
            <WalletConnect />
          </div>
        </div>
      </div>
    </header>
  )
}