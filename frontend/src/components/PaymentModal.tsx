'use client'

import { useState } from 'react'
import { useWallet } from './WalletProvider'
import { X, CreditCard, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { ethers } from 'ethers'

interface PaymentModalProps {
  agent: {
    id: string
    name: string
    price: string
    currency: 'USDC' | 'ETH'
  }
  onClose: () => void
  onPaymentComplete: () => void
}

export function PaymentModal({ agent, onClose, onPaymentComplete }: PaymentModalProps) {
  const { provider, address } = useWallet()
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [txHash, setTxHash] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const handlePayment = async () => {
    if (!provider || !address) {
      setErrorMessage('Wallet not connected')
      return
    }

    setPaymentStatus('processing')
    setErrorMessage('')

    try {
      // In a real implementation, you would:
      // 1. Get the payment address from the x402 server response
      // 2. Create and send a USDC transaction
      // 3. Submit the payment proof to get the service

      // For demo purposes, we'll simulate a payment
      const signer = await provider.getSigner()
      
      // Simulate payment transaction (in real app, this would be to the x402 payment address)
      const tx = await signer.sendTransaction({
        to: '0x1234567890123456789012345678901234567890', // Mock payment address
        value: ethers.parseEther(agent.currency === 'ETH' ? agent.price : '0'),
        // In real app, you'd include USDC contract interaction here
      })

      setTxHash(tx.hash)
      
      // Wait for transaction confirmation
      await tx.wait()
      
      // In a real app, you would now call the agent service with the payment proof
      setPaymentStatus('success')
      
      setTimeout(() => {
        onPaymentComplete()
      }, 2000)

    } catch (error: any) {
      console.error('Payment failed:', error)
      setPaymentStatus('error')
      setErrorMessage(error.message || 'Payment failed. Please try again.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Complete Payment</h3>
          <button
            onClick={onClose}
            disabled={paymentStatus === 'processing'}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {paymentStatus === 'idle' && (
            <div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-primary-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  Pay for {agent.name}
                </h4>
                <p className="text-gray-600">
                  You&apos;ll be charged <strong>{agent.price} {agent.currency}</strong> for this request
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Service</span>
                  <span className="font-medium">{agent.name}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Price</span>
                  <span className="font-medium">{agent.price} {agent.currency}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Network Fee</span>
                  <span className="font-medium">~$0.01</span>
                </div>
              </div>

              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                    <span className="text-red-700 text-sm">{errorMessage}</span>
                  </div>
                </div>
              )}

              <button
                onClick={handlePayment}
                className="btn-primary w-full"
              >
                Pay {agent.price} {agent.currency}
              </button>
            </div>
          )}

          {paymentStatus === 'processing' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-yellow-600 animate-spin" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Processing Payment
              </h4>
              <p className="text-gray-600 mb-4">
                Please confirm the transaction in your wallet and wait for confirmation.
              </p>
              {txHash && (
                <p className="text-xs text-gray-500 break-all">
                  Transaction: {txHash}
                </p>
              )}
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Payment Successful!
              </h4>
              <p className="text-gray-600 mb-4">
                Your payment has been confirmed. The agent is now processing your request.
              </p>
              {txHash && (
                <p className="text-xs text-gray-500 break-all mb-4">
                  Transaction: {txHash}
                </p>
              )}
            </div>
          )}

          {paymentStatus === 'error' && (
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Payment Failed
              </h4>
              <p className="text-gray-600 mb-4">{errorMessage}</p>
              <div className="flex gap-3">
                <button onClick={onClose} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setPaymentStatus('idle')
                    setErrorMessage('')
                  }}
                  className="btn-primary flex-1"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}