'use client'

import { useState } from 'react'
import { Send, Upload, Loader2 } from 'lucide-react'

interface AgentInvokeFormProps {
  agent: {
    id: string
    name: string
    price: string
    currency: 'USDC' | 'ETH'
    category: string
  }
  onPaymentRequired: () => void
}

export function AgentInvokeForm({ agent, onPaymentRequired }: AgentInvokeFormProps) {
  const [input, setInput] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<any>(null)

  const getInputPlaceholder = () => {
    switch (agent.category) {
      case 'Image Generation':
        return 'Describe the image you want to generate... (e.g., "A futuristic city at sunset with flying cars")'
      case 'Data Analysis':
        return 'Describe what analysis you need or upload a CSV file...'
      case 'Code Assistant':
        return 'Describe the code you need help with... (e.g., "Create a React component for user authentication")'
      case 'Text Generation':
        return 'Describe the content you need... (e.g., "Write a blog post about sustainable energy")'
      case 'Audio Processing':
        return 'Enter the text you want to convert to speech...'
      default:
        return 'Enter your request...'
    }
  }

  const acceptedFileTypes = () => {
    switch (agent.category) {
      case 'Data Analysis':
        return '.csv,.xlsx,.json'
      case 'Image Generation':
        return 'image/*'
      case 'Audio Processing':
        return 'audio/*'
      default:
        return '*'
    }
  }

  const showFileUpload = () => {
    return ['Data Analysis', 'Image Generation', 'Audio Processing'].includes(agent.category)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.trim() && !file) {
      alert('Please provide input or upload a file')
      return
    }

    // For demo purposes, show payment modal immediately
    // In a real app, you'd first make a request to the agent and get a 402 response
    onPaymentRequired()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Text Input */}
        <div>
          <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
            Request
          </label>
          <textarea
            id="input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={getInputPlaceholder()}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          />
        </div>

        {/* File Upload */}
        {showFileUpload() && (
          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
              Upload File (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
              <input
                id="file"
                type="file"
                accept={acceptedFileTypes()}
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="file"
                className="cursor-pointer flex flex-col items-center justify-center space-y-2"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                {file ? (
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">{file.name}</div>
                    <div className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-sm text-gray-600">Click to upload file</div>
                    <div className="text-xs text-gray-500">
                      {agent.category === 'Data Analysis' && 'CSV, Excel, or JSON files'}
                      {agent.category === 'Image Generation' && 'Reference images'}
                      {agent.category === 'Audio Processing' && 'Audio files'}
                    </div>
                  </div>
                )}
              </label>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing || (!input.trim() && !file)}
          className="btn-primary w-full flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Invoke Agent ({agent.price} {agent.currency})</span>
            </>
          )}
        </button>
      </form>

      {/* Result Display */}
      {result && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Result</h4>
          <div className="text-gray-700">
            {/* This would display the actual result from the agent */}
            <div className="bg-white p-3 rounded border">
              Result would be displayed here...
            </div>
          </div>
        </div>
      )}

      {/* Pricing Info */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        You&apos;ll be charged {agent.price} {agent.currency} for each request
      </div>
    </div>
  )
}