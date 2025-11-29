"use client"

import { useState, useMemo, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { MapFilters } from "@/components/map/map-filters"
import { NetworkMap } from "@/components/map/network-map"
import { CoverageStats } from "@/components/map/coverage-stats"
import type { Provider } from "@/lib/types"
import { getCredenciados } from "@/lib/api"
import { mapApiCredenciadoToProvider } from "@/lib/utils"

interface Filters {
  status?: string
  specialty?: string
  type?: string
  isStrategicPartner?: boolean
}

export default function MapaPage() {
  const [filters, setFilters] = useState<Filters>({})
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const apiList = await getCredenciados()
        const mapped = Array.isArray(apiList)
          ? apiList.map(mapApiCredenciadoToProvider)
          : []
        
        setProviders(mapped)
      } catch (e: any) {
        setError(e?.message || 'Erro ao carregar prestadores')
        setProviders([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filteredProviders = useMemo(() => {
    return providers.filter((provider: Provider) => {
      if (filters.status && provider.status !== filters.status) return false
      if (filters.specialty && !provider.specialties.includes(filters.specialty)) return false
      if (filters.type && provider.type !== filters.type) return false
      if (filters.isStrategicPartner && !provider.isStrategicPartner) return false
      return true
    })
  }, [filters, providers])

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters({})
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mapa da Rede Credenciada</h1>
          <p className="text-muted-foreground mt-2">
            Visualização geográfica interativa dos prestadores com filtros por status, especialidade e região
          </p>
        </div>

        {error ? (
          <div className="text-red-600">{error}</div>
        ) : (
          <>
            {}
            <MapFilters
              providers={providers}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />

            {}
            <NetworkMap providers={filteredProviders} />

            {}
            <CoverageStats providers={filteredProviders} />
          </>
        )}
      </div>
    </MainLayout>
  )
}
