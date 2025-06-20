"use client"

import { useState, useEffect, useCallback } from "react"

interface SwapData {
  totalSwaps: number
  totalVolume: string
  uniqueUsers: number
  avgSwapSize: string
  topPair: string
  volumeChart: Array<{
    time: string
    volume: number
    timestamp: number
  }>
  swapChart: Array<{
    time: string
    swaps: number
    timestamp: number
  }>
  topPairs: Array<{
    pair: string
    volume: string
    swaps: number
    change: number
  }>
  swaps: Array<{
    timestamp: string
    pair: string
    type: string
    amount: string
    valueUSD: string
    gasFee: string
    user: string
  }>
}

// Cache for API responses (1 minute cache)
const cache = new Map<string, { data: SwapData; timestamp: number }>()
const CACHE_DURATION = 60 * 1000 // 1 minute

export function useSwapData(timeframe: string) {
  const [data, setData] = useState<SwapData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSwapData = useCallback(async (tf: string): Promise<SwapData> => {
    // Check cache first
    const cacheKey = `swap-data-${tf}`
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data
    }

    // Simulate API call to 0G Galileo Testnet
    // Replace this with actual Web3 calls to parse swap events
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock data based on timeframe
    const mockData: SwapData = {
      totalSwaps:
        tf === "1d"
          ? 1247
          : tf === "3d"
            ? 3891
            : tf === "1w"
              ? 8934
              : tf === "2w"
                ? 17234
                : tf === "1m"
                  ? 45678
                  : 123456,
      totalVolume:
        tf === "1d"
          ? "2,847,392"
          : tf === "3d"
            ? "8,234,567"
            : tf === "1w"
              ? "18,945,234"
              : tf === "2w"
                ? "34,567,890"
                : tf === "1m"
                  ? "89,234,567"
                  : "234,567,890",
      uniqueUsers:
        tf === "1d" ? 342 : tf === "3d" ? 891 : tf === "1w" ? 1834 : tf === "2w" ? 3456 : tf === "1m" ? 7890 : 15678,
      avgSwapSize:
        tf === "1d"
          ? "2,284"
          : tf === "3d"
            ? "2,118"
            : tf === "1w"
              ? "2,121"
              : tf === "2w"
                ? "2,006"
                : tf === "1m"
                  ? "1,956"
                  : "1,901",
      topPair: "ETH/USDC",
      volumeChart: generateVolumeChart(tf),
      swapChart: generateSwapChart(tf),
      topPairs: [
        { pair: "ETH/USDC", volume: "$1,234,567", swaps: 1247, change: 5.67 },
        { pair: "BTC/ETH", volume: "$987,654", swaps: 892, change: -2.34 },
        { pair: "USDC/DAI", volume: "$654,321", swaps: 567, change: 0.12 },
        { pair: "ETH/BTC", volume: "$543,210", swaps: 423, change: 3.45 },
        { pair: "USDT/USDC", volume: "$432,109", swaps: 334, change: -0.05 },
      ],
      swaps: generateSwapHistory(tf),
    }

    // Cache the result
    cache.set(cacheKey, { data: mockData, timestamp: Date.now() })

    return mockData
  }, [])

  const refetch = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const newData = await fetchSwapData(timeframe)
      setData(newData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch swap data")
    } finally {
      setLoading(false)
    }
  }, [timeframe, fetchSwapData])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { data, loading, error, refetch }
}

function generateVolumeChart(timeframe: string) {
  const points =
    timeframe === "1d"
      ? 24
      : timeframe === "3d"
        ? 72
        : timeframe === "1w"
          ? 168
          : timeframe === "2w"
            ? 336
            : timeframe === "1m"
              ? 720
              : 2160
  const data = []

  for (let i = 0; i < Math.min(points, 50); i++) {
    const timestamp = Date.now() - (points - i) * (timeframe === "1d" ? 3600000 : 86400000)
    data.push({
      time:
        timeframe === "1d"
          ? new Date(timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
          : new Date(timestamp).toLocaleDateString(),
      volume: Math.floor(Math.random() * 100000) + 20000,
      timestamp,
    })
  }

  return data
}

function generateSwapChart(timeframe: string) {
  const points =
    timeframe === "1d"
      ? 24
      : timeframe === "3d"
        ? 3
        : timeframe === "1w"
          ? 7
          : timeframe === "2w"
            ? 14
            : timeframe === "1m"
              ? 30
              : 90
  const data = []

  for (let i = 0; i < points; i++) {
    const timestamp = Date.now() - (points - i) * (timeframe === "1d" ? 3600000 : 86400000)
    data.push({
      time:
        timeframe === "1d"
          ? new Date(timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
          : new Date(timestamp).toLocaleDateString(),
      swaps: Math.floor(Math.random() * 200) + 50,
      timestamp,
    })
  }

  return data
}

function generateSwapHistory(timeframe: string) {
  const count = timeframe === "1d" ? 50 : timeframe === "3d" ? 150 : 300
  const swaps = []

  for (let i = 0; i < count; i++) {
    const timestamp = new Date(
      Date.now() - Math.random() * (timeframe === "1d" ? 86400000 : timeframe === "3d" ? 259200000 : 604800000),
    )
    swaps.push({
      timestamp: timestamp.toISOString(),
      pair: ["ETH/USDC", "BTC/ETH", "USDC/DAI", "ETH/BTC"][Math.floor(Math.random() * 4)],
      type: Math.random() > 0.5 ? "Buy" : "Sell",
      amount: `${(Math.random() * 10 + 0.1).toFixed(2)} ETH`,
      valueUSD: `$${(Math.random() * 25000 + 1000).toFixed(2)}`,
      gasFee: `${(Math.random() * 0.01 + 0.0001).toFixed(4)} A0GI`,
      user: `0x${Math.random().toString(16).substr(2, 8)}...`,
    })
  }

  return swaps.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}
