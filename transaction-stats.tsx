"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Activity, DollarSign, Zap, TrendingUp, ArrowUpRight, ArrowDownLeft } from "lucide-react"

interface TransactionData {
  totalTransactions: number
  totalVolume: string
  totalGasSpent: string
  sentTransactions: number
  receivedTransactions: number
  swapTransactions: number
  successRate: number
}

interface TransactionStatsProps {
  data: { stats: TransactionData } | null | undefined
  loading: boolean
  timeframe: string
}

export default function TransactionStats({ data, loading, timeframe }: TransactionStatsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {[...Array(7)].map((_, i) => (
          <Card key={i} className="bg-gray-900/40 border-gray-700/50 backdrop-blur-md">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Skeleton className="w-4 h-4 bg-gray-700" />
                <Skeleton className="h-3 w-16 bg-gray-700" />
              </div>
              <Skeleton className="h-6 w-20 bg-gray-700" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!data?.stats) {
    return null
  }

  const stats = data.stats

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-md">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-gray-400">Total</span>
          </div>
          <p className="text-xl font-bold text-blue-400">{stats.totalTransactions}</p>
        </CardContent>
      </Card>

      <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-md">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="h-4 w-4 text-green-400" />
            <span className="text-sm text-gray-400">Volume</span>
          </div>
          <p className="text-xl font-bold text-green-400">${stats.totalVolume}</p>
        </CardContent>
      </Card>

      <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-md">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="h-4 w-4 text-yellow-400" />
            <span className="text-sm text-gray-400">Gas Spent</span>
          </div>
          <p className="text-xl font-bold text-yellow-400">{stats.totalGasSpent}</p>
        </CardContent>
      </Card>

      <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-md">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <ArrowUpRight className="h-4 w-4 text-red-400" />
            <span className="text-sm text-gray-400">Sent</span>
          </div>
          <p className="text-xl font-bold text-red-400">{stats.sentTransactions}</p>
        </CardContent>
      </Card>

      <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-md">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <ArrowDownLeft className="h-4 w-4 text-green-400" />
            <span className="text-sm text-gray-400">Received</span>
          </div>
          <p className="text-xl font-bold text-green-400">{stats.receivedTransactions}</p>
        </CardContent>
      </Card>

      <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-md">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-gray-400">Swaps</span>
          </div>
          <p className="text-xl font-bold text-purple-400">{stats.swapTransactions}</p>
        </CardContent>
      </Card>

      <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-md">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="h-4 w-4 text-orange-400" />
            <span className="text-sm text-gray-400">Success</span>
          </div>
          <p className="text-xl font-bold text-orange-400">{stats.successRate}%</p>
        </CardContent>
      </Card>
    </div>
  )
}
