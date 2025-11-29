"use client"

import { useEffect, useState, useMemo } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { ReportFilters } from "@/components/reports/report-filters"
import { ReportPreview } from "@/components/reports/report-preview"
import { ExportOptions } from "@/components/reports/export-options"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, RefreshCw } from "lucide-react"
import { generateReportData, type ReportFilters as ReportFiltersType } from "@/lib/report-utils"
import type { Provider } from "@/lib/types"
import { getCredenciados } from "@/lib/api"
import { mapApiCredenciadoToProvider } from "@/lib/utils"

export default function RelatoriosPage() {
  const [filters, setFilters] = useState<ReportFiltersType>({
    includeStrategicIndicators: true,
    includePerformanceMetrics: true,
    includeContactInfo: false,
  })
  const [reportGenerated, setReportGenerated] = useState(false)
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const apiList = await getCredenciados()
        const mapped = Array.isArray(apiList) ? apiList.map(mapApiCredenciadoToProvider) : []
        setProviders(mapped)
      } catch (e: any) {
        setError(e?.message || 'Erro ao carregar dados para relatórios')
        setProviders([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const reportData = useMemo(() => {
    return generateReportData(providers, filters)
  }, [filters, providers])

  const handleGenerateReport = () => {
    setReportGenerated(true)
  }

  const handleResetFilters = () => {
    setFilters({
      includeStrategicIndicators: true,
      includePerformanceMetrics: true,
      includeContactInfo: false,
    })
    setReportGenerated(false)
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Relatórios Personalizados</h1>
          <p className="text-muted-foreground mt-2">
            Gere relatórios detalhados da rede credenciada com filtros personalizados e exporte em diferentes formatos
          </p>
        </div>

        {}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Visão Geral dos Dados
            </CardTitle>
            <CardDescription>Estatísticas gerais da base de dados disponível para relatórios</CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-red-600">{error}</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{providers.length}</div>
                  <div className="text-sm text-muted-foreground">Total de Prestadores</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {providers.filter((p) => p.status === "active").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Prestadores Ativos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {providers.filter((p) => p.isStrategicPartner).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Parceiros Estratégicos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {new Set(providers.map((p) => `${p.location.city}-${p.location.state}`)).size}
                  </div>
                  <div className="text-sm text-muted-foreground">Cidades Cobertas</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {}
        <ReportFilters providers={providers} filters={filters} onFiltersChange={setFilters} />

        {}
        <div className="flex items-center gap-4">
          <Button onClick={handleGenerateReport} size="lg">
            <FileText className="h-4 w-4 mr-2" />
            Gerar Relatório
          </Button>
          <Button onClick={handleResetFilters} variant="outline" size="lg">
            <RefreshCw className="h-4 w-4 mr-2" />
            Resetar Filtros
          </Button>
        </div>

        {}
        {reportGenerated && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ReportPreview reportData={reportData} />
            </div>
            <div>
              <ExportOptions reportData={reportData} />
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
