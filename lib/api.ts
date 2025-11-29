
const API_URL: string = typeof window !== 'undefined' ? '' : (process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000')

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('auth')
    if (!raw) return null
    const parsed = JSON.parse(raw)
    return parsed?.accessToken || null
  } catch {
    return null
  }
}


export async function getEspecialidades() {
  const response = await fetch(`${API_URL}/api/especialidades`)
  if (!response.ok) throw new Error("Erro ao buscar especialidades")
  return response.json()
}

export async function createEspecialidade(descricao: string) {
  try {
    const response = await fetch(`${API_URL}/api/especialidades`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({ descricao }),
    })

    if (!response.ok) {
      const body = await response.text().catch(() => '')
      throw new Error(body || `Erro ao criar especialidade (status ${response.status})`)
    }

    return response.json()
  } catch (e: any) {
    
    const url = `${API_URL}/api/especialidades`
    throw new Error(e?.message ? `Network error: ${e.message} (POST ${url})` : `Network error (POST ${url}): ${String(e)}`)
  }
}


export async function getDiferenciais() {
  const response = await fetch(`${API_URL}/api/diferenciais`)
  if (!response.ok) throw new Error("Erro ao buscar diferenciais")
  return response.json()
}

export async function createDiferencial(descricao: string) {
  try {
    const response = await fetch(`${API_URL}/api/diferenciais`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify({ descricao }),
    })

    if (!response.ok) {
      const body = await response.text().catch(() => '')
      throw new Error(body || `Erro ao criar diferencial (status ${response.status})`)
    }

    return response.json()
  } catch (e: any) {
    const url = `${API_URL}/api/diferenciais`
    throw new Error(e?.message ? `Network error: ${e.message} (POST ${url})` : `Network error (POST ${url}): ${String(e)}`)
  }
}


export async function getRedes() {
  const response = await fetch(`${API_URL}/api/redes`)
  if (!response.ok) throw new Error("Erro ao buscar redes")
  return response.json()
}

export async function createRede(nome: string, descricao?: string) {
  const response = await fetch(`${API_URL}/api/redes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: 'include',
    body: JSON.stringify({ nome, descricao }),
  })
  if (!response.ok) throw new Error("Erro ao criar rede")
  return response.json()
}


export async function getCredenciados(params?: { nome?: string; status?: string; tipo?: string; skip?: number; limit?: number }) {
  const qs = []
  if (params) {
    if (params.nome) qs.push(`nome=${encodeURIComponent(params.nome)}`)
    if (params.status) qs.push(`status=${encodeURIComponent(params.status)}`)
    if (params.tipo) qs.push(`tipo=${encodeURIComponent(params.tipo)}`)
    if (typeof params.skip === 'number') qs.push(`skip=${params.skip}`)
    if (typeof params.limit === 'number') qs.push(`limit=${params.limit}`)
  }
  const url = `${API_URL}/api/credenciados${qs.length ? `?${qs.join('&')}` : ''}`
  const response = await fetch(url)
  if (!response.ok) throw new Error("Erro ao buscar credenciados")
  return response.json()
}

export async function createCredenciado(data: any) {
  const response = await fetch(`${API_URL}/api/credenciados`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: 'include',
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Erro ao criar credenciado")
  }
  return response.json()
}

export async function getCredenciado(id: number | string) {
  const response = await fetch(`${API_URL}/api/credenciados/${id}`)
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || `Erro ao obter credenciado ${id}`)
  }
  return response.json()
}

export async function updateCredenciado(id: number | string, data: any) {
  const response = await fetch(`${API_URL}/api/credenciados/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || `Erro ao atualizar credenciado ${id}`)
  }

  return response.json()
}


export async function getImportacoes() {
  const response = await fetch(`${API_URL}/api/importacoes`)
  if (!response.ok) throw new Error("Erro ao buscar importações")
  return response.json()
}


export type LoginCredentials = { usuario: number; senha: string }

export async function login(credentials: LoginCredentials) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error || 'Erro ao autenticar')
  }

  return response.json() 
}

export async function getProfile() {
  const url = `${API_URL}/api/auth/me`
  const response = await fetch(url, { credentials: 'include' })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error || 'Erro ao obter perfil')
  }

  return response.json()
}

export async function createImportacao(descricao: string) {
  const response = await fetch(`${API_URL}/api/importacoes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: 'include',
    body: JSON.stringify({ descricao }),
  })
  if (!response.ok) throw new Error("Erro ao criar importação")
  return response.json()
}

export async function uploadImportacao(file: File, onProgress?: (p: number) => void) {
  
  return new Promise<any>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
  const url = `${API_URL}/api/importacoes/upload`

    xhr.open('POST', url)
    xhr.withCredentials = true

    xhr.onload = () => {
      const status = xhr.status
      const text = xhr.responseText
      try {
        const json = text ? JSON.parse(text) : {}
        if (status >= 200 && status < 300) {
          resolve(json)
        } else {
          reject(new Error(json.error || json.message || `Erro do servidor: ${status}`))
        }
      } catch (e) {
        if (status >= 200 && status < 300) {
          resolve(text)
        } else {
          reject(new Error(text || `Erro do servidor: ${status}`))
        }
      }
    }

    xhr.onerror = () => {
      reject(new Error('Erro de rede ao enviar arquivo'))
    }

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100)
          try {
            onProgress(percent)
          } catch (e) {
            
          }
        }
      }
    }

    const formData = new FormData()
    formData.append('file', file)

    try {
      xhr.send(formData)
    } catch (e) {
      reject(new Error('Falha ao enviar o arquivo'))
    }
  })
}


import type { DashboardStats } from './types'

export async function getDashboard(): Promise<{ stats: DashboardStats; recent: any[] }> {
  const response = await fetch(`${API_URL}/api/dashboard`)
  if (!response.ok) {
    const err = await response.text().catch(() => '')
    throw new Error(err || 'Erro ao obter dashboard')
  }
  return response.json()
}
