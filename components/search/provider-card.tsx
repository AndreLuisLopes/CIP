import Link from "next/link"
import { Card, CardContent } from "../ui/card"
import { Badge } from "../ui/badge"
import { StatusBadge } from "../ui/status-badge"
import { Button } from "../ui/button"
import { MapPin, Star, Phone, Mail, Building2, Eye, Edit } from "lucide-react"
import type { Provider } from "../../lib/types"

interface ProviderCardProps {
  provider: Provider
}

export function ProviderCard({ provider }: ProviderCardProps) {
  const getTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      clinic: "Clínica",
      hospital: "Hospital",
      laboratory: "Laboratório",
      diagnostic: "Diagnóstico",
    }
    return typeLabels[type] || type
  }


  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="space-y-4">
          {}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold">{provider.name}</h3>
                {provider.credenciamento && (
                  <Badge variant="secondary" className="text-xs">Cod. {provider.credenciamento}</Badge>
                )}
                {provider.isStrategicPartner && (
                  <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                    <Star className="h-3 w-3 mr-1" />
                    Parceiro Estratégico
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{provider.corporateName}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={provider.status} />
              <Link href={`/prestadores/${provider.id}`}>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Ver Detalhes
                </Button>
              </Link>
              <Link href={`/prestadores/${provider.id}?edit=1`}>
                <Button variant="default" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
              </Link>
            </div>
          </div>

          {}
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p>{provider.location.address}</p>
              <p className="text-muted-foreground">
                {provider.location.neighborhood}, {provider.location.city} - {provider.location.state}
              </p>
            </div>
          </div>

          {}
          <div>
            <p className="text-sm font-medium mb-2">Especialidades:</p>
            <div className="flex flex-wrap gap-1">
              {provider.specialties.map((specialty, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>

          {}
          {provider.complexity.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Complexidade:</p>
              <div className="flex flex-wrap gap-1">
                {provider.complexity.map((comp, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {comp}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {provider.differentials.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2">Diferenciais:</p>
              <div className="flex flex-wrap gap-1">
                {provider.differentials.map((diff, index) => (
                  <Badge key={index} variant="outline" className="text-xs text-blue-600 border-blue-600">
                    {diff}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span>Tipo: {getTypeLabel(provider.type)}</span>
              </div>
            </div>

            <div className="space-y-2">
              {provider.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{provider.phone}</span>
                </div>
              )}
              {provider.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{provider.email}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
