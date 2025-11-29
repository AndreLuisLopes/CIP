"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Filter } from "lucide-react"
import type { ReportFilters as ReportFiltersType } from "@/lib/report-utils"
import type { Provider } from "@/lib/types"

interface ReportFiltersProps {
  providers: Provider[]
  filters: ReportFiltersType
  onFiltersChange: (filters: ReportFiltersType) => void
}

export function ReportFilters({ providers, filters, onFiltersChange }: ReportFiltersProps) {
  const uniqueSpecialties = Array.from(new Set(providers.flatMap((p) => p.specialties))).sort()
  const uniqueRegions = Array.from(new Set(providers.map((p) => `${p.location.city} - ${p.location.state}`))).sort()
  const uniqueTypes = Array.from(new Set(providers.map((p) => p.type)))
  const uniqueStatuses = Array.from(new Set(providers.map((p) => p.status)))

  const updateFilter = (key: keyof ReportFiltersType, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const getTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      clinic: "Clínicas",
      hospital: "Hospitais",
      laboratory: "Laboratórios",
      diagnostic: "Diagnósticos",
    }
    return typeLabels[type] || type
  }

  const getStatusLabel = (status: string) => {
    const statusLabels: Record<string, string> = {
      active: "Ativos",
      inactive: "Inativos",
      under_review: "Em Análise",
      contract_ended: "Contratos Encerrados",
    }
    return statusLabels[status] || status
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros do Relatório
        </CardTitle>
        <CardDescription>Configure os critérios para geração do relatório personalizado</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Especialidade</Label>
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

          <div className="space-y-2">
            <Label>Região</Label>
            <Select
              value={filters.region || "all"}
              onValueChange={(value) => updateFilter("region", value === "all" ? undefined : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas as regiões" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as regiões</SelectItem>
                {uniqueRegions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tipo de Prestador</Label>
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

          <div className="space-y-2">
            <Label>Status</Label>
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
        </div>

        {}
        <div>
          <Label className="text-base font-medium">Informações Adicionais</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="strategic"
                checked={filters.includeStrategicIndicators || false}
                onCheckedChange={(checked) => updateFilter("includeStrategicIndicators", checked)}
              />
              <Label htmlFor="strategic" className="text-sm">
                Incluir indicadores estratégicos
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="performance"
                checked={filters.includePerformanceMetrics || false}
                onCheckedChange={(checked) => updateFilter("includePerformanceMetrics", checked)}
              />
              <Label htmlFor="performance" className="text-sm">
                Incluir métricas de performance
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="contact"
                checked={filters.includeContactInfo || false}
                onCheckedChange={(checked) => updateFilter("includeContactInfo", checked)}
              />
              <Label htmlFor="contact" className="text-sm">
                Incluir informações de contato
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
