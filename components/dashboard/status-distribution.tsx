import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp } from "lucide-react"
import type { DashboardStats } from "@/lib/types"

interface StatusDistributionProps {
  stats: DashboardStats
}

export function StatusDistribution({ stats }: StatusDistributionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Distribuição por Status
        </CardTitle>
        <CardDescription>Status atual dos prestadores</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {stats.statusDistribution.map((status, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                  <span className="text-sm font-medium">{status.status}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {status.count} ({stats.totalProviders > 0 ? ((status.count / stats.totalProviders) * 100).toFixed(1) : '0.0'}%)
                  </span>
                </div>
              </div>
              <Progress
                value={stats.totalProviders > 0 ? (status.count / stats.totalProviders) * 100 : 0}
                className="h-2"
                style={
                  {
                    "--progress-background": status.color,
                  } as React.CSSProperties
                }
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
