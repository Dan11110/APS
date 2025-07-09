import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center space-y-8">
        <h1 className="text-6xl font-bold text-red-600 mb-12">CORRETOR</h1>

        <div className="flex gap-6">
          <Link href="/consulta-cpf">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
              Consultar CPF
            </Button>
          </Link>

          <Link href="/consulta-veiculo">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-lg">
              Consultar Veículo
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
