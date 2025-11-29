"use client"

import { useEffect, useState, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { MainLayout } from "../../components/layout/main-layout"
import { getCredenciados, getCredenciado, updateCredenciado, getEspecialidades, getDiferenciais, createEspecialidade, createDiferencial } from "../../lib/api"
import { normalizeComplexityLabel } from "../../lib/utils"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../components/ui/dialog"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Loader2, Edit, Eye, Search } from "lucide-react"
import { Checkbox } from "../../components/ui/checkbox"
import { ProviderHeader } from "../../components/provider/provider-header"
import { ProviderDetails } from "../../components/provider/provider-details"
import { useToast } from "../../hooks/use-toast"

export default function ConsultaPage() {
  const [providers, setProviders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterNome, setFilterNome] = useState<string>('')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [filterTipo, setFilterTipo] = useState<string>('')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [selectedProvider, setSelectedProvider] = useState<any | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState<any>({})
  const [saving, setSaving] = useState(false)
  const [especialidadesOptions, setEspecialidadesOptions] = useState<any[]>([])
  const [diferenciaisOptions, setDiferenciaisOptions] = useState<any[]>([])
  
  const [newEspecialidade, setNewEspecialidade] = useState<string>('')
  const [newDiferencial, setNewDiferencial] = useState<string>('')
  const [creatingEspecialidade, setCreatingEspecialidade] = useState(false)
  const [creatingDiferencial, setCreatingDiferencial] = useState(false)
  const newEspecialidadeRef = useRef<HTMLInputElement | null>(null)
  const newDiferencialRef = useRef<HTMLInputElement | null>(null)
  const [debugMessages, setDebugMessages] = useState<string[]>([])
  const searchParams = useSearchParams()

  const addDebug = (msg: string) => {
    try {
      setDebugMessages((s) => [new Date().toLocaleTimeString() + ' - ' + msg, ...s].slice(0, 20))
    } catch (e) {
    }
    try { console.log(msg) } catch (e) {}
  }

  useEffect(() => {
    loadProviders()
  }, [])

  
  useEffect(() => {
    const idParam = searchParams?.get('id')
    const editParam = searchParams?.get('edit')
    if (idParam) {
      const idNum = Number(idParam)
      if (!Number.isNaN(idNum)) {
        openDetails(idNum)
        if (editParam === '1' || editParam === 'true') {
          setIsEditing(true)
        }
      }
    }
    
  }, [searchParams])

  const loadProviders = async () => {
    setIsLoading(true)
    try {
      const data = await getCredenciados({ nome: filterNome, status: filterStatus, tipo: filterTipo })
      setProviders(data)
    } catch (err) {
      console.error("Erro ao carregar credenciados:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async () => {
    await loadProviders()
  }

  const loadOptions = async () => {
    try {
      const [esps, difs] = await Promise.all([getEspecialidades(), getDiferenciais()])
      setEspecialidadesOptions(esps)
      setDiferenciaisOptions(difs)
    } catch (e) {
      console.warn('Não foi possível carregar opções relacionadas:', e)
    }
  }

  const handleCreateEspecialidade = async () => {
    addDebug(`handleCreateEspecialidade called: ${newEspecialidade}`)
    const descricao = (newEspecialidade || '').toString().trim()
    if (!descricao) {
      addDebug('handleCreateEspecialidade: descrição vazia, abortando')
      toast({ title: 'Aviso', description: 'Digite a especialidade antes de adicionar' })
      return
    }
    try {
  setCreatingEspecialidade(true)
      const created = await createEspecialidade(descricao)
  addDebug(`createEspecialidade returned id=${created?.id}`)
      setEspecialidadesOptions((s) => [...s, created])
      setForm((f: any) => ({ ...(f || {}), especialidades_ids: Array.isArray(f?.especialidades_ids) ? [...f.especialidades_ids, created.id] : [created.id] }))
      setNewEspecialidade('')
      toast({ title: 'Criado', description: 'Especialidade adicionada' })
    } catch (e) {
      addDebug(`Erro ao criar especialidade: ${String(e)}`)
      console.error('Erro ao criar especialidade', e)
      toast({ title: 'Erro', description: e instanceof Error ? e.message : 'Não foi possível criar especialidade' })
    } finally {
      setCreatingEspecialidade(false)
    }
  }

  const handleCreateDiferencial = async () => {
    addDebug(`handleCreateDiferencial called: ${newDiferencial}`)
    const descricao = (newDiferencial || '').toString().trim()
    if (!descricao) {
      addDebug('handleCreateDiferencial: descrição vazia, abortando')
      toast({ title: 'Aviso', description: 'Digite o diferencial antes de adicionar' })
      return
    }
    try {
  setCreatingDiferencial(true)
  const created = await createDiferencial(descricao)
  addDebug(`createDiferencial returned id=${created?.id}`)
      setDiferenciaisOptions((s) => [...s, created])
      setForm((f: any) => ({ ...(f || {}), diferenciais_ids: Array.isArray(f?.diferenciais_ids) ? [...f.diferenciais_ids, created.id] : [created.id] }))
      setNewDiferencial('')
      toast({ title: 'Criado', description: 'Diferencial adicionado' })
    } catch (e) {
      addDebug(`Erro ao criar diferencial: ${String(e)}`)
      console.error('Erro ao criar diferencial', e)
      toast({ title: 'Erro', description: e instanceof Error ? e.message : 'Não foi possível criar diferencial' })
    } finally {
      setCreatingDiferencial(false)
    }
  }

  useEffect(() => {
    loadOptions()
  }, [])


  useEffect(() => {
    if (isEditing) {
      try {
        setTimeout(() => {
          newEspecialidadeRef?.current?.focus()
        }, 80)
      } catch (e) {
      }
    }
  }, [isEditing])

  const { toast } = useToast()

  const openDetails = async (id: number) => {
    setSelectedId(id)
    setIsDialogOpen(true)
    setIsEditing(false)

    const local = providers.find((p) => p.id === id) || null
    setSelectedProvider(local)
    setForm({
      nome: local?.nome || "",
      telefone: local?.telefone || "",
      email: local?.email || "",
      status: local?.status || "",
      tipo: local?.tipo || "",
      cidade: local?.cidade || "",
      estado: local?.estado || "",
  tempo_medio_procedimento: Number(local?.tempo_medio_procedimento ?? local?.averageProcedureTime ?? 0),
  tempo_medio_agendamento: Number(local?.tempo_medio_agendamento ?? local?.averageAppointmentTime ?? 0),
      parceiro_estrategico: !!local?.parceiro_estrategico || !!local?.isStrategicPartner || false,
      data_contrato: local?.data_contrato ? String(local.data_contrato).slice(0,10) : '',
    })

    try {
      const full = await getCredenciado(id)
      setSelectedProvider(full)
      setForm((f: any) => ({
        ...f,
        nome: full.nome || f.nome,
        telefone: full.telefone || f.telefone,
        email: full.email || f.email,
        status: full.status || f.status,
        complexidade: full.complexidade || f.complexidade,
        tipo: full.tipo || f.tipo,
        cidade: full.cidade || f.cidade,
        estado: full.estado || f.estado,
  tempo_medio_procedimento: Number(full.tempo_medio_procedimento ?? full.averageProcedureTime ?? f.tempo_medio_procedimento ?? 0),
  tempo_medio_agendamento: Number(full.tempo_medio_agendamento ?? full.averageAppointmentTime ?? f.tempo_medio_agendamento ?? 0),
        parceiro_estrategico: !!full.parceiro_estrategico || !!full.isStrategicPartner || f.parceiro_estrategico || false,
        especialidades_ids: (full.especialidades || []).map((e: any) => e.id),
        diferenciais_ids: (full.diferenciais || []).map((d: any) => d.id),
        data_contrato: full.data_contrato ? String(full.data_contrato).slice(0,10) : f.data_contrato || '',
      }))
    } catch (err) {
      console.warn('Erro ao carregar detalhes completos:', err)
    }
  }

  const closeDialog = () => {
    setIsDialogOpen(false)
    setSelectedId(null)
    setSelectedProvider(null)
    setIsEditing(false)
  }

  const handleChange = (field: string, value: any) => {
    setForm((s: any) => ({ ...s, [field]: value }))
  }

  const toggleArrayField = (field: string, id: number) => {
    setForm((s: any) => {
      const arr = Array.isArray(s[field]) ? [...s[field]] : []
      const idx = arr.indexOf(id)
      if (idx === -1) arr.push(id)
      else arr.splice(idx, 1)
      addDebug(`toggleArrayField ${field} -> [${arr.join(',')}]`)
      return { ...s, [field]: arr }
    })
  }

  const handleSave = async () => {
    if (!selectedId) return
    addDebug(`handleSave called for id=${selectedId}`)
    setSaving(true)
    if (!form.nome || form.nome.toString().trim() === '') {
      toast({ title: 'Campo obrigatório', description: 'O nome é obrigatório' })
      setSaving(false)
      return
    }
    const prev = providers.slice()
    const updatedLocal = { ...(selectedProvider || {}), ...form }

    setProviders((prevList) => prevList.map((p) => (p.id === selectedId ? { ...p, ...form } : p)))
    setSelectedProvider(updatedLocal)

    try {
      const result = await updateCredenciado(selectedId, form)
      addDebug(`updateCredenciado returned ${result ? 'ok' : 'no-result'}`)
      if (result) {
        const updated = {
          id: result.id,
          nome: result.nome || form.nome,
          telefone: result.telefone || form.telefone,
          email: result.email || form.email,
          status: result.status || form.status,
          tipo: result.tipo || form.tipo,
          cidade: result.cidade || form.cidade,
          estado: result.estado || form.estado,
          complexidade: result.complexidade || form.complexidade,
          especialidades: result.especialidades || [],
          diferenciais: result.diferenciais || [],
          redes: result.redes || [],
            data_contrato: result.data_contrato || (selectedProvider && selectedProvider.data_contrato) || null,
            ultima_atualizacao: result.ultima_atualizacao || (selectedProvider && selectedProvider.ultima_atualizacao) || null,
        }

        setProviders((prevList) => prevList.map((p) => (p.id === selectedId ? { ...p, ...updated } : p)))
        setSelectedProvider((sp: any) => ({ ...(sp || {}), ...updated }))
      }

    toast({ title: 'Salvo', description: 'Credenciado atualizado com sucesso' })
    addDebug('Salvo com sucesso')
    
    setIsEditing(true)
    } catch (err) {
      setProviders(prev)
      const reverted = prev.find((p) => p.id === selectedId) || null
      setSelectedProvider(reverted)
      console.error("Erro ao salvar:", err)
      toast({ title: 'Erro', description: err instanceof Error ? err.message : 'Erro ao salvar' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Consultar Rede de Prestadores</h1>
          <p className="text-muted-foreground mt-2">Lista de prestadores importados — clique em um item para ver detalhes e editar</p>
        </div>

        {}
        <div className="bg-card border rounded-lg p-4">
          <div className="flex flex-col lg:flex-row gap-4 items-end">
            <div className="flex-1 relative">
              <Label htmlFor="filterNome">Buscar por nome</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"><Search className="h-4 w-4" /></span>
                <Input id="filterNome" className="pl-10" placeholder="Digite o nome do prestador..." value={filterNome} onChange={(e) => setFilterNome(e.target.value)} />
              </div>
            </div>

            <div className="w-48">
              <Label htmlFor="filterStatus">Status</Label>
              <select id="filterStatus" className="w-full rounded-md border px-3 py-2" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="">Todos os status</option>
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>

            <div className="w-48">
              <Label htmlFor="filterTipo">Tipo</Label>
              <select id="filterTipo" className="w-full rounded-md border px-3 py-2" value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)}>
                <option value="">Todos os tipos</option>
                <option value="Médico">Médico</option>
                <option value="Clínica">Clínica</option>
                <option value="Hospital">Hospital</option>
              </select>
            </div>

            <div className="flex">
              <Button className="h-10 self-end" onClick={handleSearch}>Buscar</Button>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Resultados</CardTitle>
            <CardDescription>Exibindo credenciados buscados no banco de dados</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : providers.length === 0 ? (
              <div className="text-center py-8">Nenhum credenciado encontrado</div>
            ) : (
              <div className="space-y-3">
                {providers.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{p.nome}</div>
                      <div className="text-sm text-muted-foreground">{p.tipo || '-'} • {p.cidade || '-'} - {p.estado || '-'}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openDetails(p.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => { openDetails(p.id); setIsEditing(true) }}>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

    <Dialog open={isDialogOpen} onOpenChange={(v) => { if (!v) closeDialog(); else setIsDialogOpen(true) }}>
  <DialogContent className={"fixed inset-0 sm:inset-auto sm:top-[50%] sm:left-[50%] " +
    "translate-x-0 translate-y-0 sm:translate-x-[-50%] sm:translate-y-[-50%] " +
    "w-screen h-screen p-4 sm:w-[min(98vw,1800px)] sm:max-w-[min(98vw,1800px)] sm:h-[96vh] sm:rounded-lg sm:p-6"}>
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Editar Credenciado' : 'Detalhes do Credenciado'}</DialogTitle>
              <DialogDescription>{selectedProvider ? selectedProvider.nome : 'Carregando...'}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {selectedProvider ? (
                isEditing ? (
                  <div className="space-y-4">
                    <div className="bg-card border rounded-lg p-4">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="nome">Nome</Label>
                          <Input id="nome" value={form.nome} onChange={(e) => handleChange('nome', e.target.value)} />
                          <Label htmlFor="corporate">Razão Social</Label>
                          <Input id="corporate" value={form.corporateName || ''} onChange={(e) => handleChange('corporateName', e.target.value)} />
                        </div>
                        <div>
                          <Label htmlFor="tipo">Tipo</Label>
                          <Input id="tipo" value={form.tipo} onChange={(e) => handleChange('tipo', e.target.value)} />
                          <Label htmlFor="status">Status</Label>
                          <Input id="status" value={form.status} onChange={(e) => handleChange('status', e.target.value)} />
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
                        <Input id="telefone" value={form.telefone} onChange={(e) => handleChange('telefone', e.target.value)} />
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
                      </div>

                      <div className="bg-card border rounded-lg p-4">
                        <Label htmlFor="cidade">Cidade</Label>
                        <Input id="cidade" value={form.cidade} onChange={(e) => handleChange('cidade', e.target.value)} />
                        <Label htmlFor="estado">Estado</Label>
                        <Input id="estado" value={form.estado} onChange={(e) => handleChange('estado', e.target.value)} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      <div className="bg-card border rounded-lg p-4">
                        <div className="font-medium mb-2">Especialidades</div>
                        <div className="flex gap-2 mb-3">
                          <Input ref={newEspecialidadeRef} value={newEspecialidade} onChange={(e) => setNewEspecialidade(e.target.value)} placeholder="Adicionar especialidade" />
                          <Button size="sm" onClick={handleCreateEspecialidade} disabled={creatingEspecialidade || (newEspecialidade || '').toString().trim() === ''}>{creatingEspecialidade ? '...' : 'Adicionar'}</Button>
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

                      <div className="bg-card border rounded-lg p-4">
                        <div className="font-medium mb-2">Diferenciais</div>
                        <div className="flex gap-2 mb-3">
                          <Input ref={newDiferencialRef} value={newDiferencial} onChange={(e) => setNewDiferencial(e.target.value)} placeholder="Adicionar diferencial" />
                          <Button size="sm" onClick={handleCreateDiferencial} disabled={creatingDiferencial || (newDiferencial || '').toString().trim() === ''}>{creatingDiferencial ? '...' : 'Adicionar'}</Button>
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
                ) : (
                  <div>
                    {(() => {
                      const api = selectedProvider as any
                      const providerForView = {
                        id: String(api.id),
                        name: api.nome || api.name || '',
                        corporateName: api.corporateName || api.razao_social || api.nome || '',
                        location: {
                          address: api.logradouro || api.endereco || '',
                          neighborhood: api.bairro || '',
                          city: api.cidade || '',
                          state: api.estado || '',
                          coordinates: api.latitude && api.longitude ? { lat: Number(api.latitude), lng: Number(api.longitude) } : { lat: 0, lng: 0 },
                        },
                        specialties: Array.isArray(api.especialidades)
                          ? api.especialidades
                              .map((e: any) => (typeof e === 'string' ? e : e?.descricao || ''))
                              .filter(Boolean)
                          : (api.specialties || []),
                        
                        complexity: (() => { const c = normalizeComplexityLabel(api.complexidade); return c ? [c] : [] })(),
                        differentials: Array.isArray(api.diferenciais)
                          ? api.diferenciais
                              .map((d: any) => (typeof d === 'string' ? d : d?.descricao || ''))
                              .filter(Boolean)
                          : (api.differentials || []),
                        type: (api.tipo || api.type || 'clinic') as any,
                        status: (api.status && api.status.toLowerCase && api.status.toLowerCase() === 'ativo') ? 'active' : (api.status || 'inactive'),
                        averageAppointmentTime: Number(api.tempo_medio_agendamento ?? api.averageAppointmentTime ?? 0),
                        averageProcedureTime: Number(api.tempo_medio_procedimento ?? api.averageProcedureTime ?? 0),
                        isStrategicPartner: !!api.parceiro_estrategico || !!api.parceiroEstrategico,
                        contractStartDate: api.data_contrato || api.contractStartDate || '',
                        lastUpdate: api.ultima_atualizacao || api.lastUpdate || new Date().toISOString(),
                        phone: api.telefone || api.phone,
                        email: api.email || api.email,
                      }

                      return (
                          <div className="space-y-6">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <ProviderHeader provider={providerForView} onEdit={() => { setIsEditing(true); setForm((f:any)=>({...f, parceiro_estrategico: !!providerForView.isStrategicPartner})); setTimeout(()=>{ try{ newEspecialidadeRef?.current?.focus() }catch(e){} }, 80) }} />
                              </div>
                            </div>
                            <ProviderDetails provider={providerForView} />
                          </div>
                      )
                    })()}
                  </div>
                )
              ) : (
                <div>Carregando...</div>
              )}
            </div>

            {}
            {debugMessages.length > 0 && (
              <div className="mt-2 p-2 bg-muted rounded text-sm max-h-40 overflow-auto">
                <div className="font-medium mb-1">Logs (últimas ações)</div>
                <ul className="list-disc list-inside">
                  {debugMessages.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            )}

            <DialogFooter>
              {isEditing ? (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)} disabled={saving}>Cancelar</Button>
                  <Button onClick={handleSave} disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={closeDialog}>Fechar</Button>
                </div>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  )
}
