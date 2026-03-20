import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import useCrmStore from '@/stores/useCrmStore'
import { useToast } from '@/hooks/use-toast'

const OPTS = {
  currency: ['BRL', 'USD'],
  saleType: ['one_shot', 'recorrente'],
  modality: ['revenda', 'agenciamento'],
  partner: ['huawei', 'aws', 'fortinet', 'acronis', 'outro'],
  stage: ['prospeccao', 'qualificacao', 'proposta_enviada', 'negociacao', 'ganho', 'perdido'],
  temperature: ['fria', 'morna', 'quente'],
}

export function OpportunityForm({
  onSuccess,
  defaultAccountId = '',
}: {
  onSuccess: () => void
  defaultAccountId?: string
}) {
  const { addOpportunity, accounts } = useCrmStore()
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      accountId: defaultAccountId,
      currency: 'BRL',
      stage: 'prospeccao',
      temperature: 'morna',
    },
  })

  const onSubmit = (data: any) => {
    addOpportunity({
      ...data,
      value: Number(data.value) || 0,
      createdAt: new Date().toISOString(),
    })
    toast({ title: 'Oportunidade criada com sucesso!' })
    onSuccess()
  }

  const F = ({ l, n, r, t = 'text' }: any) => (
    <div className="space-y-1">
      <Label className="text-[11px]">
        {l}
        {r && ' *'}
      </Label>
      <Input type={t} className="h-8 text-xs" {...register(n, { required: r })} />
      {errors[n] && <span className="text-[10px] text-destructive">Obrigatório</span>}
    </div>
  )
  const S = ({ l, n, opts, r }: any) => (
    <div className="space-y-1">
      <Label className="text-[11px]">
        {l}
        {r && ' *'}
      </Label>
      <select
        className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
        {...register(n, { required: r })}
      >
        <option value="">Selecione...</option>
        {opts.map((o: any) => (
          <option key={o} value={o}>
            {o.replace(/_/g, ' ').toUpperCase()}
          </option>
        ))}
      </select>
      {errors[n] && <span className="text-[10px] text-destructive">Obrigatório</span>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 space-y-1">
          <Label className="text-[11px]">Conta Vinculada *</Label>
          <select
            className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
            {...register('accountId', { required: true })}
          >
            <option value="">Selecione uma conta</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          {errors.accountId && <span className="text-[10px] text-destructive">Obrigatório</span>}
        </div>

        <div className="col-span-2">
          <F l="Título da Oportunidade" n="title" r />
        </div>

        <F l="Valor" n="value" t="number" r />
        <S l="Moeda" n="currency" opts={OPTS.currency} r />

        <S l="Tipo de Venda" n="saleType" opts={OPTS.saleType} />
        <S l="Modalidade" n="modality" opts={OPTS.modality} />
        <S l="Parceiro" n="partner" opts={OPTS.partner} />

        <div className="col-span-2 font-semibold text-xs mt-2 border-b pb-1 text-muted-foreground">
          Status & Pipeline
        </div>
        <S l="Fase" n="stage" opts={OPTS.stage} r />
        <S l="Temperatura" n="temperature" opts={OPTS.temperature} />

        <F l="Data Prevista de Fechamento" n="expectedCloseDate" t="date" />
        <F l="Próximo Passo (Ação)" n="nextStep" />
      </div>
      <div className="flex justify-end pt-2 pb-4">
        <Button type="submit" size="sm">
          Salvar Oportunidade
        </Button>
      </div>
    </form>
  )
}
