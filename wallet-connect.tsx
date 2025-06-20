"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, Copy, ExternalLink } from "lucide-react"

export default function WalletConnect() {
  const [isConnected, setIsConnected] = useState(false)
  const [address, setAddress] = useState("")

  const connectWallet = async () => {
    // Mock wallet connection - replace with real Web3 integration
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        // Simulate connection
        const mockAddress = "0x742d35Cc6634C0532925a3b8D4C9db96590b5c8e"
        setAddress(mockAddress)
        setIsConnected(true)
      } catch (error) {
        console.error("Failed to connect wallet:", error)
      }
    } else {
      alert("Please install MetaMask or another Web3 wallet")
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setAddress("")
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(address)
  }

  if (isConnected) {
    return (
      <div className="flex items-center space-x-2">
        <Badge variant="outline" className="text-green-400 border-green-400">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
          Connected
        </Badge>
        <div className="flex items-center space-x-1 bg-gray-800 rounded-lg px-3 py-2">
          <span className="text-sm text-gray-300 font-mono">
            {address.slice(0, 6)}...{address.slice(-4)}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={copyAddress}
            className="h-6 w-6 p-0 text-gray-400 hover:text-white"
          >
            <Copy className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={disconnectWallet}
            className="h-6 w-6 p-0 text-gray-400 hover:text-white"
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Button onClick={connectWallet} variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
      <Wallet className="h-4 w-4 mr-2" />
      Connect Wallet
    </Button>
  )
}
