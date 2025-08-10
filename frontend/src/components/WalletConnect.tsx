'use client'

import { useWallet } from './WalletProvider'
import { Wallet, ChevronDown, ExternalLink } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatAddress, formatBalance } from '../lib/wallet'

export function WalletConnect() {
  const { 
    isConnected, 
    address, 
    balance, 
    currentChain,
    connectWallet, 
    disconnectWallet, 
    isLoading,
    error 
  } = useWallet()
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)


  if (!isConnected) {
    return (
      <div className="flex flex-col items-end space-y-2">
        <Button
          onClick={connectWallet}
          disabled={isLoading}
          className="flex items-center space-x-2"
        >
          <Wallet className="w-4 h-4" />
          <span>{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
        </Button>
        {error && (
          <div className="text-xs text-destructive max-w-48 text-right">
            {error}
          </div>
        )}
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <Wallet className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="text-left">
            <div className="text-sm font-medium">
              {formatAddress(address!)}
            </div>
            <div className="text-xs text-muted-foreground">
              {balance ? `${formatBalance(balance)} ${currentChain?.nativeCurrency.symbol || 'ETH'}` : `0 ${currentChain?.nativeCurrency.symbol || 'ETH'}`}
            </div>
          </div>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end">
        <div className="px-4 py-2">
          <div className="text-sm font-medium">Wallet Info</div>
        </div>
        <DropdownMenuSeparator />
        
        <div className="px-4 py-3">
          <div className="text-xs text-muted-foreground mb-1">Address</div>
          <div className="text-sm font-mono break-all">{address}</div>
        </div>
        
        <div className="px-4 py-3">
          <div className="text-xs text-muted-foreground mb-1">Balance</div>
          <div className="text-sm">
            {balance ? `${formatBalance(balance)} ${currentChain?.nativeCurrency.symbol || 'ETH'}` : `0 ${currentChain?.nativeCurrency.symbol || 'ETH'}`}
          </div>
        </div>
        
        {currentChain && (
          <div className="px-4 py-3">
            <div className="text-xs text-muted-foreground mb-1">Network</div>
            <div className="text-sm">{currentChain.name}</div>
            <div className="text-xs text-muted-foreground">Chain ID: {currentChain.chainId}</div>
          </div>
        )}
        
        {currentChain?.blockExplorerUrls && address && (
          <div className="px-4 py-3">
            <a
              href={`${currentChain.blockExplorerUrls[0]}/address/${address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-xs text-primary hover:text-primary/80 transition-colors"
            >
              <span>View on Explorer</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => disconnectWallet()}
          className="text-destructive focus:text-destructive"
        >
          Disconnect Wallet
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}