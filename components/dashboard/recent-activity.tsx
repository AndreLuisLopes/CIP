import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import { Building2, Star, Clock, MapPin } from "lucide-react"
import type { Provider } from "@/lib/types"

interface RecentActivityProps {
  providers: Provider[]
}

export function RecentActivity({ providers }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Prestadores Recentes
        </CardTitle>
        <CardDescription>Últimas atualizações na rede credenciada</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-medium">{provider.name}</h3>
                  {provider.isStrategicPartner && (
                    <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                      <Star className="h-3 w-3 mr-1" />
                      Parceiro Estratégico
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>
                    {provider.location.city}, {provider.location.state}
                  </span>
                  <span>•</span>
                  <span>{provider.location.neighborhood}</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {provider.specialties.slice(0, 3).map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                  {provider.specialties.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{provider.specialties.length - 3} mais
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Agendamento: {provider.averageAppointmentTime} dias
                  </span>
                  <span>Tipo: {provider.type}</span>
                  <span>Atualizado: {new Date(provider.lastUpdate).toLocaleDateString("pt-BR")}</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <StatusBadge status={provider.status} />
                {provider.complexity.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {provider.complexity[0]}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
