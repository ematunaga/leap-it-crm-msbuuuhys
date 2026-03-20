import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import useCrmStore from '@/stores/useCrmStore'
import { useToast } from '@/hooks/use-toast'

const TYPES = ['Call', 'Email', 'Meeting', 'Note']
const STATUS = ['Pendente', 'Concluída']
const OUTCOMES = ['Positivo', 'Neutro', 'Negativo']

export function ActivityForm({
  onSuccess,
  defaultRelatedTo = 'Account',
  defaultRelatedId = '',
}: {
  onSuccess: () => void
  defaultRelatedTo?: 'Account' | 'Opportunity' | 'Lead'
  defaultRelatedId?: string
}) {
  const { addActivity, accounts, opps, leads } = useCrmStore()
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      relatedTo: defaultRelatedTo,
      relatedId: defaultRelatedId,
      type: 'Call',
      status: 'Pendente',
      date: new Date().toISOString().split('T')[0],
    },
  })

  const relatedTo = watch('relatedTo')
  const options = relatedTo === 'Account' ? accounts : relatedTo === 'Opportunity' ? opps : leads

  const onSubmit = (data: any) => {
    addActivity(data)
    toast({ title: 'Atividade registrada com sucesso!' })
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
            {o}
          </option>
        ))}
      </select>
      {errors[n] && <span className="text-[10px] text-destructive">Obrigatório</span>}
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <S l="Tipo de Registro" n="relatedTo" opts={['Account', 'Opportunity', 'Lead']} r />
        <div className="space-y-1">
          <Label className="text-[11px]">Relacionado a *</Label>
          <select
            className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
            {...register('relatedId', { required: true })}
          >
            <option value="">Selecione...</option>
            {options.map((opt: any) => (
              <option key={opt.id} value={opt.id}>
                {opt.name || opt.title}
              </option>
            ))}
          </select>
          {errors.relatedId && <span className="text-[10px] text-destructive">Obrigatório</span>}
        </div>

        <div className="col-span-2">
          <F l="Resumo / Assunto" n="summary" r />
        </div>

        <S l="Tipo de Atividade" n="type" opts={TYPES} r />
        <F l="Data" n="date" t="date" r />

        <S l="Status" n="status" opts={STATUS} r />
        <S l="Resultado (Opcional)" n="outcome" opts={OUTCOMES} />
      </div>
      <div className="flex justify-end pt-4">
        <Button type="submit" size="sm">
          Salvar Atividade
        </Button>
      </div>
    </form>
  )
}
