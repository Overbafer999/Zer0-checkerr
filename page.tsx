"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Search, Wallet, Download, RefreshCw, ExternalLink, Twitter, AlertCircle, Zap } from "lucide-react"
import TransactionList from "../components/transaction-list"
import TransactionStats from "../components/transaction-stats"
import NetworkStatus from "../components/network-status"
import { useWalletTransactions } from "../hooks/use-wallet-transactions"
import { isValidAddress } from "../utils/address-validation"

const timeframes = [
  { label: "Today", value: "today" },
  { label: "1 Week", value: "1w" },
  { label: "1 Month", value: "1m" },
  { label: "3 Months", value: "3m" },
]

export default function WalletChecker() {
  const [walletAddress, setWalletAddress] = useState("")
  const [searchAddress, setSearchAddress] = useState("")
  const [selectedTimeframe, setSelectedTimeframe] = useState("1m")
  const [addressError, setAddressError] = useState("")

  const { data, loading, error, refetch } = useWalletTransactions(searchAddress, selectedTimeframe)

  const handleSearch = () => {
    if (!walletAddress.trim()) {
      setAddressError("Please enter a wallet address")
      return
    }

    if (!isValidAddress(walletAddress)) {
      setAddressError("Invalid wallet address. Must be 42 characters starting with 0x")
      return
    }

    setAddressError("")
    setSearchAddress(walletAddress)
  }

  const handleExportCSV = () => {
    if (!data?.transactions?.length) return

    const csv = [
      ["Hash", "Timestamp", "From", "To", "Amount", "Token", "Type", "Gas Fee", "Status"],
      ...data.transactions.map((tx) => [
        tx.hash,
        tx.timestamp,
        tx.from,
        tx.to,
        tx.amount,
        tx.token,
        tx.type,
        tx.gasFee,
        tx.status,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `wallet-transactions-${searchAddress.slice(0, 8)}-${selectedTimeframe}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/placeholder.svg?height=1080&width=1920')",
          }}
        />
        <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-gray-800/50 bg-gray-900/30 backdrop-blur-md sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Wallet className="h-8 w-8 text-purple-400" />
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Wallet Transaction Checker
                  </h1>
                </div>
                <Badge variant="outline" className="text-green-400 border-green-400">
                  0G Galileo Testnet
                </Badge>
              </div>
              <NetworkStatus />
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Search Section */}
          <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-md mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Search className="h-5 w-5 text-purple-400" />
                <span>Search Wallet Transactions</span>
              </CardTitle>
              <CardDescription className="text-gray-300">
                Enter any EVM wallet address to view transaction history on 0G Galileo Testnet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Enter wallet address (0x...)"
                    value={walletAddress}
                    onChange={(e) => {
                      setWalletAddress(e.target.value)
                      if (addressError) setAddressError("")
                    }}
                    className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-purple-400"
                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  />
                  {addressError && (
                    <Alert className="mt-2 bg-red-900/20 border-red-800">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-red-200">{addressError}</AlertDescription>
                    </Alert>
                  )}
                </div>

                <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                  <SelectTrigger className="w-[140px] bg-gray-800/50 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-gray-700">
                    {timeframes.map((tf) => (
                      <SelectItem key={tf.value} value={tf.value} className="text-white hover:bg-gray-800">
                        {tf.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  onClick={handleSearch}
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>

              {searchAddress && (
                <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400">Searching:</span>
                    <code className="text-purple-300 bg-gray-800/50 px-2 py-1 rounded text-sm">
                      {searchAddress.slice(0, 6)}...{searchAddress.slice(-4)}
                    </code>
                    <Badge variant="outline" className="text-blue-400 border-blue-400">
                      {selectedTimeframe}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => refetch()}
                      variant="outline"
                      size="sm"
                      disabled={loading}
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                      Refresh
                    </Button>

                    <Button
                      onClick={handleExportCSV}
                      variant="outline"
                      size="sm"
                      disabled={loading || !data?.transactions?.length}
                      className="border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Error State */}
          {error && (
            <Alert className="mb-8 bg-red-900/20 border-red-800">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-200">
                {error}. Please check the wallet address and try again.
              </AlertDescription>
            </Alert>
          )}

          {/* Results */}
          {searchAddress && (
            <div className="space-y-6">
              {/* Transaction Stats */}
              <TransactionStats data={data} loading={loading} timeframe={selectedTimeframe} />

              {/* Transaction List */}
              <TransactionList
                transactions={data?.transactions}
                loading={loading}
                walletAddress={searchAddress}
                timeframe={selectedTimeframe}
              />
            </div>
          )}
        </div>

        {/* Footer with Branding */}
        <footer className="relative z-10 border-t border-gray-800/50 bg-gray-900/30 backdrop-blur-md mt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4 group">
                <Zap className="h-6 w-6 text-purple-400 group-hover:text-purple-300 transition-colors" />
                <span className="text-gray-300 font-medium group-hover:text-white transition-colors">
                  Site made by OveR
                </span>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-gray-400">Subscribe for more!</span>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-blue-400 text-blue-400 hover:bg-blue-400/10 hover:border-blue-300 hover:text-blue-300 transition-all duration-200"
                >
                  <a
                    href="https://x.com/OVER9725"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2"
                  >
                    <Twitter className="h-4 w-4" />
                    <span>@OVER9725</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-800/50 text-center">
              <p className="text-gray-500 text-sm hover:text-gray-400 transition-colors">
                Powered by 0G Galileo Testnet • Chain ID: 16601 • RPC: https://80087.rpc.thirdweb.com
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
