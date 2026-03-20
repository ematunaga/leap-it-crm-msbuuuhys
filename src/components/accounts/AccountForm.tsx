import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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

export function AccountForm({
  onSuccess,
  initialData,
}: {
  onSuccess: () => void
  initialData?: any
}) {
  const { addAccount, updateAccount } = useCrmStore()
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || { branches: [] },
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'branches' })
  const [isLoadingCnpj, setIsLoadingCnpj] = useState(false)
  const [loadingBranches, setLoadingBranches] = useState<Record<number, boolean>>({})

  useEffect(() => {
    if (initialData) reset(initialData)
  }, [initialData, reset])

  const fetchCnpj = async (val: string) => {
    const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${val}`)
    if (!res.ok) throw new Error('CNPJ não encontrado')
    return res.json()
  }

  const handleCnpjBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '')
    if (val.length === 14) {
      setIsLoadingCnpj(true)
      try {
        const data = await fetchCnpj(val)
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

  const handleBranchCnpjBlur = async (e: React.FocusEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value.replace(/\D/g, '')
    if (val.length === 14) {
      setLoadingBranches((p) => ({ ...p, [index]: true }))
      try {
        const data = await fetchCnpj(val)
        setValue(`branches.${index}.zip` as any, data.cep)
        setValue(
          `branches.${index}.address` as any,
          `${data.logradouro}, ${data.numero}${data.complemento ? ' - ' + data.complemento : ''}`,
        )
        setValue(`branches.${index}.city` as any, data.municipio)
        setValue(`branches.${index}.state` as any, data.uf)
        toast({ title: 'Dados da filial preenchidos' })
      } catch (err) {
        toast({ title: 'Erro ao buscar CNPJ da filial', variant: 'destructive' })
      } finally {
        setLoadingBranches((p) => ({ ...p, [index]: false }))
      }
    }
  }

  const onSubmit = (data: any) => {
    const payload = {
      ...data,
      accountPotential: data.accountPotential ? Number(data.accountPotential) : 0,
      updatedAt: new Date().toISOString(),
    }
    if (initialData?.id) {
      updateAccount(initialData.id, payload)
      toast({ title: 'Conta atualizada com sucesso!' })
    } else {
      addAccount({ ...payload, createdAt: new Date().toISOString() })
      toast({ title: 'Conta criada com sucesso!' })
    }
    onSuccess()
  }

  const F = ({ l, n, r }: any) => (
    <div className="space-y-1">
      <Label className="text-[11px]">
        {l}
        {r && ' *'}
      </Label>
      <Input className="h-8 text-xs" {...register(n, { required: r })} />
      {errors[n] && <span className="text-[10px] text-destructive">Obrigatório</span>}
    </div>
  )
  const S = ({ l, n, opts }: any) => (
    <div className="space-y-1">
      <Label className="text-[11px]">{l}</Label>
      <select
        className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
        {...register(n)}
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
            <Input className="h-8 text-xs" {...register('cnpj')} onBlur={handleCnpjBlur} />
            {isLoadingCnpj && <Loader2 className="absolute right-2 top-2 h-4 w-4 animate-spin" />}
          </div>
        </div>
        <F l="Razão Social" n="name" r /> <F l="Nome Fantasia" n="tradingName" />{' '}
        <F l="Insc. Estadual" n="stateRegistration" />
        <div className="col-span-2 font-semibold text-xs mt-2 border-b pb-1 text-muted-foreground">
          Contato & Endereço
        </div>
        <F l="E-mail" n="email" /> <F l="Telefone" n="phone" /> <F l="Website" n="website" />{' '}
        <F l="LinkedIn" n="linkedin" />
        <F l="CEP Sede" n="headquartersZip" />
        <div className="space-y-1">
          <Label className="text-[11px]">Cidade / UF</Label>
          <div className="flex gap-2">
            <Input className="h-8 text-xs flex-1" {...register('headquartersCity')} />
            <Input className="h-8 text-xs w-16" {...register('headquartersState')} />
          </div>
        </div>
        <div className="col-span-2">
          <F l="Logradouro" n="headquartersAddress" />
        </div>
        <div className="col-span-2 font-semibold text-xs mt-2 border-b pb-1 text-muted-foreground">
          Classificação Estratégica
        </div>
        <S l="Segmento" n="segment" opts={toOpts(OPTS.segment)} />{' '}
        <S l="Porte" n="porte" opts={toOpts(OPTS.porte)} />
        <S l="Status" n="status" opts={toOpts(OPTS.status)} />{' '}
        <S l="Account Tier" n="accountTier" opts={toOpts(OPTS.tier)} />
        <F l="Potencial (R$)" n="accountPotential" />{' '}
        <S l="Relacionamento" n="relationshipStatus" opts={toOpts(OPTS.relStatus)} />
        <S l="Saúde" n="accountHealth" opts={toOpts(OPTS.health)} />
        <div className="col-span-2 font-semibold text-xs mt-2 border-b pb-1 text-muted-foreground">
          Análise Estratégica
        </div>
        <div className="col-span-2">
          <Label className="text-[11px]">Ambiente/Stack Atual</Label>
          <Textarea className="min-h-[40px] text-xs p-2 mt-1" {...register('currentEnvironment')} />
        </div>
        <div className="col-span-2">
          <Label className="text-[11px]">Dor Principal</Label>
          <Textarea className="min-h-[40px] text-xs p-2 mt-1" {...register('mainPain')} />
        </div>
        <div className="col-span-2">
          <Label className="text-[11px]">White Space (Expansão)</Label>
          <Textarea className="min-h-[40px] text-xs p-2 mt-1" {...register('whiteSpaceNotes')} />
        </div>
        <div className="col-span-2 font-semibold text-xs mt-4 border-b pb-1 flex justify-between items-center text-muted-foreground">
          <span>Filiais</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => append({ cnpj: '', ie: '', zip: '', address: '', city: '', state: '' })}
            className="h-6 text-xs px-2"
          >
            <Plus className="w-3 h-3 mr-1" /> Add Filial
          </Button>
        </div>
        {fields.map((f, i) => (
          <div
            key={f.id}
            className="col-span-2 border rounded-md p-3 space-y-3 relative bg-muted/20"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 text-destructive"
              onClick={() => remove(i)}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
            <div className="grid grid-cols-2 gap-3 pr-8">
              <div className="space-y-1">
                <Label className="text-[11px]">CNPJ</Label>
                <div className="relative">
                  <Input
                    className="h-8 text-xs"
                    {...register(`branches.${i}.cnpj` as const)}
                    onBlur={(e) => handleBranchCnpjBlur(e, i)}
                  />
                  {loadingBranches[i] && (
                    <Loader2 className="absolute right-2 top-2 h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
              </div>
              <F l="Insc. Estadual" n={`branches.${i}.ie`} /> <F l="CEP" n={`branches.${i}.zip`} />
              <div className="space-y-1">
                <Label className="text-[11px]">Cidade / UF</Label>
                <div className="flex gap-2">
                  <Input
                    className="h-8 text-xs flex-1"
                    {...register(`branches.${i}.city` as const)}
                  />
                  <Input
                    className="h-8 text-xs w-12"
                    {...register(`branches.${i}.state` as const)}
                  />
                </div>
              </div>
              <div className="col-span-2">
                <F l="Logradouro" n={`branches.${i}.address`} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end pt-2 pb-4">
        <Button type="submit" size="sm">
          Salvar Conta
        </Button>
      </div>
    </form>
  )
}
