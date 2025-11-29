import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
  status: "active" | "inactive" | "under_review" | "contract_ended"
  className?: string
}

const statusConfig = {
  active: {
    label: "Ativo",
    className: "bg-green-100 text-green-800 hover:bg-green-100",
  },
  inactive: {
    label: "Inativo",
    className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  },
  under_review: {
    label: "Em Análise",
    className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  },
  contract_ended: {
    label: "Contrato Encerrado",
    className: "bg-red-100 text-red-800 hover:bg-red-100",
  },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status] ?? statusConfig.inactive

  return (
    <Badge variant="secondary" className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}
