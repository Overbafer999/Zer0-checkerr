"use client"

import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function NetworkStatus() {
  // Mock network data - replace with real RPC calls
  const networkData = {
    status: "online",
    blockHeight: 1234567,
    gasPrice: "0.0001",
    tps: 15.7,
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Badge variant="outline" className="text-green-400 border-green-400 hover:bg-green-400/10">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
            Block #{networkData.blockHeight.toLocaleString()}
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="bg-gray-900 border-gray-700">
          <div className="text-sm space-y-1">
            <p>
              Status: <span className="text-green-400">Online</span>
            </p>
            <p>Gas Price: {networkData.gasPrice} A0GI</p>
            <p>TPS: {networkData.tps}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
