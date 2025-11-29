import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, Users, Building2, Star, Clock, MapPin } from "lucide-react"
import type { ReportData } from "@/lib/report-utils"

interface ReportPreviewProps {
  reportData: ReportData
}

export function ReportPreview({ reportData }: ReportPreviewProps) {
  const { summary, providers, filters } = reportData

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Prévia do Relatório
        </CardTitle>
        <CardDescription>Visualização dos dados que serão incluídos no relatório</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {}
        <div>
          <h3 className="text-lg font-semibold">{reportData.title}</h3>
          <p className="text-sm text-muted-foreground">
            Gerado em: {new Date(reportData.generatedAt).toLocaleString("pt-BR")}
          </p>
        </div>

        <Separator />

        {}
        <div>
          <h4 className="font-medium mb-4">Resumo Executivo</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Users className="h-6 w-6 text-primary mx-auto mb-1" />
              <div className="text-2xl font-bold">{summary.totalProviders}</div>
              <div className="text-xs text-muted-foreground">Total de Prestadores</div>
            </div>

            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Building2 className="h-6 w-6 text-green-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-green-600">{summary.activeProviders}</div>
              <div className="text-xs text-muted-foreground">Prestadores Ativos</div>
            </div>

            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Star className="h-6 w-6 text-yellow-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-yellow-600">{summary.strategicPartners}</div>
              <div className="text-xs text-muted-foreground">Parceiros Estratégicos</div>
            </div>

            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600 mx-auto mb-1" />
              <div className="text-2xl font-bold text-blue-600">{summary.averageAppointmentTime}</div>
              <div className="text-xs text-muted-foreground">Tempo Médio (dias)</div>
            </div>
          </div>
        </div>

        {}
        {summary.coverageByRegion.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Cobertura por Região</h4>
            <div className="space-y-2">
              {summary.coverageByRegion.slice(0, 5).map((region, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span>{region.region}</span>
                  <Badge variant="secondary">{region.count} prestadores</Badge>
                </div>
              ))}
              {summary.coverageByRegion.length > 5 && (
                <div className="text-xs text-muted-foreground">
                  +{summary.coverageByRegion.length - 5} regiões adicionais
                </div>
              )}
            </div>
          </div>
        )}

        {}
        {summary.providersBySpecialty.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Distribuição por Especialidade</h4>
            <div className="space-y-2">
              {summary.providersBySpecialty.slice(0, 5).map((specialty, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span>{specialty.specialty}</span>
                  <Badge variant="outline">{specialty.count} prestadores</Badge>
                </div>
              ))}
              {summary.providersBySpecialty.length > 5 && (
                <div className="text-xs text-muted-foreground">
                  +{summary.providersBySpecialty.length - 5} especialidades adicionais
                </div>
              )}
            </div>
          </div>
        )}

        {}
        <div>
          <h4 className="font-medium mb-3">Amostra de Prestadores ({providers.length} total)</h4>
          {providers.length === 0 ? (
            <div className="text-sm text-muted-foreground p-4 border rounded-md">
              Nenhum prestador encontrado com os filtros selecionados.
            </div>
          ) : (
            <div className="space-y-3">
              {providers.slice(0, 3).map((provider, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">{provider.name}</h5>
                    <div className="flex items-center gap-2">
                      {provider.isStrategicPartner && (
                        <Badge variant="outline" className="text-yellow-600 border-yellow-600 text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          Estratégico
                        </Badge>
                      )}
                      <Badge variant="secondary" className="text-xs">
                        {provider.status === "active"
                          ? "Ativo"
                          : provider.status === "under_review"
                            ? "Em Análise"
                            : "Inativo"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {provider.location.city}, {provider.location.state}
                    </span>
                    <span>{provider.specialties.slice(0, 2).join(", ")}</span>
                    {filters.includeContactInfo && provider.phone && <span>{provider.phone}</span>}
                  </div>
                </div>
              ))}
              {providers.length > 3 && (
                <div className="text-xs text-muted-foreground text-center">
                  +{providers.length - 3} prestadores adicionais serão incluídos no relatório
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
