"use client"

import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { MainLayout } from "@/components/layout/main-layout"
import { ProviderHeader } from "@/components/provider/provider-header"
import { ProviderStats } from "@/components/provider/provider-stats"
import { ProviderDetails } from "@/components/provider/provider-details"
import { ProviderMap } from "@/components/provider/provider-map"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Loader2 } from "lucide-react"
import type { Provider } from "@/lib/types"
import { getCredenciado, updateCredenciado, getEspecialidades, getDiferenciais, createEspecialidade, createDiferencial } from "@/lib/api"
import { normalizeComplexityLabel } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"

interface ProviderPageProps {
  params: {
    id: string
  }
}

export default function ProviderPage({ params }: ProviderPageProps) {
  const [provider, setProvider] = useState<Provider | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [form, setForm] = useState<any>({})
  const [especialidadesOptions, setEspecialidadesOptions] = useState<any[]>([])
  const [diferenciaisOptions, setDiferenciaisOptions] = useState<any[]>([])
  
  const [newEspecialidade, setNewEspecialidade] = useState("")
  const [newDiferencial, setNewDiferencial] = useState("")
  const [creatingEsp, setCreatingEsp] = useState(false)
  const [creatingDif, setCreatingDif] = useState(false)
  const newEspecialidadeRef = useRef<HTMLInputElement | null>(null)
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { canEdit } = useAuth()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const api = await getCredenciado(params.id)
        
        const mapped: Provider = {
          id: String(api.id),
          credenciamento: api.credenciamento ? String(api.credenciamento) : undefined,
          name: api.nome || api.name || "",
          corporateName: api.corporateName || api.razao_social || api.nome || "",
          location: {
            address: api.logradouro || api.endereco || "",
            neighborhood: api.bairro || "",
            city: api.cidade || "",
            state: api.estado || "",
            coordinates: api.latitude && api.longitude
              ? { lat: Number(api.latitude), lng: Number(api.longitude) }
              : { lat: 0, lng: 0 },
          },
          specialties: Array.isArray(api.especialidades)
            ? api.especialidades.map((e: any) => (typeof e === 'string' ? e : e?.descricao || "")).filter(Boolean)
            : (api.specialties || []),
          
          complexity: (() => { const c = normalizeComplexityLabel(api.complexidade); return c ? [c] : [] })(),
          differentials: Array.isArray(api.diferenciais)
            ? api.diferenciais.map((d: any) => (typeof d === 'string' ? d : d?.descricao || "")).filter(Boolean)
            : (api.differentials || []),
          type: (api.tipo || api.type || 'clinic') as Provider["type"],
          status: (api.status && api.status.toLowerCase && api.status.toLowerCase() === 'ativo')
            ? 'active'
            : ((api.status || 'inactive') as Provider["status"]),
          averageAppointmentTime: Number(api.tempo_medio_agendamento ?? api.averageAppointmentTime ?? 0),
          averageProcedureTime: Number(api.tempo_medio_procedimento ?? api.averageProcedureTime ?? 0),
          isStrategicPartner: !!api.parceiro_estrategico || !!api.parceiroEstrategico,
          contractStartDate: api.data_contrato || api.contractStartDate || '',
          lastUpdate: api.ultima_atualizacao || api.lastUpdate || new Date().toISOString(),
          phone: api.telefone || api.phone,
          email: api.email || api.email,
        }
        setProvider(mapped)
        
        setForm({
          credenciamento: api.credenciamento ? String(api.credenciamento) : '',
          nome: mapped.name,
          telefone: mapped.phone || "",
          email: mapped.email || "",
          status: mapped.status === 'active' ? 'Ativo' : mapped.status === 'inactive' ? 'Inativo' : (mapped.status || ''),
          tipo: mapped.type === 'clinic' ? 'Clínica' : mapped.type === 'hospital' ? 'Hospital' : (mapped.type || ''),
          cidade: mapped.location.city || "",
          estado: mapped.location.state || "",
          latitude: mapped.location.coordinates?.lat ?? '',
          longitude: mapped.location.coordinates?.lng ?? '',
          complexidade: (mapped.complexity && mapped.complexity[0]) || "",
          data_contrato: (api.data_contrato ? String(api.data_contrato).slice(0, 10) : ''),
          tempo_medio_procedimento: mapped.averageProcedureTime || 0,
          tempo_medio_agendamento: mapped.averageAppointmentTime || 0,
          parceiro_estrategico: !!mapped.isStrategicPartner,
          especialidades_ids: Array.isArray(api.especialidades) ? api.especialidades.map((e: any) => e.id) : [],
          diferenciais_ids: Array.isArray(api.diferenciais) ? api.diferenciais.map((d: any) => d.id) : [],
        })
      } catch (e: any) {
        setError(e?.message || 'Erro ao carregar prestador')
        setProvider(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.id])

  useEffect(() => {
    
    const e = searchParams?.get('edit')
    if (e === '1' || e === 'true') {
      setIsEditOpen(true)
      setTimeout(() => newEspecialidadeRef.current?.focus(), 100)
    }
  }, [searchParams])

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const [esps, difs] = await Promise.all([
          getEspecialidades(),
          getDiferenciais(),
        ])
        setEspecialidadesOptions(esps)
        setDiferenciaisOptions(difs)
      } catch (e) {
        
      }
    }
    loadOptions()
  }, [])

  const handleChange = (field: string, value: any) => {
    setForm((f: any) => ({ ...(f || {}), [field]: value }))
  }

  const toggleArrayField = (field: string, id: number) => {
    setForm((s: any) => {
      const arr = Array.isArray(s[field]) ? [...s[field]] : []
      const idx = arr.indexOf(id)
      if (idx === -1) arr.push(id)
      else arr.splice(idx, 1)
      return { ...s, [field]: arr }
    })
  }

  const handleCreateEspecialidade = async () => {
    const descricao = (newEspecialidade || '').toString().trim()
    if (!descricao) return
    try {
      setCreatingEsp(true)
      const created = await createEspecialidade(descricao)
      setEspecialidadesOptions((s) => [...s, created])
      setForm((f: any) => ({ ...(f || {}), especialidades_ids: Array.isArray(f?.especialidades_ids) ? [...f.especialidades_ids, created.id] : [created.id] }))
      setNewEspecialidade('')
      toast({ title: 'Criado', description: 'Especialidade adicionada' })
    } catch (e: any) {
      toast({ title: 'Erro', description: e?.message || 'Não foi possível criar especialidade' })
    } finally {
      setCreatingEsp(false)
    }
  }

  const handleCreateDiferencial = async () => {
    const descricao = (newDiferencial || '').toString().trim()
    if (!descricao) return
    try {
      setCreatingDif(true)
      const created = await createDiferencial(descricao)
      setDiferenciaisOptions((s) => [...s, created])
      setForm((f: any) => ({ ...(f || {}), diferenciais_ids: Array.isArray(f?.diferenciais_ids) ? [...f.diferenciais_ids, created.id] : [created.id] }))
      setNewDiferencial('')
      toast({ title: 'Criado', description: 'Diferencial adicionado' })
    } catch (e: any) {
      toast({ title: 'Erro', description: e?.message || 'Não foi possível criar diferencial' })
    } finally {
      setCreatingDif(false)
    }
  }

  const handleSave = async () => {
    if (!canEdit) {
      toast({ title: 'Sem permissão', description: 'Seu usuário não pode editar credenciados.' })
      return
    }
    if (!params.id) return
    if (!form.nome || String(form.nome).trim() === '') {
      toast({ title: 'Campo obrigatório', description: 'O nome é obrigatório' })
      return
    }
    setIsSaving(true)
    try {
      
      const payload: any = { ...form }
      if (payload.latitude === '' || payload.latitude === undefined) payload.latitude = null
      if (payload.longitude === '' || payload.longitude === undefined) payload.longitude = null
      if (typeof payload.latitude === 'string') payload.latitude = Number(payload.latitude)
      if (typeof payload.longitude === 'string') payload.longitude = Number(payload.longitude)
      await updateCredenciado(params.id, payload)
      
      const refreshed = await getCredenciado(params.id)
      const mapped: Provider = {
        id: String(refreshed.id),
        credenciamento: refreshed.credenciamento ? String(refreshed.credenciamento) : undefined,
        name: refreshed.nome || '',
        corporateName: refreshed.corporateName || refreshed.razao_social || refreshed.nome || '',
        location: {
          address: refreshed.logradouro || refreshed.endereco || '',
          neighborhood: refreshed.bairro || '',
          city: refreshed.cidade || '',
          state: refreshed.estado || '',
          coordinates: refreshed.latitude && refreshed.longitude ? { lat: Number(refreshed.latitude), lng: Number(refreshed.longitude) } : { lat: 0, lng: 0 },
        },
        specialties: Array.isArray(refreshed.especialidades) ? refreshed.especialidades.map((e: any) => e?.descricao || '').filter(Boolean) : [],
  complexity: (() => { const c = normalizeComplexityLabel(refreshed.complexidade); return c ? [c] : [] })(),
        differentials: Array.isArray(refreshed.diferenciais) ? refreshed.diferenciais.map((d: any) => d?.descricao || '').filter(Boolean) : [],
        type: (refreshed.tipo || 'clinic') as Provider['type'],
        status: (refreshed.status && refreshed.status.toLowerCase && refreshed.status.toLowerCase() === 'ativo') ? 'active' as Provider['status'] : 'inactive',
  averageAppointmentTime: Number(refreshed.tempo_medio_agendamento ?? 0),
  averageProcedureTime: Number(refreshed.tempo_medio_procedimento ?? 0),
        isStrategicPartner: !!refreshed.parceiro_estrategico,
  contractStartDate: refreshed.data_contrato || '',
        lastUpdate: refreshed.ultima_atualizacao || new Date().toISOString(),
        phone: refreshed.telefone || '',
        email: refreshed.email || '',
      }
      setProvider(mapped)
      toast({ title: 'Salvo', description: 'Credenciado atualizado com sucesso' })
      setIsEditOpen(false)
    } catch (e: any) {
      toast({ title: 'Erro', description: e?.message || 'Erro ao salvar' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {}
        <div>
          <Link href="/prestadores">
            <Button variant="outline" className="mb-4 bg-transparent">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar à Lista
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <div className="text-center py-16 text-red-600">{error}</div>
        ) : provider ? (
          <>
            {}
            <ProviderHeader provider={provider} onEdit={() => { setIsEditOpen(true); setTimeout(()=> newEspecialidadeRef.current?.focus(), 80) }} />

            {}
            <ProviderStats provider={provider} />

            {}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ProviderDetails provider={provider} />
              </div>
              <div>
                <ProviderMap provider={provider} />
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16">Prestador não encontrado</div>
        )}
        {}
        <Dialog open={isEditOpen && canEdit} onOpenChange={setIsEditOpen}>
          <DialogContent className="fixed inset-0 sm:inset-auto sm:top-[50%] sm:left-[50%] translate-x-0 translate-y-0 sm:translate-x-[-50%] sm:translate-y-[-50%] w-screen h-screen p-4 sm:w-[min(98vw,1800px)] sm:max-w-[min(98vw,1800px)] sm:h-[96vh] sm:rounded-lg sm:p-6">
            <DialogHeader>
              <DialogTitle>Editar Credenciado</DialogTitle>
              <DialogDescription>{provider?.name}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              <div className="bg-card border rounded-lg p-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="credenciamento">Código de credenciamento</Label>
                    <Input id="credenciamento" value={form.credenciamento || ''} onChange={(e) => handleChange('credenciamento', e.target.value)} />
                    <Label htmlFor="nome">Nome</Label>
                    <Input id="nome" value={form.nome || ''} onChange={(e) => handleChange('nome', e.target.value)} />
                    <Label htmlFor="corporate">Razão Social</Label>
                    <Input id="corporate" value={form.corporateName || ''} onChange={(e) => handleChange('corporateName', e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="tipo">Tipo</Label>
                    <Input id="tipo" value={form.tipo || ''} onChange={(e) => handleChange('tipo', e.target.value)} />
                    <Label htmlFor="status">Status</Label>
                    <Input id="status" value={form.status || ''} onChange={(e) => handleChange('status', e.target.value)} />
                    <Label htmlFor="complexidade">Complexidade</Label>
                    <Input id="complexidade" value={form.complexidade || ''} onChange={(e) => handleChange('complexidade', e.target.value)} />
                    <Label htmlFor="data_contrato" className="mt-2">Data de início do contrato</Label>
                    <Input id="data_contrato" type="date" value={form.data_contrato || ''} onChange={(e) => handleChange('data_contrato', e.target.value)} />
                    <div className="mt-3 grid grid-cols-1 gap-2">
                      <div>
                        <Label htmlFor="tempo_medio_agendamento">Tempo médio agendamento (dias)</Label>
                        <Input id="tempo_medio_agendamento" type="number" value={form.tempo_medio_agendamento ?? 0} onChange={(e) => handleChange('tempo_medio_agendamento', Number(e.target.value))} />
                      </div>
                      <div>
                        <Label htmlFor="tempo_medio_procedimento">Tempo médio procedimento (dias)</Label>
                        <Input id="tempo_medio_procedimento" type="number" value={form.tempo_medio_procedimento ?? 0} onChange={(e) => handleChange('tempo_medio_procedimento', Number(e.target.value))} />
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <label className="flex items-center gap-2" htmlFor="parceiro_estrategico">
                          <Checkbox id="parceiro_estrategico" checked={!!form.parceiro_estrategico} onCheckedChange={(v) => handleChange('parceiro_estrategico', !!v)} />
                          <span className="text-sm">Parceiro estratégico</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="bg-card border rounded-lg p-4">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input id="telefone" value={form.telefone || ''} onChange={(e) => handleChange('telefone', e.target.value)} />
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" value={form.email || ''} onChange={(e) => handleChange('email', e.target.value)} />
                </div>

                <div className="bg-card border rounded-lg p-4">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input id="cidade" value={form.cidade || ''} onChange={(e) => handleChange('cidade', e.target.value)} />
                  <Label htmlFor="estado">Estado</Label>
                  <Input id="estado" value={form.estado || ''} onChange={(e) => handleChange('estado', e.target.value)} />
                </div>

                <div className="bg-card border rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="latitude">Latitude</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="0.000001"
                        value={form.latitude ?? ''}
                        onChange={(e) => handleChange('latitude', e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="Ex: -23.550520"
                      />
                    </div>
                    <div>
                      <Label htmlFor="longitude">Longitude</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="0.000001"
                        value={form.longitude ?? ''}
                        onChange={(e) => handleChange('longitude', e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="Ex: -46.633308"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Preencha para posicionar o prestador no mapa.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="bg-card border rounded-lg p-4">
                  <div className="font-medium mb-2">Especialidades</div>
                  <div className="flex gap-2 mb-3">
                    <Input ref={newEspecialidadeRef} value={newEspecialidade} onChange={(e) => setNewEspecialidade(e.target.value)} placeholder="Adicionar especialidade" />
                    <Button size="sm" onClick={handleCreateEspecialidade} disabled={creatingEsp || (newEspecialidade || '').toString().trim() === ''}>{creatingEsp ? '...' : 'Adicionar'}</Button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-auto">
                    {especialidadesOptions.map((opt) => (
                      <label key={opt.id} className="flex items-center gap-2">
                        <Checkbox
                          checked={Array.isArray(form.especialidades_ids) && form.especialidades_ids.includes(opt.id)}
                          onCheckedChange={() => toggleArrayField('especialidades_ids', opt.id)}
                        />
                        <span className="text-sm">{opt.descricao}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {}

                <div className="bg-card border rounded-lg p-4">
                  <div className="font-medium mb-2">Diferenciais</div>
                  <div className="flex gap-2 mb-3">
                    <Input value={newDiferencial} onChange={(e) => setNewDiferencial(e.target.value)} placeholder="Adicionar diferencial" />
                    <Button size="sm" onClick={handleCreateDiferencial} disabled={creatingDif || (newDiferencial || '').toString().trim() === ''}>{creatingDif ? '...' : 'Adicionar'}</Button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-auto">
                    {diferenciaisOptions.map((opt) => (
                      <label key={opt.id} className="flex items-center gap-2">
                        <Checkbox
                          checked={Array.isArray(form.diferenciais_ids) && form.diferenciais_ids.includes(opt.id)}
                          onCheckedChange={() => toggleArrayField('diferenciais_ids', opt.id)}
                        />
                        <span className="text-sm">{opt.descricao}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {}
              </div>
            </div>

            <DialogFooter>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditOpen(false)} disabled={isSaving}>Cancelar</Button>
                <Button onClick={handleSave} disabled={isSaving || !canEdit}>{isSaving ? 'Salvando...' : 'Salvar'}</Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}
