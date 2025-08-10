import Link from 'next/link'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <Search className="w-12 h-12 text-gray-400" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link href="/" className="btn-primary flex items-center space-x-2">
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </Link>
          <Link href="/marketplace" className="btn-secondary">
            Browse Agents
          </Link>
        </div>
      </div>
    </div>
  )
}