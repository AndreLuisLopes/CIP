"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Filter, RotateCcw } from "lucide-react"
import type { Provider } from "@/lib/types"

interface MapFilters {
  status?: string
  specialty?: string
  type?: string
  isStrategicPartner?: boolean
}

interface MapFiltersProps {
  providers: Provider[]
  filters: MapFilters
  onFiltersChange: (filters: MapFilters) => void
  onClearFilters: () => void
}

export function MapFilters({ providers, filters, onFiltersChange, onClearFilters }: MapFiltersProps) {
  const uniqueStatuses = Array.from(new Set(providers.map((p) => p.status)))
  const uniqueSpecialties = Array.from(new Set(providers.flatMap((p) => p.specialties))).sort()
  const uniqueTypes = Array.from(new Set(providers.map((p) => p.type)))

  const updateFilter = (key: keyof MapFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const getStatusLabel = (status: string) => {
    const statusLabels: Record<string, string> = {
      active: "Ativo",
      inactive: "Inativo",
      under_review: "Em Análise",
      contract_ended: "Contrato Encerrado",
    }
    return statusLabels[status] || status
  }

  const getTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      clinic: "Clínica",
      hospital: "Hospital",
      laboratory: "Laboratório",
      diagnostic: "Diagnóstico",
    }
    return typeLabels[type] || type
  }

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(Boolean).length
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros do Mapa
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()} ativo{getActiveFiltersCount() > 1 ? "s" : ""}
              </Badge>
            )}
          </CardTitle>
          {getActiveFiltersCount() > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="text-destructive hover:text-destructive bg-transparent"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Limpar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {}
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={filters.status || "all"}
              onValueChange={(value) => updateFilter("status", value === "all" ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                {uniqueStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {getStatusLabel(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {}
          <div className="space-y-2">
            <label className="text-sm font-medium">Especialidade</label>
            <Select
              value={filters.specialty || "all"}
              onValueChange={(value) => updateFilter("specialty", value === "all" ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas as especialidades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as especialidades</SelectItem>
                {uniqueSpecialties.map((specialty) => (
                  <SelectItem key={specialty} value={specialty}>
                    {specialty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo</label>
            <Select
              value={filters.type || "all"}
              onValueChange={(value) => updateFilter("type", value === "all" ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {uniqueTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {getTypeLabel(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {}
          <div className="flex items-center space-x-2 pt-6">
            <Checkbox
              id="strategic"
              checked={filters.isStrategicPartner || false}
              onCheckedChange={(checked) => updateFilter("isStrategicPartner", checked || undefined)}
            />
            <label htmlFor="strategic" className="text-sm font-medium">
              Apenas parceiros estratégicos
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
