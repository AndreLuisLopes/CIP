import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Building2, Star } from "lucide-react"
import type { Provider } from "@/lib/types"

interface CoverageStatsProps {
  providers: Provider[]
}

export function CoverageStats({ providers }: CoverageStatsProps) {
  const stats = {
    totalProviders: providers.length,
    activeProviders: providers.filter((p) => p.status === "active").length,
    strategicPartners: providers.filter((p) => p.isStrategicPartner).length,
    cities: new Set(providers.map((p) => p.location.city)).size,
    states: new Set(providers.map((p) => p.location.state)).size,
  }

  const coverageByState = providers.reduce(
    (acc, provider) => {
      const state = provider.location.state
      acc[state] = (acc[state] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const coverageByType = providers.reduce(
    (acc, provider) => {
      acc[provider.type] = (acc[provider.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const getTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      clinic: "Clínicas",
      hospital: "Hospitais",
      laboratory: "Laboratórios",
      diagnostic: "Diagnósticos",
    }
    return typeLabels[type] || type
  }

  return (
    <div className="space-y-6">
      {}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-6 w-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-bold">{stats.totalProviders}</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Building2 className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{stats.activeProviders}</div>
            <div className="text-xs text-muted-foreground">Ativos</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">{stats.strategicPartners}</div>
            <div className="text-xs text-muted-foreground">Parceiros</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <MapPin className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{stats.cities}</div>
            <div className="text-xs text-muted-foreground">Cidades</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <MapPin className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">{stats.states}</div>
            <div className="text-xs text-muted-foreground">Estados</div>
          </CardContent>
        </Card>
      </div>

      {}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Cobertura por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(coverageByState)
                .sort(([, a], [, b]) => b - a)
                .map(([state, count]) => (
                  <div key={state} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{state}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${(count / stats.totalProviders) * 100}%` }}
                        />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {count}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Distribuição por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(coverageByType)
                .sort(([, a], [, b]) => b - a)
                .map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{getTypeLabel(type)}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-muted rounded-full h-2">
                        <div
                          className="bg-accent h-2 rounded-full"
                          style={{ width: `${(count / stats.totalProviders) * 100}%` }}
                        />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {count}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
