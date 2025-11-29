import type { Provider } from "./types"

export interface SearchFilters {
  name?: string
  city?: string
  state?: string
  neighborhood?: string
  specialty?: string
  complexity?: string
  type?: string
  status?: string
  isStrategicPartner?: boolean
  maxAppointmentTime?: number
}

export function filterProviders(providers: Provider[], filters: SearchFilters): Provider[] {
  return providers.filter((provider) => {
    
    if (
      filters.name &&
      !provider.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      !provider.corporateName.toLowerCase().includes(filters.name.toLowerCase())
    ) {
      return false
    }

    
    if (filters.city && !provider.location.city.toLowerCase().includes(filters.city.toLowerCase())) {
      return false
    }

    if (filters.state && provider.location.state !== filters.state) {
      return false
    }

    if (
      filters.neighborhood &&
      !provider.location.neighborhood.toLowerCase().includes(filters.neighborhood.toLowerCase())
    ) {
      return false
    }

    
    if (
      filters.specialty &&
      !provider.specialties.some((spec) => spec.toLowerCase().includes(filters.specialty!.toLowerCase()))
    ) {
      return false
    }

    
    if (
      filters.complexity &&
      !provider.complexity.some((comp) => comp.toLowerCase().includes(filters.complexity!.toLowerCase()))
    ) {
      return false
    }

    
    if (filters.type && provider.type !== filters.type) {
      return false
    }

    
    if (filters.status && provider.status !== filters.status) {
      return false
    }

    
    if (filters.isStrategicPartner !== undefined && provider.isStrategicPartner !== filters.isStrategicPartner) {
      return false
    }

    
    if (filters.maxAppointmentTime && provider.averageAppointmentTime > filters.maxAppointmentTime) {
      return false
    }

    return true
  })
}

export function getUniqueValues(providers: Provider[], field: keyof Provider | string): string[] {
  const values = new Set<string>()

  providers.forEach((provider) => {
    switch (field) {
      case "city":
        values.add(provider.location.city)
        break
      case "state":
        values.add(provider.location.state)
        break
      case "neighborhood":
        values.add(provider.location.neighborhood)
        break
      case "specialties":
        provider.specialties.forEach((spec) => values.add(spec))
        break
      case "complexity":
        provider.complexity.forEach((comp) => values.add(comp))
        break
      case "type":
        values.add(provider.type)
        break
      case "status":
        values.add(provider.status)
        break
    }
  })

  return Array.from(values).sort()
}
