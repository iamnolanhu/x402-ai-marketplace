'use client'

import { ChevronDown, Globe, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useWallet } from './WalletProvider'
import { SUPPORTED_CHAINS } from '../lib/wallet'

export function NetworkSwitcher() {
  const { currentChain, switchChain, isLoading } = useWallet()

  const handleSwitchChain = async (chainId: string) => {
    try {
      await switchChain(chainId)
    } catch (error) {
      console.error('Failed to switch chain:', error)
    }
  }

  const supportedChains = Object.values(SUPPORTED_CHAINS)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          disabled={isLoading}
          className="flex items-center space-x-2"
        >
          <Globe className="w-4 h-4" />
          <span className="text-sm font-medium">
            {currentChain ? currentChain.name : 'Select Network'}
          </span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {supportedChains.map((chain) => (
          <DropdownMenuItem
            key={chain.id}
            onClick={() => handleSwitchChain(chain.id)}
            disabled={isLoading}
            className="flex items-center justify-between p-3"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">
                  {chain.name.split(' ').map(word => word[0]).join('')}
                </span>
              </div>
              <div>
                <div className="text-sm font-medium">
                  {chain.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  Chain ID: {chain.chainId}
                </div>
              </div>
            </div>
            {currentChain?.id === chain.id && (
              <Check className="w-4 h-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}