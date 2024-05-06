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

interface ICombinacoes {
  [sigla: string]: string
}
interface IConversaoMoeda {
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
interface IMoedaConversao {
  ask: IConversaoMoeda['ask']
  code: IConversaoMoeda['code']
  codein: IConversaoMoeda['codein']
}

const BASE_URL = 'https://economia.awesomeapi.com.br'

export default function Home() {
  const [combinacoes, setCombinacoes] = useState<ICombinacoes>({})
  const [combinacaoSelecionada, setCombinacaoSelecionada] = useState('')
  const [moeda, setMoeda] = useState<IMoedaConversao>()
  const [resultado, setResultado] = useState('')
  const [valorInput, setValorInput] = useState('')

  const fetchCombinacoes = async () => {
    try {
      const response = await axios.get<ICombinacoes>(
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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const valort = event.target.value
    setValorInput(valort)
  }

  async function handleConvertClick() {
    if (isNaN(Number(valorInput)) || Number(valorInput) <= 0) {
      alert(
        valorInput.includes(',')
          ? `Valor inválido! ${'\nObs: Utilize ponto ao invés de vírgula. Ex: 1.00'}`
          : `Valor inválido!`,
      )
      return
    }
    if (!combinacaoSelecionada) {
      alert('Selecione uma moeda')
      return
    }

    try {
      const response = await axios.get<IConversaoMoeda[]>(
        `${BASE_URL}/${combinacaoSelecionada}`,
      )

      const moeda: IMoedaConversao = response.data.map(
        (item: IConversaoMoeda) => ({
          ask: item.ask,
          code: item.code,
          codein: item.codein,
        }),
      )[0]

      setMoeda(moeda)

      const result = (Number(moeda.ask) * Number(valorInput)).toLocaleString(
        'pt-BR',
        {
          style: 'currency',
          currency: moeda.codein,
        },
      )
      setResultado(result)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    fetchCombinacoes()
  }, [])

  return (
    <div>
      <h1>Conversor de moedas para BRL</h1>
      <div className="form">
        <Label htmlFor="valor">VALOR</Label>
        <Input
          id="valor"
          type="text"
          placeholder="0.00"
          onChange={(e) => handleInputChange(e)}
          value={valorInput}
        ></Input>

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
        {moeda ? (
          <div className="result">
            <span>
              {Number('1').toLocaleString('pt-BR', {
                style: 'currency',
                currency: moeda.code,
              })}{' '}
              ={' '}
              {Number(moeda.ask).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              })}
            </span>
            <h1>{resultado} Reais</h1>
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  )
}
