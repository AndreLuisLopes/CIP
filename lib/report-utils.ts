import type { Provider } from "./types"

export interface ReportFilters {
  specialty?: string
  region?: string
  type?: string
  status?: string
  includeStrategicIndicators?: boolean
  includePerformanceMetrics?: boolean
  includeContactInfo?: boolean
}

export interface ReportData {
  title: string
  generatedAt: string
  filters: ReportFilters
  providers: Provider[]
  summary: {
    totalProviders: number
    activeProviders: number
    strategicPartners: number
    averageAppointmentTime: number
    averageProcedureTime: number
    coverageByRegion: { region: string; count: number }[]
    providersBySpecialty: { specialty: string; count: number }[]
    providersByType: { type: string; count: number }[]
  }
}

export function generateReportData(providers: Provider[], filters: ReportFilters): ReportData {
  
  let filteredProviders = providers

  if (filters.specialty) {
    filteredProviders = filteredProviders.filter((p) =>
      p.specialties.some((s) => s.toLowerCase().includes(filters.specialty!.toLowerCase())),
    )
  }

  if (filters.region) {
    const region = filters.region.trim()
    if (region.includes(' - ')) {
      const [citySel, stateSel] = region.split(' - ').map((s) => s.trim())
      filteredProviders = filteredProviders.filter(
        (p) => p.location.city === citySel && p.location.state === stateSel,
      )
    } else {
      
      filteredProviders = filteredProviders.filter(
        (p) => p.location.state === region || p.location.city.toLowerCase().includes(region.toLowerCase()),
      )
    }
  }

  if (filters.type) {
    filteredProviders = filteredProviders.filter((p) => p.type === filters.type)
  }

  if (filters.status) {
    filteredProviders = filteredProviders.filter((p) => p.status === filters.status)
  }

  
  const activeProviders = filteredProviders.filter((p) => p.status === "active")
  const strategicPartners = filteredProviders.filter((p) => p.isStrategicPartner)

  const averageAppointmentTime =
    filteredProviders.length > 0
      ? filteredProviders.reduce((sum, p) => sum + p.averageAppointmentTime, 0) / filteredProviders.length
      : 0

  const averageProcedureTime =
    filteredProviders.length > 0
      ? filteredProviders.reduce((sum, p) => sum + p.averageProcedureTime, 0) / filteredProviders.length
      : 0

  
  const regionCounts = filteredProviders.reduce(
    (acc, p) => {
      const region = `${p.location.city} - ${p.location.state}`
      acc[region] = (acc[region] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const coverageByRegion = Object.entries(regionCounts)
    .map(([region, count]) => ({ region, count }))
    .sort((a, b) => b.count - a.count)

  
  const specialtyCounts = filteredProviders.reduce(
    (acc, p) => {
      p.specialties.forEach((specialty) => {
        acc[specialty] = (acc[specialty] || 0) + 1
      })
      return acc
    },
    {} as Record<string, number>,
  )

  const providersBySpecialty = Object.entries(specialtyCounts)
    .map(([specialty, count]) => ({ specialty, count }))
    .sort((a, b) => b.count - a.count)

  
  const typeCounts = filteredProviders.reduce(
    (acc, p) => {
      acc[p.type] = (acc[p.type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const providersByType = Object.entries(typeCounts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)

  return {
    title: generateReportTitle(filters),
    generatedAt: new Date().toISOString(),
    filters,
    providers: filteredProviders,
    summary: {
      totalProviders: filteredProviders.length,
      activeProviders: activeProviders.length,
      strategicPartners: strategicPartners.length,
      averageAppointmentTime: Math.round(averageAppointmentTime * 10) / 10,
      averageProcedureTime: Math.round(averageProcedureTime * 10) / 10,
      coverageByRegion,
      providersBySpecialty,
      providersByType,
    },
  }
}

function generateReportTitle(filters: ReportFilters): string {
  const parts = ["Relatório de Prestadores"]

  if (filters.specialty) parts.push(`- ${filters.specialty}`)
  if (filters.region) parts.push(`- ${filters.region}`)
  if (filters.type) parts.push(`- ${getTypeLabel(filters.type)}`)
  if (filters.status) parts.push(`- ${getStatusLabel(filters.status)}`)

  return parts.join(" ")
}

function getTypeLabel(type: string): string {
  const typeLabels: Record<string, string> = {
    clinic: "Clínicas",
    hospital: "Hospitais",
    laboratory: "Laboratórios",
    diagnostic: "Diagnósticos",
  }
  return typeLabels[type] || type
}

function getStatusLabel(status: string): string {
  const statusLabels: Record<string, string> = {
    active: "Ativos",
    inactive: "Inativos",
    under_review: "Em Análise",
    contract_ended: "Contratos Encerrados",
  }
  return statusLabels[status] || status
}

export function exportToCSV(data: ReportData): string {
  
  const delimiter = ";"

  const headers = [
    "Nome",
    "Razão Social",
    "Tipo",
    "Status",
    "Cidade",
    "Estado",
    "Bairro",
    "Especialidades",
    "Complexidade",
    "Tempo Agendamento (dias)",
    "Tempo Procedimento (dias)",
    "Parceiro Estratégico",
    "Diferenciais",
  ]

  if (data.filters.includeContactInfo) {
    headers.push("Telefone", "Email")
  }

  const escape = (val: any) => {
    const s = (val ?? "").toString().replaceAll('"', '""')
    return `"${s}` + `"`
  }

  const rows = data.providers.map((provider) => {
    const base = [
      provider.name,
      provider.corporateName,
      getTypeLabel(provider.type),
      getStatusLabel(provider.status),
      provider.location.city,
      provider.location.state,
      provider.location.neighborhood,
      provider.specialties.join(", "),
      provider.complexity.join(", "),
      provider.averageAppointmentTime.toString(),
      provider.averageProcedureTime.toString(),
      provider.isStrategicPartner ? "Sim" : "Não",
      provider.differentials.join(", "),
    ]

    if (data.filters.includeContactInfo) {
      base.push(provider.phone || "", provider.email || "")
    }

    return base
  })

  
  const content = [headers, ...rows]
    .map((row) => row.map(escape).join(delimiter))
    .join("\r\n")

  return "\uFEFF" + `sep=${delimiter}\r\n` + content
}
