"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RefreshCw, Download, TrendingUp, Activity, DollarSign, Users, BarChart3, AlertCircle } from "lucide-react"
import SwapVolumeChart from "./swap-volume-chart"
import SwapCountChart from "./swap-count-chart"
import { useSwapData } from "../hooks/use-swap-data"

const timeframes = [
  { label: "1 Day", value: "1d" },
  { label: "3 Days", value: "3d" },
  { label: "1 Week", value: "1w" },
  { label: "2 Weeks", value: "2w" },
  { label: "1 Month", value: "1m" },
  { label: "3 Months", value: "3m" },
]

export default function SwapTracker() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("1d")
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  // Custom hook for swap data with caching and real-time updates
  const { data, loading, error, refetch } = useSwapData(selectedTimeframe)

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refetch()
      setLastRefresh(new Date())
    }, 30000)

    return () => clearInterval(interval)
  }, [refetch])

  // Remember user's preferred timeframe
  useEffect(() => {
    const saved = localStorage.getItem("preferred-timeframe")
    if (saved && timeframes.find((tf) => tf.value === saved)) {
      setSelectedTimeframe(saved)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("preferred-timeframe", selectedTimeframe)
  }, [selectedTimeframe])

  const handleManualRefresh = () => {
    refetch()
    setLastRefresh(new Date())
  }

  const exportToCSV = () => {
    if (!data?.swaps) return

    const csv = [
      ["Timestamp", "Pair", "Type", "Amount", "Value USD", "Gas Fee", "User"],
      ...data.swaps.map((swap) => [
        swap.timestamp,
        swap.pair,
        swap.type,
        swap.amount,
        swap.valueUSD,
        swap.gasFee,
        swap.user,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `zer0-dex-swaps-${selectedTimeframe}-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Alert className="bg-red-900/20 border-red-800">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-200">
            Failed to load swap data. Please check your connection and try again.
          </AlertDescription>
        </Alert>
        <Button onClick={handleManualRefresh} variant="outline" className="border-gray-700">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Swap Tracker</h2>
          <p className="text-gray-400 text-sm">Last updated: {lastRefresh.toLocaleTimeString()}</p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-[140px] bg-gray-900/50 border-gray-800 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-800">
              {timeframes.map((tf) => (
                <SelectItem key={tf.value} value={tf.value} className="text-white hover:bg-gray-800">
                  {tf.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={handleManualRefresh}
            variant="outline"
            size="sm"
            disabled={loading}
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            onClick={exportToCSV}
            variant="outline"
            size="sm"
            disabled={loading || !data?.swaps?.length}
            className="border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatsCard
          title="Total Swaps"
          value={data?.totalSwaps}
          icon={<Activity className="h-5 w-5 text-blue-400" />}
          loading={loading}
          suffix=""
        />
        <StatsCard
          title="Total Volume"
          value={data?.totalVolume}
          icon={<DollarSign className="h-5 w-5 text-green-400" />}
          loading={loading}
          prefix="$"
        />
        <StatsCard
          title="Unique Users"
          value={data?.uniqueUsers}
          icon={<Users className="h-5 w-5 text-purple-400" />}
          loading={loading}
          suffix=""
        />
        <StatsCard
          title="Avg Swap Size"
          value={data?.avgSwapSize}
          icon={<BarChart3 className="h-5 w-5 text-orange-400" />}
          loading={loading}
          prefix="$"
        />
        <StatsCard
          title="Top Pair"
          value={data?.topPair}
          icon={<TrendingUp className="h-5 w-5 text-yellow-400" />}
          loading={loading}
          isText={true}
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <SwapVolumeChart data={data?.volumeChart} loading={loading} timeframe={selectedTimeframe} />
        <SwapCountChart data={data?.swapChart} loading={loading} timeframe={selectedTimeframe} />
      </div>

      {/* Top Trading Pairs */}
      <TopTradingPairs pairs={data?.topPairs} loading={loading} timeframe={selectedTimeframe} />
    </div>
  )
}

interface StatsCardProps {
  title: string
  value: string | number | undefined
  icon: React.ReactNode
  loading: boolean
  prefix?: string
  suffix?: string
  isText?: boolean
}

function StatsCard({ title, value, icon, loading, prefix = "", suffix = "", isText = false }: StatsCardProps) {
  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2 mb-2">
          {icon}
          <span className="text-sm text-gray-400">{title}</span>
        </div>
        {loading ? (
          <Skeleton className="h-6 w-20 bg-gray-800" />
        ) : (
          <p className={`text-lg font-bold ${isText ? "text-white text-sm" : "text-white"}`}>
            {isText ? value : `${prefix}${typeof value === "number" ? value.toLocaleString() : value}${suffix}`}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

interface TopTradingPairsProps {
  pairs:
    | Array<{
        pair: string
        volume: string
        swaps: number
        change: number
      }>
    | undefined
  loading: boolean
  timeframe: string
}

function TopTradingPairs({ pairs, loading, timeframe }: TopTradingPairsProps) {
  if (loading) {
    return (
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Top Trading Pairs</CardTitle>
          <CardDescription className="text-gray-400">Most active pairs by volume</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-gray-800/30">
                <div className="flex items-center space-x-4">
                  <Skeleton className="w-8 h-8 rounded-full bg-gray-700" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20 bg-gray-700" />
                    <Skeleton className="h-3 w-16 bg-gray-700" />
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <Skeleton className="h-4 w-24 bg-gray-700" />
                  <Skeleton className="h-3 w-16 bg-gray-700" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!pairs || pairs.length === 0) {
    return (
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Top Trading Pairs</CardTitle>
          <CardDescription className="text-gray-400">Most active pairs by volume</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No trading data available for {timeframe}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Top Trading Pairs</CardTitle>
        <CardDescription className="text-gray-400">Most active pairs by volume ({timeframe})</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pairs.map((pair, index) => (
            <div
              key={pair.pair}
              className="flex items-center justify-between p-4 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-white font-medium">{pair.pair}</h3>
                  <p className="text-gray-400 text-sm">{pair.swaps} swaps</p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-white font-medium">{pair.volume}</p>
                <Badge
                  variant={pair.change >= 0 ? "default" : "secondary"}
                  className={`${
                    pair.change >= 0 ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
                  } text-xs`}
                >
                  {pair.change >= 0 ? "+" : ""}
                  {pair.change.toFixed(2)}%
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
