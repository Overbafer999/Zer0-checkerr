"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart3 } from "lucide-react"

interface SwapCountChartProps {
  data:
    | Array<{
        time: string
        swaps: number
        timestamp: number
      }>
    | undefined
  loading: boolean
  timeframe: string
}

export default function SwapCountChart({ data, loading, timeframe }: SwapCountChartProps) {
  if (loading) {
    return (
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Daily Swaps</CardTitle>
          <CardDescription className="text-gray-400">Number of swaps for {timeframe}</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full bg-gray-800" />
        </CardContent>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return (
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Daily Swaps</CardTitle>
          <CardDescription className="text-gray-400">Number of swaps for {timeframe}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No swap data available</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Daily Swaps</CardTitle>
        <CardDescription className="text-gray-400">Number of swaps for {timeframe}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            swaps: {
              label: "Swaps",
              color: "hsl(142, 76%, 36%)",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="time"
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value) => {
                  if (timeframe === "1d") return value
                  return new Date(value).toLocaleDateString()
                }}
              />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <ChartTooltip
                content={<ChartTooltipContent />}
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#F9FAFB",
                }}
                labelFormatter={(value) => `Time: ${value}`}
                formatter={(value: number) => [value.toLocaleString(), "Swaps"]}
              />
              <Bar dataKey="swaps" fill="var(--color-swaps)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
