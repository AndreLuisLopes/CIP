"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { login as apiLogin, getProfile, type LoginCredentials } from "@/lib/api"

interface User {
  id: number
  usuario: string
  nome: string
  email: string
  cargo: string
}

interface AuthContextType {
  user: User | null
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  isLoading: boolean
  canEdit: boolean
  cargo?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    
    try {
      const raw = localStorage.getItem('auth')
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed?.usuario) {
          setUser(parsed)
        }
      }
    } catch (e) {
      localStorage.removeItem('auth')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = async (credentials: LoginCredentials) => {
    
    const resp = await apiLogin(credentials)
    const userObj: User = {
      id: resp.id,
      usuario: String(resp.usuario),
      nome: String(resp.usuario),
      email: '',
      cargo: resp.cargo,
    }
    setUser(userObj)
    localStorage.setItem('auth', JSON.stringify(userObj))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth')
  }

  const allowedRoles = new Set(["admin", "credenciamento", "ti", "ceo"]) as Set<string>
  const cargo = user?.cargo?.toLowerCase()
  const canEdit = !!cargo && allowedRoles.has(cargo)

  return <AuthContext.Provider value={{ user, login, logout, isLoading, canEdit, cargo: user?.cargo }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}
