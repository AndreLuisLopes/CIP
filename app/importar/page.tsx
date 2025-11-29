"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { MainLayout } from "../../components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, CheckCircle, AlertCircle, Database, Loader2 } from "lucide-react"
import { getImportacoes, uploadImportacao } from "@/lib/api"

export default function ImportarPage() {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle")
  const [uploadMessage, setUploadMessage] = useState("")
  const [importacoes, setImportacoes] = useState<any[]>([])
  const [isLoadingList, setIsLoadingList] = useState(true)

  useEffect(() => {
    loadImportacoes()
  }, [])

  const loadImportacoes = async () => {
    try {
      const data = await getImportacoes()
      setImportacoes(data)
    } catch (err) {
      console.error("Erro ao carregar importações:", err)
    } finally {
      setIsLoadingList(false)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setUploadStatus("idle")
      setUploadMessage("")
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setIsUploading(true)
    setUploadProgress(0)
    setUploadStatus("idle")

    try {
      const result = await uploadImportacao(file, (p: number) => {
        
        setUploadProgress(p)
      })

      setUploadProgress(100)
      setUploadStatus("success")
      
      const registros = (result && result.registros_importados) || 0
      const total = (result && result.total_registros) || (result && result.total) || 0
      setUploadMessage(`Arquivo importado com sucesso! ${registros} de ${total} registros processados.`)
      console.info("Resposta do servidor (importação):", result)
      loadImportacoes() 
    } catch (error) {
      setUploadProgress(0)
      setUploadStatus("error")
      console.error("Erro ao importar arquivo:", error)
      setUploadMessage(error instanceof Error ? error.message : "Erro ao importar arquivo")
    } finally {
      setIsUploading(false)
    }
  }

  const resetUpload = () => {
    setFile(null)
    setUploadProgress(0)
    setUploadStatus("idle")
    setIsUploading(false)
    setUploadMessage("")
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Importar Base de Dados</h1>
          <p className="text-muted-foreground mt-2">Atualize a base de prestadores importando arquivos CSV ou Excel</p>
        </div>

        {}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Instruções de Importação
            </CardTitle>
            <CardDescription>Siga estas diretrizes para garantir uma importação bem-sucedida</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-2">Formatos Aceitos</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Arquivos CSV (separados por vírgula)</li>
                  <li>• Planilhas Excel (.xlsx, .xls)</li>
                  <li>• Codificação UTF-8 recomendada</li>
                  <li>• Tamanho máximo: 50MB</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Colunas Obrigatórias</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Nome do Prestador</li>
                  <li>• Razão Social</li>
                  <li>• Endereço Completo</li>
                  <li>• Especialidades</li>
                  <li>• Status do Contrato</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload de Arquivo
            </CardTitle>
            <CardDescription>Selecione o arquivo da base de dados para importação</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {}
            <div className="space-y-2">
              <Label htmlFor="file">Selecionar Arquivo</Label>
              <Input
                id="file"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </div>

            {}
            {file && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{file.name}</span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Tamanho: {(file.size / 1024 / 1024).toFixed(2)} MB
                </div>
              </div>
            )}

            {}
            {isUploading && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Importando dados...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}

            {}
            {uploadStatus === "success" && uploadMessage && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{uploadMessage}</AlertDescription>
              </Alert>
            )}

            {uploadStatus === "error" && uploadMessage && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{uploadMessage}</AlertDescription>
              </Alert>
            )}

            {}
            <div className="flex items-center gap-4">
              <Button onClick={handleUpload} disabled={!file || isUploading} size="lg">
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importando...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Iniciar Importação
                  </>
                )}
              </Button>

              {(file || uploadStatus !== "idle") && (
                <Button onClick={resetUpload} variant="outline" disabled={isUploading} size="lg">
                  Cancelar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {}
        <Card>
          <CardHeader>
            <CardTitle>Importações Recentes</CardTitle>
            <CardDescription>Histórico das últimas atualizações da base de dados</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingList ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : importacoes.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Nenhuma importação registrada</p>
              </div>
            ) : (
              <div className="space-y-3">
                {importacoes.map((imp) => (
                  <div key={imp.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <div>
                        <div className="font-medium">{imp.descricao}</div>
                        <div className="text-sm text-muted-foreground">ID: {imp.id}</div>
                      </div>
                    </div>
                    <div className="text-sm text-green-600 font-medium">Sucesso</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
