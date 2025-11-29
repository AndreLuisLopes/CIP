import { MainLayout } from "../../components/layout/main-layout"
import { StatsCards } from "../../components/dashboard/stats-cards"
import { CoverageChart } from "../../components/dashboard/coverage-chart"
import { SpecialtyChart } from "../../components/dashboard/specialty-chart"
import { StatusDistribution } from "../../components/dashboard/status-distribution"
import { RecentActivity } from "../../components/dashboard/recent-activity"
import { QuickActions } from "../../components/dashboard/quick-actions"
import { getDashboard, getCredenciados } from "../../lib/api"
import { mapApiCredenciadoToProvider } from "../../lib/utils"

export default async function DashboardPage() {
  let stats: any
  let recentProviders: any[] = []
  try {
    const { stats: s, recent } = await getDashboard()
    stats = s
    recentProviders = Array.isArray(recent) ? recent.map(mapApiCredenciadoToProvider) : []
    
    const fetchAllCredenciados = async (): Promise<any[]> => {
      const pageSize = 500
      let skip = 0
      const all: any[] = []
      while (true) {
        const chunk = await getCredenciados({ skip, limit: pageSize })
        const arr = Array.isArray(chunk) ? chunk : []
        all.push(...arr)
        if (arr.length < pageSize) break
        skip += pageSize
        if (skip > 10000) break 
      }
      return all
    }
    
    if (!(typeof stats.averageAppointmentTime === 'number') || stats.averageAppointmentTime <= 0) {
      try {
        const credenciados = await fetchAllCredenciados()
        const values: number[] = []
        for (const c of (Array.isArray(credenciados) ? credenciados : [])) {
          const n = Number(c?.tempo_medio_agendamento)
          if (isFinite(n) && n > 0) values.push(n)
        }
        if (values.length > 0) {
          const avg = values.reduce((a, b) => a + b, 0) / values.length
          ;(stats as any).averageAppointmentTime = avg
        }
      } catch {
        
      }
    }
    
    if (!Array.isArray(stats.providersBySpecialty) || stats.providersBySpecialty.length === 0) {
      try {
        const credenciados = await fetchAllCredenciados()
        const counts = new Map<string, number>()
        for (const c of (Array.isArray(credenciados) ? credenciados : [])) {
          const esps = Array.isArray(c.especialidades) ? c.especialidades : []
          for (const e of esps) {
            const name = (typeof e === 'string' ? e : (e?.descricao || 'Sem descrição')) as string
            if (!name) continue
            counts.set(name, (counts.get(name) || 0) + 1)
          }
        }
  const arr = Array.from(counts.entries()).map(([specialty, count]) => ({ specialty, count }))
  
  arr.sort((a, b) => b.count - a.count)
  ;(stats as any).providersBySpecialty = arr
      } catch {
        
      }
    } else {
      
      try {
        const credenciados = await fetchAllCredenciados()
        const counts = new Map<string, number>()
        for (const c of (Array.isArray(credenciados) ? credenciados : [])) {
          const esps = Array.isArray(c.especialidades) ? c.especialidades : []
          for (const e of esps) {
            const name = (typeof e === 'string' ? e : (e?.descricao || 'Sem descrição')) as string
            if (!name) continue
            counts.set(name, (counts.get(name) || 0) + 1)
          }
        }
        const computedLen = counts.size
        if (computedLen > stats.providersBySpecialty.length) {
          const arr = Array.from(counts.entries()).map(([specialty, count]) => ({ specialty, count }))
          arr.sort((a, b) => b.count - a.count)
          ;(stats as any).providersBySpecialty = arr
        }
      } catch {
        
      }
    }
  } catch (e) {
    
    stats = {
      totalProviders: 0,
      activeProviders: 0,
      strategicPartners: 0,
      underReview: 0,
      averageAppointmentTime: 0,
      coverageByRegion: [],
  providersBySpecialty: [],
      statusDistribution: [],
    }
    recentProviders = []

    
    try {
      const credenciados = await getCredenciados()
      
      const values: number[] = []
      for (const c of (Array.isArray(credenciados) ? credenciados : [])) {
        const n = Number(c?.tempo_medio_agendamento)
        if (isFinite(n) && n > 0) values.push(n)
      }
      if (values.length > 0) {
        const avg = values.reduce((a, b) => a + b, 0) / values.length
        ;(stats as any).averageAppointmentTime = avg
      }

      
      const counts = new Map<string, number>()
      for (const c of (Array.isArray(credenciados) ? credenciados : [])) {
        const esps = Array.isArray(c.especialidades) ? c.especialidades : []
        for (const e of esps) {
          const name = (typeof e === 'string' ? e : (e?.descricao || 'Sem descrição')) as string
          if (!name) continue
          counts.set(name, (counts.get(name) || 0) + 1)
        }
      }
      if (counts.size > 0) {
        const arr = Array.from(counts.entries()).map(([specialty, count]) => ({ specialty, count }))
        arr.sort((a, b) => b.count - a.count)
        ;(stats as any).providersBySpecialty = arr
      }
    } catch {
      
    }
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Gerencial</h1>
          <p className="text-muted-foreground mt-2">Visão geral da rede credenciada e indicadores principais</p>
        </div>

  {}
        <StatsCards stats={stats} />

        {}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CoverageChart stats={stats} />
          <SpecialtyChart stats={stats} />
        </div>

        {}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <StatusDistribution stats={stats} />
          <div className="lg:col-span-2">
            <RecentActivity providers={recentProviders} />
          </div>
        </div>

        {}
        <QuickActions />
      </div>
    </MainLayout>
  )
}
