"use client"

import { useState, useEffect, useCallback } from "react"

interface Transaction {
  hash: string
  timestamp: string
  from: string
  to: string
  amount: string
  token: string
  type: "Send" | "Receive" | "Swap"
  gasFee: string
  status: "Success" | "Failed"
  blockNumber: number
}

interface TransactionData {
  transactions: Transaction[]
  stats: {
    totalTransactions: number
    totalVolume: string
    totalGasSpent: string
    sentTransactions: number
    receivedTransactions: number
    swapTransactions: number
    successRate: number
  }
}

// Cache for API responses (1 minute cache)
const cache = new Map<string, { data: TransactionData; timestamp: number }>()
const CACHE_DURATION = 60 * 1000 // 1 minute

export function useWalletTransactions(address: string, timeframe: string) {
  const [data, setData] = useState<TransactionData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = useCallback(async (addr: string, tf: string): Promise<TransactionData> => {
    if (!addr) throw new Error("No address provided")

    // Check cache first
    const cacheKey = `transactions-${addr}-${tf}`
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data
    }

    // Simulate API call to 0G Galileo Testnet
    // Replace this with actual Web3 calls
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock transaction data
    const mockTransactions: Transaction[] = generateMockTransactions(addr, tf)
    const stats = calculateStats(mockTransactions)

    const result: TransactionData = {
      transactions: mockTransactions,
      stats,
    }

    // Cache the result
    cache.set(cacheKey, { data: result, timestamp: Date.now() })

    return result
  }, [])

  const refetch = useCallback(async () => {
    if (!address) return

    try {
      setLoading(true)
      setError(null)
      const newData = await fetchTransactions(address, timeframe)
      setData(newData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch transactions")
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [address, timeframe, fetchTransactions])

  useEffect(() => {
    if (address) {
      refetch()
    } else {
      setData(null)
      setError(null)
    }
  }, [address, timeframe, refetch])

  return { data, loading, error, refetch }
}

function generateMockTransactions(address: string, timeframe: string): Transaction[] {
  const count = timeframe === "today" ? 5 : timeframe === "1w" ? 25 : timeframe === "1m" ? 100 : 250
  const transactions: Transaction[] = []

  const timeMultiplier =
    timeframe === "today" ? 86400000 : timeframe === "1w" ? 604800000 : timeframe === "1m" ? 2592000000 : 7776000000

  for (let i = 0; i < count; i++) {
    const timestamp = new Date(Date.now() - Math.random() * timeMultiplier)
    const types: Array<"Send" | "Receive" | "Swap"> = ["Send", "Receive", "Swap"]
    const type = types[Math.floor(Math.random() * types.length)]
    const tokens = ["A0GI", "ETH", "USDC", "BTC"]
    const token = tokens[Math.floor(Math.random() * tokens.length)]

    transactions.push({
      hash: `0x${Math.random().toString(16).substr(2, 64)}`,
      timestamp: timestamp.toISOString(),
      from: type === "Receive" ? generateRandomAddress() : address,
      to: type === "Send" ? generateRandomAddress() : address,
      amount: `${(Math.random() * 10 + 0.01).toFixed(4)}`,
      token,
      type,
      gasFee: `${(Math.random() * 0.01 + 0.0001).toFixed(6)} A0GI`,
      status: Math.random() > 0.05 ? "Success" : "Failed",
      blockNumber: Math.floor(Math.random() * 1000000) + 1000000,
    })
  }

  return transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

function generateRandomAddress(): string {
  return `0x${Math.random().toString(16).substr(2, 40)}`
}

function calculateStats(transactions: Transaction[]) {
  const totalTransactions = transactions.length
  const sentTransactions = transactions.filter((tx) => tx.type === "Send").length
  const receivedTransactions = transactions.filter((tx) => tx.type === "Receive").length
  const swapTransactions = transactions.filter((tx) => tx.type === "Swap").length
  const successfulTransactions = transactions.filter((tx) => tx.status === "Success").length
  const successRate = totalTransactions > 0 ? Math.round((successfulTransactions / totalTransactions) * 100) : 0

  // Calculate total volume (mock calculation)
  const totalVolume = transactions
    .filter((tx) => tx.status === "Success")
    .reduce(
      (sum, tx) => sum + Number.parseFloat(tx.amount) * (tx.token === "ETH" ? 2400 : tx.token === "BTC" ? 43000 : 1),
      0,
    )

  // Calculate total gas spent
  const totalGasSpent = transactions.reduce((sum, tx) => sum + Number.parseFloat(tx.gasFee.split(" ")[0]), 0).toFixed(6)

  return {
    totalTransactions,
    totalVolume: totalVolume.toLocaleString(),
    totalGasSpent: `${totalGasSpent} A0GI`,
    sentTransactions,
    receivedTransactions,
    swapTransactions,
    successRate,
  }
}
