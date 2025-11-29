"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { X, Filter, RotateCcw } from "lucide-react"
import type { SearchFilters as SearchFiltersType } from "@/lib/search-utils"
import type { Provider } from "@/lib/types"
import { getUniqueValues } from "@/lib/search-utils"

interface SearchFiltersProps {
  providers: Provider[]
  filters: SearchFiltersType
  onFiltersChange: (filters: SearchFiltersType) => void
  onClearFilters: () => void
}

export function SearchFilters({ providers, filters, onFiltersChange, onClearFilters }: SearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const cities = getUniqueValues(providers, "city")
  const states = getUniqueValues(providers, "state")
  const neighborhoods = getUniqueValues(providers, "neighborhood")
  const specialties = getUniqueValues(providers, "specialties")
  const complexities = getUniqueValues(providers, "complexity")
  const types = getUniqueValues(providers, "type")
  const statuses = getUniqueValues(providers, "status")

  const updateFilter = (key: keyof SearchFiltersType, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const removeFilter = (key: keyof SearchFiltersType) => {
    const newFilters = { ...filters }
    delete newFilters[key]
    onFiltersChange(newFilters)
  }

  const getActiveFiltersCount = () => {
    return Object.keys(filters).length
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Busca
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary" className="ml-2">
                {getActiveFiltersCount()} ativo{getActiveFiltersCount() > 1 ? "s" : ""}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? "Recolher" : "Expandir"}
            </Button>
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
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {}
        <div className="space-y-2">
          <Label htmlFor="name">Nome/Razão Social</Label>
          <Input
            id="name"
            placeholder="Digite o nome do prestador..."
            value={filters.name || ""}
            onChange={(e) => updateFilter("name", e.target.value || undefined)}
          />
        </div>

        {}
        {getActiveFiltersCount() > 0 && (
          <div className="space-y-2">
            <Label>Filtros Ativos</Label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(filters).map(([key, value]) => {
                if (!value) return null

                let displayValue = value.toString()
                if (key === "status") displayValue = getStatusLabel(value as string)
                if (key === "type") displayValue = getTypeLabel(value as string)
                if (key === "isStrategicPartner") displayValue = "Parceiro Estratégico"
                if (key === "maxAppointmentTime") displayValue = `Até ${value} dias`

                return (
                  <Badge key={key} variant="secondary" className="flex items-center gap-1">
                    {displayValue}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={() => removeFilter(key as keyof SearchFiltersType)}
                    />
                  </Badge>
                )
              })}
            </div>
          </div>
        )}

        {}
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {}
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select
                value={filters.state || "default"}
                onValueChange={(value) => updateFilter("state", value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Todos os estados</SelectItem>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cidade</Label>
              <Select
                value={filters.city || "default"}
                onValueChange={(value) => updateFilter("city", value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a cidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Todas as cidades</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Bairro</Label>
              <Select
                value={filters.neighborhood || "default"}
                onValueChange={(value) => updateFilter("neighborhood", value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o bairro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Todos os bairros</SelectItem>
                  {neighborhoods.map((neighborhood) => (
                    <SelectItem key={neighborhood} value={neighborhood}>
                      {neighborhood}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {}
            <div className="space-y-2">
              <Label>Especialidade</Label>
              <Select
                value={filters.specialty || "default"}
                onValueChange={(value) => updateFilter("specialty", value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a especialidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Todas as especialidades</SelectItem>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Complexidade</Label>
              <Select
                value={filters.complexity || "default"}
                onValueChange={(value) => updateFilter("complexity", value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a complexidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Todas as complexidades</SelectItem>
                  {complexities.map((complexity) => (
                    <SelectItem key={complexity} value={complexity}>
                      {complexity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {}
            <div className="space-y-2">
              <Label>Tipo de Prestador</Label>
              <Select
                value={filters.type || "default"}
                onValueChange={(value) => updateFilter("type", value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Todos os tipos</SelectItem>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {getTypeLabel(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={filters.status || "default"}
                onValueChange={(value) => updateFilter("status", value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Todos os status</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {getStatusLabel(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {}
            <div className="space-y-2">
              <Label>Tempo máximo de agendamento: {filters.maxAppointmentTime || 30} dias</Label>
              <Slider
                value={[filters.maxAppointmentTime || 30]}
                onValueChange={(value) => updateFilter("maxAppointmentTime", value[0])}
                max={30}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            {}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="strategic"
                checked={filters.isStrategicPartner || false}
                onCheckedChange={(checked) => updateFilter("isStrategicPartner", checked || undefined)}
              />
              <Label htmlFor="strategic">Apenas parceiros estratégicos</Label>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
