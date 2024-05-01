'use client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import axios from 'axios'
import { useEffect, useState } from 'react'

const BASE_URL = 'https://economia.awesomeapi.com.br'
interface IMoeda {
  sigla: string
  nome: string
}

// Home.getInitialProps = async () => {
//   const response = await axios.get(`${BASE_URL}/json/available/uniq`)
//   console.log(response.data)
//   return { dados: response.data }
// }

export default function Home() {
  const [moedas, setMoedas] = useState<IMoeda[]>([])

  useEffect(() => {
    const fetchMoedas = async () => {
      try {
        const response = await axios.get<IMoeda>(
          `${BASE_URL}/json/available/uniq`,
        )
        const moedasArray = Object.entries(response.data).map(
          ([sigla, nome]) => ({ sigla, nome }),
        )
        const siglasParaExcluir = ['BRL', 'BRLT']

        // Filtra a lista de moedas, excluindo aquelas com as siglas especificadas
        const moedasFiltradas = moedasArray.filter(
          (moeda) => !siglasParaExcluir.includes(moeda.sigla),
        )
        console.log(moedasFiltradas)
        setMoedas(moedasFiltradas)
      } catch (error) {
        // aqui temos acesso ao erro, quando alguma coisa inesperada acontece:
        console.log(error)
      }
    }
    fetchMoedas()
  }, [])

  return (
    <div>
      <div>
        <h1>Moedas Disponíveis:</h1>
        <ul></ul>
      </div>
      <h1>Conversor de moedas para BRL</h1>
      <div>
        <Label htmlFor="valor">VALOR</Label>
        <Input name="valor" id="valor" type="text" placeholder="0,0"></Input>

        <Label htmlFor="moeda">MOEDA</Label>
        <Select name="moeda">
          <SelectTrigger>
            <SelectValue placeholder="Selecione a moeda" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {/* <SelectLabel>Selecione a moeda</SelectLabel> */}
              {moedas.map((moeda) => (
                <SelectItem key={moeda.sigla} value={moeda.sigla}>
                  {moeda.nome}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button>Converter em reais</Button>
        <div className="resultado">
          <span>US$ 1 = R$ 4,86</span>
          <h1>486,00 Reais</h1>
        </div>
      </div>
    </div>
  )
}
