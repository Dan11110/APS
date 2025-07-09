"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"

export default function ConsultaCPFPage() {
  const [cpf, setCpf] = useState("")
  const [resultado, setResultado] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [dadosCliente, setDadosCliente] = useState<any>(null)

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value)
    if (formatted.length <= 14) {
      setCpf(formatted)
    }
  }

  const consultarCPF = async () => {
    if (!cpf) {
      setError("Por favor, digite um CPF")
      return
    }

    const cpfNumbers = cpf.replace(/\D/g, "")
    if (cpfNumbers.length !== 11) {
      setError("CPF deve ter 11 dígitos")
      return
    }

    setLoading(true)
    setError("")
    setResultado("")
    setDadosCliente(null)

    try {
      const envelope = `<?xml version="1.0" encoding="utf-8"?>
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                      xmlns:ser="http://service.seguradora.com.br/">
      <soapenv:Header/>
      <soapenv:Body>
        <ser:consultarClientePorCPF>
          <cpf>${cpfNumbers}</cpf>
        </ser:consultarClientePorCPF>
      </soapenv:Body>
    </soapenv:Envelope>`

      const res = await fetch("http://localhost:9090/proxy/cliente", {
        method: "POST",
        headers: { "Content-Type": "text/xml;charset=UTF-8",
          "X-System-Name": "consulta-cliente"

        },  
        cache: "no-store",
        body: envelope,
      })

      const xmlResponse = await res.text()
      debugger
      // Verificar se a resposta indica que não foi encontrado nenhum registro
      if (xmlResponse.includes("<return>{}</return>")) {
        setError("Nenhum registro foi localizado para o CPF informado.")
        setResultado("")
      } else {
        // Extrair o JSON do XML
        const returnMatch = xmlResponse.match(/<return>(.*?)<\/return>/s)
        if (returnMatch && returnMatch[1]) {
          try {
            const jsonData = JSON.parse(returnMatch[1])
            setDadosCliente(jsonData)
            setResultado(xmlResponse) // Manter o XML original também
          } catch (parseError) {
            setError("Erro ao processar os dados retornados.")
          }
        } else {
          setResultado(xmlResponse)
        }
      }
    } catch (err) {
      setError("Erro ao consultar CPF. Verifique se o serviço está disponível.")
      console.error("Erro:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">q
          <Link href="/">
            <Button variant="outline" className="mb-4 bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>

          <h1 className="text-3xl font-bold text-red-600 text-center mb-8">Consulta por CPF</h1>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Dados do Cliente</CardTitle>
            <CardDescription>Digite o CPF do cliente para consultar suas informações</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={handleCPFChange}
                maxLength={14}
              />
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <Button onClick={consultarCPF} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Consultando...
                </>
              ) : (
                "Consultar CPF"
              )}
            </Button>
          </CardContent>
        </Card>

        {dadosCliente && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Dados do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">CPF</Label>
                  <p className="text-lg">{dadosCliente.cpf}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Nome</Label>
                  <p className="text-lg">{dadosCliente.nome}</p>
                </div>
              </div>

              {dadosCliente.apolices && dadosCliente.apolices.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-gray-600 mb-2 block">Apólices</Label>
                  <div className="space-y-2">
                    {dadosCliente.apolices.map((apolice: any, index: number) => (
                      <div key={index} className="border rounded-lg p-3 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div>
                            <span className="text-xs text-gray-500">Número:</span>
                            <p className="font-medium">{apolice.numero}</p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">Tipo:</span>
                            <p className="font-medium">{apolice.tipo}</p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">Validade:</span>
                            <p className="font-medium">{new Date(apolice.validade).toLocaleDateString("pt-BR")}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
{/*   {dadosVeiculo.apolices && dadosVeiculo.apolices.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-gray-600 mb-2 block">Apólices</Label>
                  <div className="space-y-2">
                    {dadosVeiculo.apolices.map((apolice: any, index: number) => (
                      <div key={index} className="border rounded-lg p-3 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                          <div>
                            <span className="text-xs text-gray-500">Número:</span>
                            <p className="font-medium">{apolice.numero}</p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">Tipo:</span>
                            <p className="font-medium">{apolice.tipo}</p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">Validade:</span>
                            <p className="font-medium">{new Date(apolice.validade).toLocaleDateString("pt-BR")}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )} */}


            </CardContent>
          </Card>
        )}

        {resultado && !dadosCliente && (
          <Card>
            <CardHeader>
              <CardTitle>Resposta XML Completa</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm whitespace-pre-wrap">{resultado}</pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
