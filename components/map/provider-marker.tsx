"use client"

import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/ui/status-badge"
import { Star, MapPin, Clock } from "lucide-react"
import type { Provider } from "@/lib/types"

interface ProviderMarkerProps {
  provider: Provider
  onClick: () => void
  isSelected?: boolean
}

export function ProviderMarker({ provider, onClick, isSelected }: ProviderMarkerProps) {
  const getMarkerColor = () => {
    switch (provider.status) {
      case "active":
        return "bg-green-500"
      case "under_review":
        return "bg-yellow-500"
      case "contract_ended":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTypeIcon = () => {
    switch (provider.type) {
      case "hospital":
        return "🏥"
      case "clinic":
        return "🏥"
      case "laboratory":
        return "🔬"
      case "diagnostic":
        return "📊"
      default:
        return "🏥"
    }
  }

  return (
    <div
      className={`relative cursor-pointer transform transition-all duration-200 hover:scale-110 ${
        isSelected ? "scale-125 z-10" : ""
      }`}
      onClick={onClick}
    >
      {}
      <div
        className={`w-8 h-8 rounded-full ${getMarkerColor()} border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-bold`}
      >
        {getTypeIcon()}
      </div>

      {}
      {provider.isStrategicPartner && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
          <Star className="h-2 w-2 text-white" />
        </div>
      )}

      {}
      {isSelected && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-white border rounded-lg shadow-lg p-3 z-20">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">{provider.name}</h3>
              <StatusBadge status={provider.status} />
            </div>

            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>
                {provider.location.city}, {provider.location.state}
              </span>
            </div>

            <div className="flex flex-wrap gap-1">
              {provider.specialties.slice(0, 2).map((specialty, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {specialty}
                </Badge>
              ))}
              {provider.specialties.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{provider.specialties.length - 2}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Agendamento: {provider.averageAppointmentTime} dias</span>
            </div>

            {provider.isStrategicPartner && (
              <Badge variant="outline" className="text-yellow-600 border-yellow-600 text-xs">
                <Star className="h-3 w-3 mr-1" />
                Parceiro Estratégico
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
