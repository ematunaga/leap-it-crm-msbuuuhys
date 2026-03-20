import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useCrmStore from '@/stores/useCrmStore'
import { Loader2, Search } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface AccountFormProps {
  onSuccess: () => void
}

export function AccountForm({ onSuccess }: AccountFormProps) {
  const { addAccount } = useCrmStore()
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm()
  const [isLoadingCnpj, setIsLoadingCnpj] = useState(false)

  const handleCnpjBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '')
    if (val.length === 14) {
      setIsLoadingCnpj(true)
      try {
        const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${val}`)
        if (!res.ok) throw new Error('CNPJ não encontrado')
        const data = await res.json()

        setValue('name', data.razao_social)
        setValue('tradingName', data.nome_fantasia || data.razao_social)
        setValue('headquartersZip', data.cep)
        setValue(
          'headquartersAddress',
          `${data.logradouro}, ${data.numero}${data.complemento ? ' - ' + data.complemento : ''}`,
        )
        setValue('headquartersCity', data.municipio)
        setValue('headquartersState', data.uf)
        setValue('phone', data.ddd_telefone_1)

        toast({ title: 'Dados preenchidos via Receita Federal' })
      } catch (err) {
        toast({ title: 'Erro ao buscar CNPJ', variant: 'destructive' })
      } finally {
        setIsLoadingCnpj(false)
      }
    }
  }

  const onSubmit = (data: any) => {
    addAccount({
      ...data,
      status: 'prospecto',
      accountTier: 'bronze',
      accountHealth: 'saudavel',
      createdAt: new Date().toISOString(),
    })
    toast({ title: 'Conta criada com sucesso!' })
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 col-span-2 sm:col-span-1">
          <Label>CNPJ</Label>
          <div className="relative">
            <Input placeholder="Apenas números" {...register('cnpj')} onBlur={handleCnpjBlur} />
            {isLoadingCnpj && (
              <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>
        <div className="space-y-2 col-span-2 sm:col-span-1">
          <Label>Razão Social *</Label>
          <Input {...register('name', { required: true })} />
          {errors.name && <span className="text-xs text-destructive">Campo obrigatório</span>}
        </div>
        <div className="space-y-2 col-span-2 sm:col-span-1">
          <Label>Nome Fantasia</Label>
          <Input {...register('tradingName')} />
        </div>
        <div className="space-y-2 col-span-2 sm:col-span-1">
          <Label>E-mail Corporativo</Label>
          <Input type="email" {...register('email')} />
        </div>
        <div className="space-y-2 col-span-2 sm:col-span-1">
          <Label>Telefone</Label>
          <Input {...register('phone')} />
        </div>
        <div className="space-y-2 col-span-2 sm:col-span-1">
          <Label>Segmento</Label>
          <Select onValueChange={(val) => setValue('segment', val)} defaultValue="tecnologia">
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="industria">Indústria</SelectItem>
              <SelectItem value="saude">Saúde</SelectItem>
              <SelectItem value="servico">Serviço</SelectItem>
              <SelectItem value="varejo">Varejo</SelectItem>
              <SelectItem value="educacao">Educação</SelectItem>
              <SelectItem value="tecnologia">Tecnologia</SelectItem>
              <SelectItem value="outros">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2 col-span-2 sm:col-span-1">
          <Label>Porte (Funcionários)</Label>
          <Select onValueChange={(val) => setValue('porte', val)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-10">0-10</SelectItem>
              <SelectItem value="11-20">11-20</SelectItem>
              <SelectItem value="21-50">21-50</SelectItem>
              <SelectItem value="51-100">51-100</SelectItem>
              <SelectItem value="101-200">101-200</SelectItem>
              <SelectItem value="201-500">201-500</SelectItem>
              <SelectItem value="501-1000">501-1000</SelectItem>
              <SelectItem value="1001-2000">1001-2000</SelectItem>
              <SelectItem value="2001-5000">2001-5000</SelectItem>
              <SelectItem value="10001+">10001+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-2 font-medium text-sm mt-2 border-b pb-1">Endereço</div>

        <div className="space-y-2 col-span-2 sm:col-span-1">
          <Label>CEP</Label>
          <Input {...register('headquartersZip')} />
        </div>
        <div className="space-y-2 col-span-2 sm:col-span-1">
          <Label>Cidade / Estado</Label>
          <div className="flex gap-2">
            <Input className="flex-1" placeholder="Cidade" {...register('headquartersCity')} />
            <Input className="w-16" placeholder="UF" {...register('headquartersState')} />
          </div>
        </div>
        <div className="space-y-2 col-span-2">
          <Label>Logradouro completo</Label>
          <Input {...register('headquartersAddress')} />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit">Cadastrar Conta</Button>
      </div>
    </form>
  )
}
