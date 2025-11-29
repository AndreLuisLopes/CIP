import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Building2, Calendar, Edit, Phone, Mail } from "lucide-react"
import type { Provider } from "@/lib/types"
import { useAuth } from "@/contexts/auth-context"

interface ProviderHeaderProps {
  provider: Provider
  onEdit?: () => void
}

export function ProviderHeader({ provider, onEdit }: ProviderHeaderProps) {
  const { canEdit } = useAuth()
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
    <div className="bg-card border rounded-lg p-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        {}
        <div className="flex-1 space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Building2 className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{provider.name}</h1>
                {provider.credenciamento && (
                  <Badge variant="secondary" className="text-xs">Cod. {provider.credenciamento}</Badge>
                )}
                {provider.isStrategicPartner && (
                  <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                    <Star className="h-4 w-4 mr-1" />
                    Parceiro Estratégico
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground text-lg">{provider.corporateName}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">{getTypeLabel(provider.type)}</Badge>
                <StatusBadge status={provider.status} />
              </div>
            </div>
          </div>

          {}
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="font-medium">{provider.location.address}</p>
              <p className="text-muted-foreground">
                {provider.location.neighborhood}, {provider.location.city} - {provider.location.state}
              </p>
            </div>
          </div>

          {}
          <div className="flex flex-wrap gap-4">
            {provider.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{provider.phone}</span>
              </div>
            )}
            {provider.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{provider.email}</span>
              </div>
            )}
          </div>
        </div>

        {}
        <div className="flex flex-col gap-3">
          {canEdit && (
          <Button variant="outline" className="w-full lg:w-auto bg-transparent" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Editar Informações
          </Button>
          )}
          <div className="text-sm text-muted-foreground text-right">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Contrato desde: {new Date(provider.contractStartDate).toLocaleDateString("pt-BR")}</span>
            </div>
            <div className="mt-1">Última atualização: {new Date(provider.lastUpdate).toLocaleDateString("pt-BR")}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
