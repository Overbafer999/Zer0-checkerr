"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink, ArrowUpRight, ArrowDownLeft, RefreshCw, Activity } from "lucide-react"

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

interface TransactionListProps {
  transactions: Transaction[] | undefined
  loading: boolean
  walletAddress: string
  timeframe: string
}

export default function TransactionList({ transactions, loading, walletAddress, timeframe }: TransactionListProps) {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "Send":
        return <ArrowUpRight className="h-4 w-4 text-red-400" />
      case "Receive":
        return <ArrowDownLeft className="h-4 w-4 text-green-400" />
      case "Swap":
        return <RefreshCw className="h-4 w-4 text-blue-400" />
      default:
        return <Activity className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    return (
      <Badge
        variant={status === "Success" ? "default" : "secondary"}
        className={status === "Success" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
      >
        {status}
      </Badge>
    )
  }

  const openInExplorer = (hash: string) => {
    window.open(`https://chainscan-galileo.0g.ai/tx/${hash}`, "_blank")
  }

  if (loading) {
    return (
      <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-white">Transaction History</CardTitle>
          <CardDescription className="text-gray-300">Loading transactions...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-800/30">
                <Skeleton className="w-8 h-8 rounded-full bg-gray-700" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32 bg-gray-700" />
                  <Skeleton className="h-3 w-48 bg-gray-700" />
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

  if (!transactions || transactions.length === 0) {
    return (
      <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-white">Transaction History</CardTitle>
          <CardDescription className="text-gray-300">No transactions found for {timeframe} period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Activity className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No transactions found</p>
            <p className="text-gray-500 text-sm">
              This wallet has no transactions in the selected timeframe on 0G Galileo Testnet
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-white">Transaction History</CardTitle>
        <CardDescription className="text-gray-300">
          {transactions.length} transactions found for {timeframe} period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-gray-700/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700/50 hover:bg-gray-800/30">
                <TableHead className="text-gray-300">Type</TableHead>
                <TableHead className="text-gray-300">Hash</TableHead>
                <TableHead className="text-gray-300">Time</TableHead>
                <TableHead className="text-gray-300">From/To</TableHead>
                <TableHead className="text-gray-300">Amount</TableHead>
                <TableHead className="text-gray-300">Gas Fee</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.hash} className="border-gray-700/50 hover:bg-gray-800/20">
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getTransactionIcon(tx.type)}
                      <span className="text-gray-300 text-sm">{tx.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-purple-300 text-sm font-mono">
                      {tx.hash.slice(0, 8)}...{tx.hash.slice(-6)}
                    </code>
                  </TableCell>
                  <TableCell className="text-gray-300 text-sm">{new Date(tx.timestamp).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-gray-400 text-xs">{tx.type === "Send" ? "To:" : "From:"}</div>
                      <code className="text-gray-300 text-sm font-mono">
                        {(tx.type === "Send" ? tx.to : tx.from).slice(0, 6)}...
                        {(tx.type === "Send" ? tx.to : tx.from).slice(-4)}
                      </code>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-white font-medium">{tx.amount}</div>
                      <div className="text-gray-400 text-xs">{tx.token}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-yellow-400 text-sm">{tx.gasFee}</TableCell>
                  <TableCell>{getStatusBadge(tx.status)}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => openInExplorer(tx.hash)}
                      variant="ghost"
                      size="sm"
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
