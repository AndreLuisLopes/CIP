"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, FileText, Table, Loader2 } from "lucide-react"
import type { ReportData } from "@/lib/report-utils"
import { exportToCSV } from "@/lib/report-utils"

interface ExportOptionsProps {
  reportData: ReportData
  disabled?: boolean
}

export function ExportOptions({ reportData, disabled }: ExportOptionsProps) {
  const [isExporting, setIsExporting] = useState<string | null>(null)

  const handleExportCSV = async () => {
    setIsExporting("csv")
    try {
      const csvContent = exportToCSV(reportData)

      
      const toUTF16LE = (s: string) => {
        const withoutBOM = s.replace(/^\uFEFF/, "")
        const bytes = new Uint8Array(2 + withoutBOM.length * 2)
        
        bytes[0] = 0xff
        bytes[1] = 0xfe
        let offset = 2
        for (let i = 0; i < withoutBOM.length; i++) {
          const code = withoutBOM.charCodeAt(i)
          bytes[offset++] = code & 0xff 
          bytes[offset++] = code >> 8 
        }
        return bytes
      }

      const bytes = toUTF16LE(csvContent)
      const blob = new Blob([bytes], { type: "text/csv;charset=utf-16le;" })
      const link = document.createElement("a")
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute(
        "download",
        `${reportData.title.replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.csv`,
      )
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Erro ao exportar CSV:", error)
    } finally {
      setIsExporting(null)
    }
  }

  const handleExportPDF = async () => {
    setIsExporting("pdf")
    try {
      
      await new Promise((resolve) => setTimeout(resolve, 2000))
      alert("Funcionalidade de exportação PDF será implementada em breve!")
    } catch (error) {
      console.error("Erro ao exportar PDF:", error)
    } finally {
      setIsExporting(null)
    }
  }

  const handleExportExcel = async () => {
    setIsExporting("excel")
    try {
      
      await new Promise((resolve) => setTimeout(resolve, 2000))
      alert("Funcionalidade de exportação Excel será implementada em breve!")
    } catch (error) {
      console.error("Erro ao exportar Excel:", error)
    } finally {
      setIsExporting(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Opções de Exportação
        </CardTitle>
        <CardDescription>Escolha o formato para exportar o relatório gerado</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{reportData.providers.length} prestadores</span>
            <span>•</span>
            <span>Gerado em {new Date(reportData.generatedAt).toLocaleString("pt-BR")}</span>
          </div>

          {}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Table className="h-5 w-5 text-green-600" />
                <span className="font-medium">CSV</span>
                <Badge variant="secondary" className="text-xs">
                  Disponível
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Formato de planilha compatível com Excel e Google Sheets
              </p>
              <Button
                onClick={handleExportCSV}
                disabled={disabled || isExporting === "csv"}
                className="w-full"
                size="sm"
              >
                {isExporting === "csv" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Exportando...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar CSV
                  </>
                )}
              </Button>
            </div>

            {}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-red-600" />
                <span className="font-medium">PDF</span>
                <Badge variant="outline" className="text-xs">
                  Em breve
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-3">Relatório formatado para impressão e apresentação</p>
              <Button
                onClick={handleExportPDF}
                disabled={disabled || isExporting === "pdf"}
                variant="outline"
                className="w-full bg-transparent"
                size="sm"
              >
                {isExporting === "pdf" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar PDF
                  </>
                )}
              </Button>
            </div>

            {}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Table className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Excel</span>
                <Badge variant="outline" className="text-xs">
                  Em breve
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-3">Planilha Excel com formatação avançada e gráficos</p>
              <Button
                onClick={handleExportExcel}
                disabled={disabled || isExporting === "excel"}
                variant="outline"
                className="w-full bg-transparent"
                size="sm"
              >
                {isExporting === "excel" ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Excel
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
