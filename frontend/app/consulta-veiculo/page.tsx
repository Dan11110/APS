"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function ConsultaVeiculoPage() {
  const [placa, setPlaca] = useState("");
  const [chassi, setChassi] = useState("");
  const [resultado, setResultado] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dadosVeiculo, setDadosVeiculo] = useState<any>(null);

  const formatPlaca = (value: string) => {
    const cleaned = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
    if (cleaned.length <= 3) {
      return cleaned;
    } else if (cleaned.length <= 7) {
      return cleaned.slice(0, 3) + "-" + cleaned.slice(3);
    }
    return cleaned.slice(0, 3) + "-" + cleaned.slice(3, 7);
  };

  const handlePlacaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPlaca(e.target.value);
    if (formatted.length <= 8) {
      setPlaca(formatted);
    }
  };

  const consultarVeiculo = async () => {
    if (!placa && !chassi) {
      setError("Por favor, digite a placa ou o chassi do veículo");
      return;
    }

    setLoading(true);
    setError("");
    setResultado("");
    setDadosVeiculo(null);

    const placaClear = placa.replace(/-/g, "");

    try {
      const envelope = `<?xml version="1.0" encoding="utf-8"?>
        <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                          xmlns:ser="http://service.seguradora.com.br/">
          <soapenv:Header/>
          <soapenv:Body>
            <ser:consultarVeiculoPorPlaca>
              <placa>${placaClear}</placa>
            </ser:consultarVeiculoPorPlaca>
          </soapenv:Body>
        </soapenv:Envelope>`;

      const res = await fetch("http://localhost:9090/proxy/veiculo", {
        method: "POST",
        headers: { "Content-Type": "text/xml;charset=UTF-8" },
        cache: "no-store",
        body: envelope,
      });

      const xmlResponse = await res.text();
      debugger;
      // Verificar se a resposta indica que não foi encontrado nenhum registro
      if (xmlResponse.includes("<return>{}</return>")) {
        setError("Nenhum registro foi localizado para o veículo informado.");
        setResultado("");
      } else {
        // Extrair o JSON do XML
        const returnMatch = xmlResponse.match(/<return>(.*?)<\/return>/);
        if (returnMatch && returnMatch[1]) {
          try {
            const jsonData = JSON.parse(returnMatch[1]);
            console.log(jsonData);
            setDadosVeiculo(jsonData);
            setResultado(xmlResponse); // Manter o XML original também
          } catch (parseError) {
            setError("Erro ao processar os dados retornados.");
          }
        } else {
          setResultado(xmlResponse);
        }
      }
    } catch (err) {
      setError(
        "Erro ao consultar veículo. Verifique se o serviço está disponível."
      );
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" className="mb-4 bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </Link>

          <h1 className="text-3xl font-bold text-red-600 text-center mb-8">
            Consulta de Veículo
          </h1>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Dados do Veículo</CardTitle>
            <CardDescription>
              Digite a placa do veículo para consultar suas
              informações
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="placa">Placa</Label>
                <Input
                  id="placa"
                  type="text"
                  placeholder="ABC-1234"
                  value={placa}
                  onChange={handlePlacaChange}
                  maxLength={8}
                />
              </div>
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <Button
              onClick={consultarVeiculo}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Consultando...
                </>
              ) : (
                "Consultar Veículo"
              )}
            </Button>
          </CardContent>
        </Card>

        {dadosVeiculo && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Dados do Veículo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dadosVeiculo.placa && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Placa
                    </Label>
                    <p className="text-lg">{dadosVeiculo.placa}</p>
                  </div>
                )}
                {dadosVeiculo.chassi && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Chassi
                    </Label>
                    <p className="text-lg">{dadosVeiculo.chassi}</p>
                  </div>
                )}
                {dadosVeiculo.marca && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Marca
                    </Label>
                    <p className="text-lg">{dadosVeiculo.marca}</p>
                  </div>
                )}
                {dadosVeiculo.modelo && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Modelo
                    </Label>
                    <p className="text-lg">{dadosVeiculo.modelo}</p>
                  </div>
                )}
                {"ipvaPago" in dadosVeiculo && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      ipva
                    </Label>
                    <p className="text-lg">
                      {dadosVeiculo.ipvaPago ? "SIM" : "NÃO"}
                    </p>
                  </div>
                )}
                {"temRestricao" in dadosVeiculo && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Restrição
                    </Label>
                    <p className="text-lg">
                      {dadosVeiculo.temRestricao ? "SIM" : "NÃO"}
                    </p>
                  </div>
                )}
                {"foiRoubado" in dadosVeiculo && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Foi Roubado ?
                    </Label>
                    <p className="text-lg">
                      {dadosVeiculo.foiRoubado ? "SIM" : "NÃO"}
                    </p>
                  </div>
                )}
              </div>
              <div className="block mt-12"><strong>Multas</strong> </div>
              {dadosVeiculo.multas?.length == 0 && (
                <CardContent className="p-4">
                  Sem Multas
                </CardContent>
              )}
              {dadosVeiculo.multas?.length > 0 && (
                <CardContent className="p-4">
                  <table className="w-full text-sm">
                    <thead className="text-left border-b">
                      <tr>
                        <th className="py-2">Data</th>
                        <th className="py-2">Descrição</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dadosVeiculo.multas.map((item, index) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="py-2 text-muted-foreground">
                            {new Date(item.data).toLocaleDateString("pt-BR")}
                          </td>
                          <td className="py-2">{item.descricao}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              )}

              
            </CardContent>
          </Card>
        )}

        {resultado && !dadosVeiculo && (
          <Card>
            <CardHeader>
              <CardTitle>Resposta XML Completa</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm whitespace-pre-wrap">
                {resultado}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
