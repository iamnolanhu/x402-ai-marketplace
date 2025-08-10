'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'
import CoinbaseWallet from '@coinbase/wallet-sdk'
import { ethers } from 'ethers'
import { SUPPORTED_CHAINS, ChainConfig, getChainConfig, getDefaultChain, WALLET_ERRORS, WalletError } from '../lib/wallet'

interface WalletContextType {
  isConnected: boolean
  address: string | null
  balance: string | null
  provider: ethers.BrowserProvider | null
  currentChain: ChainConfig | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  switchChain: (chainId: string) => Promise<void>
  isLoading: boolean
  error: string | null
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [currentChain, setCurrentChain] = useState<ChainConfig | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [wallet, setWallet] = useState<CoinbaseWallet | null>(null)

  useEffect(() => {
    // Initialize Coinbase Wallet SDK
    const coinbaseWallet = new CoinbaseWallet({
      appName: 'x402 AI Marketplace',
      appLogoUrl: '/logo.png',
    })
    setWallet(coinbaseWallet)

    // Check if already connected
    checkConnection(coinbaseWallet)
  }, [])

  const checkConnection = async (walletInstance: CoinbaseWallet) => {
    try {
      const ethereum = walletInstance.makeWeb3Provider()
      const accounts = await ethereum.request({ method: 'eth_accounts' }) as string[]
      
      if (accounts && accounts.length > 0) {
        const provider = new ethers.BrowserProvider(ethereum)
        setProvider(provider)
        setAddress(accounts[0])
        setIsConnected(true)
        
        // Get current chain ID
        const network = await provider.getNetwork()
        const chainConfig = getChainConfig(Number(network.chainId))
        setCurrentChain(chainConfig || null)
        
        // Get balance
        const balance = await provider.getBalance(accounts[0])
        setBalance(ethers.formatEther(balance))
      }
    } catch (error) {
      console.error('Error checking connection:', error)
      setError('Failed to check wallet connection')
    }
  }

  const connectWallet = async () => {
    if (!wallet) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const ethereum = wallet.makeWeb3Provider()
      
      // Request account access
      const accounts = await ethereum.request({ 
        method: 'eth_requestAccounts' 
      }) as string[]
      
      if (accounts && accounts.length > 0) {
        const provider = new ethers.BrowserProvider(ethereum)
        setProvider(provider)
        setAddress(accounts[0])
        setIsConnected(true)
        
        // Get current chain ID and set chain config
        const network = await provider.getNetwork()
        const chainConfig = getChainConfig(Number(network.chainId))
        setCurrentChain(chainConfig || null)
        
        // Get balance
        const balance = await provider.getBalance(accounts[0])
        setBalance(ethers.formatEther(balance))

        // If not on a supported chain, try to switch to default
        if (!chainConfig) {
          await switchChain('base-sepolia')
        }
      }
    } catch (error: any) {
      console.error('Failed to connect wallet:', error)
      const errorMessage = error.code === WALLET_ERRORS.USER_REJECTED_REQUEST 
        ? 'Connection rejected by user' 
        : 'Failed to connect wallet. Please try again.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const switchChain = async (chainId: string) => {
    if (!wallet || !provider) {
      throw new Error('Wallet not connected')
    }

    const chainConfig = getChainConfig(chainId)
    if (!chainConfig) {
      throw new Error('Unsupported chain')
    }

    setIsLoading(true)
    setError(null)

    try {
      const ethereum = wallet.makeWeb3Provider()
      
      // Try to switch to the chain
      try {
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainConfig.chainIdHex }],
        })
      } catch (switchError: any) {
        // If chain is not added, add it
        if (switchError.code === WALLET_ERRORS.CHAIN_NOT_ADDED) {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: chainConfig.chainIdHex,
              chainName: chainConfig.name,
              nativeCurrency: chainConfig.nativeCurrency,
              rpcUrls: chainConfig.rpcUrls,
              blockExplorerUrls: chainConfig.blockExplorerUrls,
            }],
          })
        } else {
          throw switchError
        }
      }

      // Update current chain
      setCurrentChain(chainConfig)
      
      // Update balance for new chain
      if (address) {
        const balance = await provider.getBalance(address)
        setBalance(ethers.formatEther(balance))
      }
    } catch (error: any) {
      console.error('Failed to switch chain:', error)
      const errorMessage = error.code === WALLET_ERRORS.USER_REJECTED_REQUEST 
        ? 'Chain switch rejected by user' 
        : `Failed to switch to ${chainConfig.name}`
      setError(errorMessage)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const disconnectWallet = useCallback(async () => {
    try {
      if (wallet) {
        const ethereum = wallet.makeWeb3Provider()
        await ethereum.disconnect()
      }
    } catch (error) {
      console.log('Disconnect error:', error)
    }
    setIsConnected(false)
    setAddress(null)
    setBalance(null)
    setProvider(null)
    setCurrentChain(null)
    setError(null)
  }, [wallet])

  // Listen for chain changes
  useEffect(() => {
    if (wallet) {
      const ethereum = wallet.makeWeb3Provider()
      
      const handleChainChanged = async (chainId: string) => {
        const chainConfig = getChainConfig(parseInt(chainId, 16))
        setCurrentChain(chainConfig || null)
        
        // Update balance for new chain
        if (address && provider) {
          try {
            const balance = await provider.getBalance(address)
            setBalance(ethers.formatEther(balance))
          } catch (error) {
            console.error('Failed to update balance after chain change:', error)
          }
        }
      }
      
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet()
        } else if (accounts[0] !== address) {
          setAddress(accounts[0])
          // Update balance for new account
          if (provider) {
            provider.getBalance(accounts[0])
              .then(balance => setBalance(ethers.formatEther(balance)))
              .catch(error => console.error('Failed to get balance:', error))
          }
        }
      }
      
      ethereum.on('chainChanged', handleChainChanged)
      ethereum.on('accountsChanged', handleAccountsChanged)
      
      return () => {
        ethereum.removeListener('chainChanged', handleChainChanged)
        ethereum.removeListener('accountsChanged', handleAccountsChanged)
      }
    }
  }, [wallet, address, provider, disconnectWallet])

  const value: WalletContextType = {
    isConnected,
    address,
    balance,
    provider,
    currentChain,
    connectWallet,
    disconnectWallet,
    switchChain,
    isLoading,
    error,
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}