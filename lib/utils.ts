import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Provider } from './types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function normalizeComplexityLabel(input: any): string | undefined {
  if (input === null || input === undefined) return undefined
  const raw = String(input).trim().toLowerCase()
  if (!raw) return undefined
  if (raw === '3' || raw.includes('alta')) return 'Alta'
  if (raw === '2' || raw.includes('média') || raw.includes('media')) return 'Média'
  if (raw === '1' || raw.includes('baixa')) return 'Baixa'
  
  return raw.charAt(0).toUpperCase() + raw.slice(1)
}


export function mapApiCredenciadoToProvider(api: any): Provider {
  const normalizeStatus = (value: any): Provider['status'] => {
    const s = (value ?? '').toString().trim().toLowerCase()
    if (!s) return 'inactive'
    if (s.includes('ativo')) return 'active'
    if (s.includes('anális') || s.includes('analise') || s.includes('análise') || s.includes('em anal')) return 'under_review'
    if (s.includes('encerr') || s.includes('fim') || s.includes('termin') || s.includes('rescind')) return 'contract_ended'
    if (s.includes('inativo') || s.includes('desativ')) return 'inactive'
    return 'inactive'
  }

  const complexityLabel = normalizeComplexityLabel(api.complexidade)

  return {
    id: String(api.id),
    credenciamento: api.credenciamento ? String(api.credenciamento) : undefined,
    name: api.nome || api.name || '',
    corporateName: api.corporateName || api.razao_social || api.nome || '',
    location: {
      address: api.logradouro || api.endereco || '',
      neighborhood: api.bairro || '',
      city: api.cidade || '',
      state: api.estado || '',
      coordinates:
        api.latitude != null && api.longitude != null
          ? { lat: Number(api.latitude), lng: Number(api.longitude) }
          : { lat: 0, lng: 0 },
    },
    specialties: Array.isArray(api.especialidades)
      ? api.especialidades
          .map((e: any) => (typeof e === 'string' ? e : e?.descricao || ''))
          .filter(Boolean)
      : api.specialties || [],
  
  complexity: complexityLabel ? [complexityLabel] : (Array.isArray(api.complexity) ? api.complexity : []),
    differentials: Array.isArray(api.diferenciais)
      ? api.diferenciais
          .map((d: any) => (typeof d === 'string' ? d : d?.descricao || ''))
          .filter(Boolean)
      : api.differentials || [],
    type: (api.tipo || api.type || 'clinic') as Provider['type'],
    status: normalizeStatus(api.status),
    averageAppointmentTime: Number(
      (api.tempo_medio_agendamento ?? api.averageAppointmentTime ?? 0)
    ),
    averageProcedureTime: Number(
      (api.tempo_medio_procedimento ?? api.averageProcedureTime ?? 0)
    ),
    isStrategicPartner: !!api.parceiro_estrategico || !!api.parceiroEstrategico,
  contractStartDate: api.data_contrato || api.contractStartDate || '',
    lastUpdate: api.ultima_atualizacao || api.lastUpdate || new Date().toISOString(),
    phone: api.telefone || api.phone,
    email: api.email || api.email,
  }
}
