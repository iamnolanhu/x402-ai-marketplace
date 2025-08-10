'use client'

import { ExternalLink, Beaker } from 'lucide-react'
import { useWallet } from './WalletProvider'

export function FaucetLinks() {
  const { currentChain, isConnected } = useWallet()

  if (!isConnected || !currentChain || !currentChain.isTestnet || !currentChain.faucetUrls) {
    return null
  }

  const { faucetUrls } = currentChain

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <Beaker className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            Get Test Tokens for {currentChain.name}
          </h3>
          <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">
            Get free test tokens to try out the AI marketplace without spending real money.
          </p>
          
          <div className="space-y-2">
            {faucetUrls.native && (
              <a
                href={faucetUrls.native}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-3 py-2 bg-blue-100 dark:bg-blue-800/50 text-blue-800 dark:text-blue-200 rounded-md hover:bg-blue-200 dark:hover:bg-blue-700/50 transition-colors text-sm"
              >
                <span>Get Test {currentChain.nativeCurrency.symbol}</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            
            {faucetUrls.usdc && (
              <a
                href={faucetUrls.usdc}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-3 py-2 bg-green-100 dark:bg-green-800/50 text-green-800 dark:text-green-200 rounded-md hover:bg-green-200 dark:hover:bg-green-700/50 transition-colors text-sm ml-2"
              >
                <span>Get Test USDC</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
          
          <div className="mt-3 text-xs text-blue-600 dark:text-blue-400">
            <p>
              💡 <strong>Tip:</strong> You&apos;ll need both {currentChain.nativeCurrency.symbol} for gas fees and USDC to pay for AI services.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function FaucetLinksCard() {
  const { currentChain } = useWallet()

  if (!currentChain || !currentChain.isTestnet) {
    return null
  }

  const faucetLinks = [
    {
      network: 'Ethereum Sepolia',
      tokens: [
        { name: 'Test ETH', url: 'https://sepoliafaucet.com/', color: 'blue' },
        { name: 'Test USDC', url: 'https://faucet.circle.com/', color: 'green' }
      ]
    },
    {
      network: 'Base Sepolia', 
      tokens: [
        { name: 'Test ETH', url: 'https://www.coinbase.com/faucets/base-ethereum-goerli-faucet', color: 'blue' },
        { name: 'Test USDC', url: 'https://faucet.circle.com/', color: 'green' }
      ]
    }
  ]

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Beaker className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Testnet Faucets
        </h2>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Get free test tokens to interact with AI agents without spending real money.
      </p>

      <div className="space-y-4">
        {faucetLinks.map((network) => (
          <div key={network.network} className="border border-gray-100 dark:border-gray-700 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">
              {network.network}
            </h3>
            <div className="flex flex-wrap gap-2">
              {network.tokens.map((token) => (
                <a
                  key={token.name}
                  href={token.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    token.color === 'blue'
                      ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-200 dark:hover:bg-blue-800/50'
                      : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-200 dark:hover:bg-green-800/50'
                  }`}
                >
                  <span>{token.name}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>Note:</strong> These are testnet tokens with no real value. You&apos;ll need both ETH (for gas fees) and USDC (for payments) to use the AI marketplace.
        </p>
      </div>
    </div>
  )
}