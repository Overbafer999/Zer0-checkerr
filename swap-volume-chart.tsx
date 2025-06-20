"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp } from "lucide-react"

interface SwapVolumeChartProps {
  data:
    | Array<{
        time: string
        volume: number
        timestamp: number
      }>
    | undefined
  loading: boolean
  timeframe: string
}

export default function SwapVolumeChart({ data, loading, timeframe }: SwapVolumeChartProps) {
  if (loading) {
    return (
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white">Volume Over Time</CardTitle>
          <CardDescription className="text-gray-400">Trading volume for {timeframe}</CardDescription>
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
          <CardTitle className="text-white">Volume Over Time</CardTitle>
          <CardDescription className="text-gray-400">Trading volume for {timeframe}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No volume data available</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900/50 border-gray-800">
      <CardHeader>
        <CardTitle className="text-white">Volume Over Time</CardTitle>
        <CardDescription className="text-gray-400">Trading volume for {timeframe}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            volume: {
              label: "Volume ($)",
              color: "hsl(217, 91%, 60%)",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="time"
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value) => {
                  // Format time based on timeframe
                  if (timeframe === "1d") return value
                  return new Date(value).toLocaleDateString()
                }}
              />
              <YAxis stroke="#9CA3AF" fontSize={12} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
              <ChartTooltip
                content={<ChartTooltipContent />}
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#F9FAFB",
                }}
                labelFormatter={(value) => `Time: ${value}`}
                formatter={(value: number) => [`$${value.toLocaleString()}`, "Volume"]}
              />
              <Line
                type="monotone"
                dataKey="volume"
                stroke="var(--color-volume)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "var(--color-volume)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
