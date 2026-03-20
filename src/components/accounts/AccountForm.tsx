import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import useCrmStore from '@/stores/useCrmStore'
import { Loader2, Plus, Trash2 } from 'lucide-react'
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
    control,
    formState: { errors },
  } = useForm({ defaultValues: { branches: [] } })

  const { fields, append, remove } = useFieldArray({ control, name: 'branches' })
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
      <Label className="text-[11px]">
        {label}
        {req && ' *'}
      </Label>
      <Input className="h-8 text-xs" {...register(name, { required: req })} />
      {errors[name] && <span className="text-[10px] text-destructive">Obrigatório</span>}
    </div>
  )
  const S = ({ label, name, opts }: any) => (
    <div className="space-y-1">
      <Label className="text-[11px]">{label}</Label>
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1 col-span-2 sm:col-span-1">
          <Label className="text-[11px]">CNPJ</Label>
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
        <F label="Insc. Estadual" name="stateRegistration" />

        <div className="col-span-2 font-semibold text-xs mt-2 border-b pb-1 text-muted-foreground">
          Contato & Endereço
        </div>
        <F label="E-mail" name="email" />
        <F label="Telefone" name="phone" />
        <F label="CEP Sede" name="headquartersZip" />
        <div className="space-y-1">
          <Label className="text-[11px]">Cidade / UF</Label>
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
        <div className="col-span-2">
          <F label="Logradouro completo" name="headquartersAddress" />
        </div>

        <div className="col-span-2 font-semibold text-xs mt-2 border-b pb-1 text-muted-foreground">
          Classificação Estratégica
        </div>
        <S label="Segmento" name="segment" opts={toOpts(OPTS.segment)} />
        <S label="Porte" name="porte" opts={toOpts(OPTS.porte)} />
        <S label="Status da Conta" name="status" opts={toOpts(OPTS.status)} />
        <S label="Account Tier" name="accountTier" opts={toOpts(OPTS.tier)} />
        <F label="Potencial (R$)" name="accountPotential" />
        <S
          label="Status de Relacionamento"
          name="relationshipStatus"
          opts={toOpts(OPTS.relStatus)}
        />
        <S label="Saúde da Conta" name="accountHealth" opts={toOpts(OPTS.health)} />

        <div className="col-span-2 font-semibold text-xs mt-4 border-b pb-1 text-muted-foreground flex justify-between items-center">
          <span>Filiais</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => append({ cnpj: '', ie: '', zip: '', address: '', city: '', state: '' })}
            className="h-6 text-xs px-2"
          >
            <Plus className="w-3 h-3 mr-1" /> Adicionar Filial
          </Button>
        </div>
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="col-span-2 border rounded-md p-3 space-y-3 relative bg-muted/20"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 text-destructive"
              onClick={() => remove(index)}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
            <div className="grid grid-cols-2 gap-3 pr-8">
              <F label="CNPJ" name={`branches.${index}.cnpj`} />
              <F label="Insc. Estadual" name={`branches.${index}.ie`} />
              <F label="CEP" name={`branches.${index}.zip`} />
              <div className="space-y-1">
                <Label className="text-[11px]">Cidade / UF</Label>
                <div className="flex gap-2">
                  <Input
                    className="h-8 text-xs flex-1"
                    placeholder="Cidade"
                    {...register(`branches.${index}.city`)}
                  />
                  <Input
                    className="h-8 text-xs w-12"
                    placeholder="UF"
                    {...register(`branches.${index}.state`)}
                  />
                </div>
              </div>
              <div className="col-span-2">
                <F label="Logradouro" name={`branches.${index}.address`} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-2 pb-4">
        <Button type="submit" size="sm">
          Cadastrar Conta
        </Button>
      </div>
    </form>
  )
}
