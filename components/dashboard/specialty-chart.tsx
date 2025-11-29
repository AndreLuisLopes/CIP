"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Activity } from "lucide-react"
import type { DashboardStats } from "@/lib/types"

interface SpecialtyChartProps {
  stats: DashboardStats
}


function bluePalette(n: number): string[] {
  const shades = [
    "#6498EF", "#5C90E8", "#5588E0", "#4D80D9", "#4678D1", "#3E70CA",
    "#3768C2", "#2F60BB", "#2858B3", "#2050AC", "#1948A4", "#11409D",
  ]
  if (n <= shades.length) return shades.slice(0, n)
  
  const arr: string[] = []
  for (let i = 0; i < n; i++) arr.push(shades[i % shades.length])
  return arr
}

export function SpecialtyChart({ stats }: SpecialtyChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Prestadores por Especialidade
        </CardTitle>
        <CardDescription>Distribuição das especialidades na rede</CardDescription>
      </CardHeader>
      <CardContent>
        {stats.providersBySpecialty.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
            Sem dados de especialidade para exibir
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={stats.providersBySpecialty}
                cx="50%"
                cy="50%"
                labelLine={false}
                nameKey="specialty"
                label={({ name, percent }: any) => `${name ?? ''} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#6498EF"
                dataKey="count"
              >
                {stats.providersBySpecialty.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={bluePalette(stats.providersBySpecialty.length)[index]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
