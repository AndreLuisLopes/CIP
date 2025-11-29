import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Stethoscope, Zap, Building } from "lucide-react"
import type { Provider } from "@/lib/types"

interface ProviderDetailsProps {
  provider: Provider
}

export function ProviderDetails({ provider }: ProviderDetailsProps) {
  const contractStart = provider.contractStartDate ? new Date(provider.contractStartDate).toLocaleDateString("pt-BR") : "-"
  const lastUpdate = provider.lastUpdate ? new Date(provider.lastUpdate).toLocaleDateString("pt-BR") : "-"
  const pluralizeDays = (val?: number) => {
    const n = Number(val)
    if (!isFinite(n)) return "-"
    if (n === 1) return "1 dia"
    return `${n} dias`
  }
  const apptText = pluralizeDays(provider.averageAppointmentTime)
  const procText = pluralizeDays(provider.averageProcedureTime)
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Especialidades
          </CardTitle>
          <CardDescription>Áreas médicas de atuação do prestador</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {provider.specialties.map((specialty, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {specialty}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {}

      {}
      {provider.differentials.length > 0 && (
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Diferenciais
            </CardTitle>
            <CardDescription>Características especiais e vantagens oferecidas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {provider.differentials.map((diff, index) => (
                <Badge key={index} variant="outline" className="text-sm text-blue-600 border-blue-600">
                  {diff}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {}
  <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Informações Adicionais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Dados do Contrato</h4>
              <div className="space-y-2 text-sm">
                {provider.credenciamento && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Código de credenciamento:</span>
                    <span>{provider.credenciamento}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Início do contrato:</span>
                  <span>{contractStart}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Última atualização:</span>
                  <span>{lastUpdate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Parceiro estratégico:</span>
                  <span>{provider.isStrategicPartner ? "Sim" : "Não"}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Indicadores de Atendimento</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tempo médio agendamento:</span>
                  <span>{apptText}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tempo médio procedimento:</span>
                  <span>{procText}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status atual:</span>
                  <span className="capitalize">
                    {provider.status === "active"
                      ? "Ativo"
                      : provider.status === "inactive"
                        ? "Inativo"
                        : provider.status === "under_review"
                          ? "Em Análise"
                          : "Contrato Encerrado"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">Localização Completa</h4>
            <div className="text-sm space-y-1">
              <p>{provider.location.address}</p>
              <p>{provider.location.neighborhood}</p>
              <p>
                {provider.location.city} - {provider.location.state}
              </p>
              {provider.location.coordinates && (
                <p className="text-muted-foreground">
                  Coordenadas: {provider.location.coordinates.lat}, {provider.location.coordinates.lng}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
