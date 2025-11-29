import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Users, Activity, Star, AlertTriangle, MapPin } from "lucide-react"
import type { DashboardStats } from "../../lib/types"

interface StatsCardsProps {
  stats: DashboardStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const formatAvgDays = (value: number) => {
    if (!isFinite(value) || value <= 0) return '0 dias'
    const isInt = Math.abs(value - Math.round(value)) < 1e-6
    const n = isInt ? Math.round(value) : Number(value.toFixed(1))
    if (n === 1) return '1 dia'
    return isInt ? `${n} dias` : `${n.toFixed(1)} dias`
  }
  const pct = (part: number, total: number) => (total > 0 ? ((part / total) * 100).toFixed(1) : '0.0')
  const cards = [
    {
      title: "Total de Prestadores",
      value: stats.totalProviders,
      description: "Rede credenciada completa",
      icon: Users,
      color: "text-foreground",
    },
    {
      title: "Prestadores Ativos",
      value: stats.activeProviders,
      description: `${pct(stats.activeProviders, stats.totalProviders)}% da rede`,
      icon: Activity,
      color: "text-green-600",
    },
    {
      title: "Parceiros Estratégicos",
      value: stats.strategicPartners,
      description: "Parcerias especiais",
      icon: Star,
      color: "text-yellow-600",
    },
    {
      title: "Em Análise",
      value: stats.underReview,
      description: "Requer atenção",
      icon: AlertTriangle,
      color: "text-yellow-500",
    },
    {
      title: "Regiões Cobertas",
      value: stats.coverageByRegion.length,
      description: "Cidades atendidas",
      icon: MapPin,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className={`h-4 w-4 ${card.color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
