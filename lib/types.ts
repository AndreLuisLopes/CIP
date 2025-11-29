export interface Provider {
  id: string
  credenciamento?: string
  name: string
  corporateName: string
  location: {
    address: string
    city: string
    state: string
    neighborhood: string
    coordinates: {
      lat: number
      lng: number
    }
  }
  specialties: string[]
  complexity: string[]
  differentials: string[]
  type: "clinic" | "hospital" | "laboratory" | "diagnostic"
  status: "active" | "inactive" | "under_review" | "contract_ended"
  averageAppointmentTime: number 
  averageProcedureTime: number 
  isStrategicPartner: boolean
  contractStartDate: string
  lastUpdate: string
  phone?: string
  email?: string
}

export interface DashboardStats {
  totalProviders: number
  activeProviders: number
  strategicPartners: number
  underReview: number
  averageAppointmentTime: number
  coverageByRegion: {
    region: string
    count: number
  }[]
  providersBySpecialty: {
    specialty: string
    count: number
  }[]
  statusDistribution: {
    status: string
    count: number
    color: string
  }[]
  
  complexitiesDistinct?: number
  complexitiesDistribution?: { level: string; count: number }[]
}

export interface ImportData {
  file: File
  type: "csv" | "excel"
  preview: Provider[]
  totalRecords: number
}
