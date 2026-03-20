import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import useCrmStore from '@/stores/useCrmStore'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

const OPTS = {
  segment: ['', 'industria', 'saude', 'servico', 'varejo', 'educacao', 'outros'],
  porte: [
    '',
    '0-10',
    '11-20',
    '21-50',
    '51-100',
    '101-200',
    '201-500',
    '501-1000',
    '1001-2000',
    '2001-5000',
    '5001-10000',
    '10001+',
  ],
  status: ['prospecto', 'ativa', 'inativa', 'cliente'],
  tier: ['bronze', 'prata', 'ouro', 'platina'],
  relStatus: ['novo', 'em_desenvolvimento', 'estabelecido', 'em_risco', 'dormindo'],
  health: ['saudavel', 'em_risco', 'critico', 'dormindo'],
}
const toOpts = (arr: string[]) =>
  arr.map((v) => ({
    value: v,
    label: v ? v.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) : 'Selecione...',
  }))

export function AccountForm({ onSuccess }: { onSuccess: () => void }) {
  const { addAccount } = useCrmStore()
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    setValue,
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
      accountPotential: data.accountPotential ? Number(data.accountPotential) : 0,
      createdAt: new Date().toISOString(),
    })
    toast({ title: 'Conta criada com sucesso!' })
    onSuccess()
  }

  const F = ({ label, name, req }: any) => (
    <div className="space-y-1">
      <Label className="text-xs">
        {label}
        {req && ' *'}
      </Label>
      <Input className="h-8 text-xs" {...register(name, { required: req })} />
      {errors[name] && <span className="text-[10px] text-destructive">Obrigatório</span>}
    </div>
  )
  const S = ({ label, name, opts }: any) => (
    <div className="space-y-1">
      <Label className="text-xs">{label}</Label>
      <select
        className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
        {...register(name)}
      >
        {opts.map((o: any) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
  const T = ({ label, name }: any) => (
    <div className="space-y-1 col-span-2 sm:col-span-1">
      <Label className="text-xs">{label}</Label>
      <textarea
        className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
        {...register(name)}
      />
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1 col-span-2 sm:col-span-1">
          <Label className="text-xs">CNPJ</Label>
          <div className="relative">
            <Input
              className="h-8 text-xs"
              placeholder="Apenas números"
              {...register('cnpj')}
              onBlur={handleCnpjBlur}
            />
            {isLoadingCnpj && (
              <Loader2 className="absolute right-2 top-2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>
        <F label="Razão Social" name="name" req />
        <F label="Nome Fantasia" name="tradingName" />
        <F label="Inscrição Estadual" name="stateRegistration" />

        <div className="col-span-2 font-semibold text-xs mt-2 border-b pb-1 text-muted-foreground">
          Contato & Web
        </div>
        <F label="E-mail" name="email" />
        <F label="Telefone" name="phone" />
        <F label="Website" name="website" />
        <F label="LinkedIn" name="linkedin" />

        <div className="col-span-2 font-semibold text-xs mt-2 border-b pb-1 text-muted-foreground">
          Classificação & Estratégia
        </div>
        <S label="Segmento" name="segment" opts={toOpts(OPTS.segment)} />
        <S label="Porte (Funcionários)" name="porte" opts={toOpts(OPTS.porte)} />
        <F label="Indústria (Detalhe)" name="industry" />
        <S label="Status da Conta" name="status" opts={toOpts(OPTS.status)} />
        <S label="Account Tier" name="accountTier" opts={toOpts(OPTS.tier)} />
        <F label="Potencial (R$)" name="accountPotential" />
        <S
          label="Status de Relacionamento"
          name="relationshipStatus"
          opts={toOpts(OPTS.relStatus)}
        />
        <S label="Saúde da Conta" name="accountHealth" opts={toOpts(OPTS.health)} />

        <T label="Ambiente Atual (Tech Stack)" name="currentEnvironment" />
        <T label="Dor Principal" name="mainPain" />
        <T label="Notas Estratégicas" name="strategicNotes" />
        <T label="White Space (Oportunidades)" name="whiteSpaceNotes" />

        <div className="col-span-2 font-semibold text-xs mt-2 border-b pb-1 text-muted-foreground">
          Endereço Sede
        </div>
        <F label="CEP" name="headquartersZip" />
        <div className="space-y-1 col-span-2 sm:col-span-1">
          <Label className="text-xs">Cidade / Estado</Label>
          <div className="flex gap-2">
            <Input
              className="h-8 text-xs flex-1"
              placeholder="Cidade"
              {...register('headquartersCity')}
            />
            <Input
              className="h-8 text-xs w-16"
              placeholder="UF"
              {...register('headquartersState')}
            />
          </div>
        </div>
        <div className="space-y-1 col-span-2">
          <Label className="text-xs">Logradouro completo</Label>
          <Input className="h-8 text-xs" {...register('headquartersAddress')} />
        </div>
      </div>
      <div className="flex justify-end pt-2 pb-4">
        <Button type="submit" size="sm">
          Cadastrar Conta
        </Button>
      </div>
    </form>
  )
}
