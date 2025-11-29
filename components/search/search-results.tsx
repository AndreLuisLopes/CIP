import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ProviderCard } from "./provider-card"
import { Search, Users } from "lucide-react"
import type { Provider } from "@/lib/types"

interface SearchResultsProps {
  providers: Provider[]
  totalCount: number
  isLoading?: boolean
}

export function SearchResults({ providers, totalCount, isLoading }: SearchResultsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Buscando prestadores...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Resultados da Busca
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {providers.length === totalCount
              ? `${totalCount} prestador${totalCount !== 1 ? "es" : ""} encontrado${totalCount !== 1 ? "s" : ""}`
              : `${providers.length} de ${totalCount} prestador${totalCount !== 1 ? "es" : ""} encontrado${totalCount !== 1 ? "s" : ""}`}
            {providers.length !== totalCount && (
              <Badge variant="secondary" className="ml-2">
                Filtrado
              </Badge>
            )}
          </CardDescription>
        </CardHeader>
      </Card>

      {}
      {providers.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhum prestador encontrado</h3>
            <p className="text-muted-foreground">
              Tente ajustar os filtros de busca para encontrar prestadores que atendam aos critérios desejados.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {providers.map((provider) => (
            <ProviderCard key={provider.id} provider={provider} />
          ))}
        </div>
      )}
    </div>
  )
}
