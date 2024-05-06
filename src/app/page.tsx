'use client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ReloadIcon } from '@radix-ui/react-icons'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { IBM_Plex_Mono as ibm } from 'next/font/google'

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

const ibmpm = ibm({
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

export default function Home() {
  const [combinacoes, setCombinacoes] = useState<ICombinacoes>({})
  const [combinacaoSelecionada, setCombinacaoSelecionada] = useState('')
  const [moeda, setMoeda] = useState<IMoedaConversao>()
  const [valorInput, setValorInput] = useState('')
  const [resultado, setResultado] = useState('')
  const [buscando, setBuscando] = useState(false)

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
      setBuscando(true)

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
      setBuscando(false)
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  useEffect(() => {
    console.log(buscando)
    fetchCombinacoes()
  }, [buscando])

  return (
    <div className="flex w-full flex-col items-center justify-center rounded-3xl px-8 md:max-w-[480px] md:border md:p-0 md:dark:border-blue-500 md:dark:bg-blue-300">
      <div className="flex w-full flex-col md:px-16 md:py-14">
        <h1 className="mb-4 text-center dark:text-white">
          Conversor de moedas
        </h1>
        <Label className="mb-[5px] dark:text-blue-900" htmlFor="valor">
          VALOR
        </Label>
        <Input
          className="mb-5 dark:border-blue-500 dark:bg-blue-200 dark:text-blue-900"
          id="valor"
          type="text"
          placeholder="0.00"
          onChange={(e) => handleInputChange(e)}
          value={valorInput}
        ></Input>

        <Label className="mb-[5px] dark:text-blue-900" htmlFor="moeda">
          MOEDA
        </Label>
        <Select onValueChange={(e) => handleMoedaChange(e)}>
          <SelectTrigger className="mb-[50px] dark:border-blue-500 dark:bg-blue-200 dark:text-blue-900">
            <SelectValue placeholder="Selecione a moeda" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup className="dark:text-blue-900">
              {Object.entries(combinacoes).map(([combinacao, nome]) => (
                <SelectItem key={combinacao} value={combinacao}>
                  {nome}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button
          disabled={!combinacaoSelecionada || buscando}
          className="h-full px-5 py-4 text-base dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700"
          onClick={handleConvertClick}
        >
          {buscando ? <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> : ''}
          Converter em reais
        </Button>
      </div>
      {moeda ? (
        <div className="result px py-10 text-center md:w-full md:rounded-b-3xl md:bg-slate-300 md:dark:bg-blue-500">
          <span className={`${ibmpm.className} dark:text-blue-900`}>
            {moeda.code === 'DOGE'
              ? 'DOGE 1,00'
              : Number('1').toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: moeda.code,
                })}{' '}
            ={' '}
            {Number(moeda.ask).toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            })}
          </span>
          <h1 className="dark:text-white">
            {resultado.replace('R$', '')} Reais
          </h1>
        </div>
      ) : (
        ''
      )}
    </div>
  )
}
