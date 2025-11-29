"use client"

import { useEffect, useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ProviderCard } from "@/components/search/provider-card"
import { getCredenciados } from "@/lib/api"
import { Search, Users, Filter, Loader2 } from "lucide-react"
import type { Provider } from "@/lib/types"
import { normalizeComplexityLabel } from "@/lib/utils"

export default function PrestadoresPage() {
  const [filterNome, setFilterNome] = useState("")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterTipo, setFilterTipo] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [providers, setProviders] = useState<Provider[]>([])

  
  const mapApiToProvider = (api: any): Provider => {
    const statusMap: Record<string, Provider["status"]> = {
      "Ativo": "active",
      "Inativo": "inactive",
      "Em Análise": "under_review",
      "Contrato Encerrado": "contract_ended",
    }
    const typeMap: Record<string, Provider["type"]> = {
      "Clínica": "clinic",
      "Hospital": "hospital",
      "Laboratório": "laboratory",
      "Diagnóstico": "diagnostic",
      "Médico": "clinic",
    }

    const specialties = Array.isArray(api.especialidades)
      ? api.especialidades.map((e: any) => (typeof e === 'string' ? e : e?.descricao || "")).filter(Boolean)
      : []
    const differentials = Array.isArray(api.diferenciais)
      ? api.diferenciais.map((d: any) => (typeof d === 'string' ? d : d?.descricao || "")).filter(Boolean)
      : []
  const clabel = normalizeComplexityLabel(api.complexidade)
  const complexity = clabel ? [clabel] : []

    return {
      id: String(api.id),
      name: api.nome || api.name || "",
      corporateName: api.corporateName || api.razao_social || api.nome || "",
      location: {
        address: api.logradouro || api.endereco || "",
        city: api.cidade || "",
        state: api.estado || "",
        neighborhood: api.bairro || "",
        coordinates: { lat: Number(api.latitude || 0), lng: Number(api.longitude || 0) },
      },
      specialties,
      complexity,
      differentials,
      type: typeMap[api.tipo] || (api.type as Provider["type"]) || "clinic",
      status: statusMap[api.status] || (api.status as Provider["status"]) || "inactive",
  averageAppointmentTime: Number(api.tempo_medio_agendamento ?? api.averageAppointmentTime ?? 0),
  averageProcedureTime: Number(api.tempo_medio_procedimento ?? api.averageProcedureTime ?? 0),
      isStrategicPartner: !!api.parceiro_estrategico || !!api.parceiroEstrategico,
      contractStartDate: api.data_contrato || api.contractStartDate || new Date().toISOString(),
      lastUpdate: api.ultima_atualizacao || api.lastUpdate || new Date().toISOString(),
      phone: api.telefone || api.phone,
      email: api.email || api.email,
    }
  }

  const loadProviders = async () => {
    setIsLoading(true)
    try {
      const data = await getCredenciados({
        nome: filterNome,
        status: filterStatus === 'all' ? '' : filterStatus,
        tipo: filterTipo === 'all' ? '' : filterTipo,
      })
      const mapped: Provider[] = Array.isArray(data) ? data.map(mapApiToProvider) : []
      setProviders(mapped)
    } catch (e) {
      console.error('Erro ao carregar prestadores:', e)
      setProviders([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProviders()
    
  }, [])

  const handleSearch = async () => {
    await loadProviders()
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gerenciar Prestadores</h1>
          <p className="text-muted-foreground mt-2">Visualize e gerencie todos os prestadores da rede credenciada</p>
        </div>

        {}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
            <CardDescription>Filtros iguais aos da Consulta de Rede</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="text-sm font-medium" htmlFor="filterNome">Buscar por nome</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="filterNome" className="pl-10" placeholder="Digite o nome do prestador..." value={filterNome} onChange={(e) => setFilterNome(e.target.value)} />
                </div>
              </div>

              <div className="w-48">
                <label className="text-sm font-medium" htmlFor="filterStatus">Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger id="filterStatus">
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Inativo">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="w-48">
                <label className="text-sm font-medium" htmlFor="filterTipo">Tipo</label>
                <Select value={filterTipo} onValueChange={setFilterTipo}>
                  <SelectTrigger id="filterTipo">
                    <SelectValue placeholder="Todos os tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="Médico">Médico</SelectItem>
                    <SelectItem value="Clínica">Clínica</SelectItem>
                    <SelectItem value="Hospital">Hospital</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex">
                <Button className="h-10 self-end" onClick={handleSearch}>Buscar</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Prestadores ({providers.length})
            </CardTitle>
            <CardDescription>Lista completa dos prestadores encontrados</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : providers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Nenhum prestador encontrado</h3>
                <p className="text-muted-foreground">Tente ajustar os filtros para encontrar prestadores.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {providers.map((provider) => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
