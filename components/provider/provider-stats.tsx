import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, TrendingUp, Users, Calendar } from "lucide-react"
import type { Provider } from "@/lib/types"

interface ProviderStatsProps {
  provider: Provider
}

export function ProviderStats({ provider }: ProviderStatsProps) {
  const pluralizeDays = (val?: number) => {
    const n = Number(val)
    if (!isFinite(n)) return "-"
    if (n === 1) return "1 dia"
    return `${n} dias`
  }
  const apptText = pluralizeDays(provider.averageAppointmentTime)
  const procText = pluralizeDays(provider.averageProcedureTime)
  const stats = [
    {
      title: "Tempo Médio de Agendamento",
      value: `${apptText}`,
      description: "Tempo para conseguir consulta",
      icon: Calendar,
      color: "text-blue-600",
    },
    {
      title: "Tempo Médio de Procedimento",
  value: `${procText}`,
      description: "Tempo para realização",
      icon: Clock,
      color: "text-green-600",
    },
    {
      title: "Especialidades",
      value: provider.specialties.length.toString(),
      description: "Áreas de atendimento",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Complexidade",
      value: provider.complexity && provider.complexity.length > 0 ? String(provider.complexity[0]) : "-",
      description: "Nível de atendimento",
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
