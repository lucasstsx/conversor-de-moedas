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

interface ICombinacao {
  [sigla: string]: string
}
export interface IConversaoMoedas {
  code: string
  codein: string
  name: string
  high: string
  low: string
  varBid: string
  pctChange: string
  bid: string
  ask: string
  timestamp: string
  create_date: Date
}

const BASE_URL = 'https://economia.awesomeapi.com.br'

export default function Home({ stars }: { stars: number }) {
  const [combinacoes, setCombinacoes] = useState<ICombinacao>({})
  const [combinacaoSelecionada, setCombinacaoSelecionada] = useState('')

  const fetchCombinacoes = async () => {
    try {
      const response = await axios.get<ICombinacao>(
        `${BASE_URL}/json/available`,
      )
      // Filtra e converte a resposta diretamente para um objeto
      const combinacoesFiltradas = Object.fromEntries(
        Object.entries(response.data).filter(([combinacao]) =>
          combinacao.endsWith('BRL'),
        ),
      )
      for (const [combinacao, nome] of Object.entries(combinacoesFiltradas)) {
        combinacoesFiltradas[combinacao] = nome.replace('/Real Brasileiro', '') // Substitui todas as ocorrências de '/Real Brasileiro' por ''
      }
      setCombinacoes(combinacoesFiltradas)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  function handleMoedaChange(val: string) {
    setCombinacaoSelecionada(val)
  }

  async function handleConvertClick() {
    if (!combinacaoSelecionada) {
      alert('Selecione uma moeda')
      return
    }

    const inputValorElement = document.querySelector(
      '#valor',
    ) as HTMLInputElement

    const divFormElement = document.querySelector('.form') as HTMLDivElement

    try {
      const response = await axios.get<IConversaoMoedas[]>(
        `${BASE_URL}/${combinacaoSelecionada}`,
      )
      const valorMoeda = response.data.map((item: IConversaoMoedas) => ({
        ask: item.ask,
        code: item.code,
        codein: item.codein,
      }))[0]

      const valorInput = inputValorElement.value.replace(',', '')

      if (isNaN(Number(valorInput))) {
        alert('Valor inválido')
        return
      }
      const resultado = (
        Number(valorMoeda.ask) * Number(valorInput)
      ).toLocaleString('pt-BR', {
        style: 'currency',
        currency: valorMoeda.codein,
      })
      console.log(valorMoeda)

      if (divFormElement) {
        const resultadoElement = document.createElement('div')
        resultadoElement.className = 'resultado'
        resultadoElement.textContent = `Valor convertido: ${resultado}`
        divFormElement.appendChild(resultadoElement)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchCombinacoes()
  }, [])

  return (
    <div>
      {stars}
      <h1>Conversor de moedas para BRL</h1>
      <div className="form">
        <Label htmlFor="valor">VALOR</Label>
        <Input id="valor" type="text" placeholder="0,00"></Input>

        <Label htmlFor="moeda">MOEDA</Label>
        <Select onValueChange={(e) => handleMoedaChange(e)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a moeda" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.entries(combinacoes).map(([combinacao, nome]) => (
                <SelectItem key={combinacao} value={combinacao}>
                  {nome}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button onClick={handleConvertClick}>Converter em reais</Button>
      </div>
    </div>
  )
}
