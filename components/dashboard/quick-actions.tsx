"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, FileText, MapPin, Upload, Users, TrendingUp } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      title: "Consultar Prestador",
      description: "Buscar informações detalhadas",
      icon: Search,
      href: "/consulta",
      color: "text-blue-600",
    },
    {
      title: "Gerar Relatório",
      description: "Exportar dados personalizados",
      icon: FileText,
      href: "/relatorios",
      color: "text-green-600",
    },
    {
      title: "Visualizar Mapa",
      description: "Cobertura geográfica da rede",
      icon: MapPin,
      href: "/mapa",
      color: "text-purple-600",
    },
    {
      title: "Importar Dados",
      description: "Atualizar base de prestadores",
      icon: Upload,
      href: "/importar",
      color: "text-orange-600",
    },
    {
      title: "Gerenciar Prestadores",
      description: "Visualizar todos os prestadores",
      icon: Users,
      href: "/prestadores",
      color: "text-indigo-600",
    },
    {
      title: "Análise Avançada",
      description: "Indicadores e tendências",
      icon: TrendingUp,
      href: "/analytics",
      color: "text-pink-600",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ações Rápidas</CardTitle>
        <CardDescription>Acesso rápido às funcionalidades principais do sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action, index) => (
            <Link key={index} href={action.href}>
              <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-all hover:shadow-md group">
                <action.icon className={`h-8 w-8 ${action.color} mb-3 group-hover:scale-110 transition-transform`} />
                <h3 className="font-medium mb-1">{action.title}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
