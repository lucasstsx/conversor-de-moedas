import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function Home() {
  return (
    <div>
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
              <SelectItem value="moeda1">moeda1</SelectItem>
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
