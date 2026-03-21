import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import useCrmStore from '@/stores/useCrmStore'
import { useToast } from '@/hooks/use-toast'
import { Contact, OpportunityStakeholder } from '@/types'

const ROLES = [
  'champion',
  'economic_buyer',
  'technical_buyer',
  'user_buyer',
  'decision_maker',
  'influencer',
  'blocker',
  'sponsor',
]
const INFLUENCES = ['baixo', 'medio', 'alto']
const SENIORITIES = ['junior', 'pleno', 'senior', 'diretor', 'c_level']
const STANCES = ['favoravel', 'neutro', 'contrario']
const ACCESS_LEVELS = ['limitado', 'moderado', 'total']

export function StakeholderForm({
  opportunityId,
  accountId,
  contacts,
  initialData,
  onSuccess,
}: {
  opportunityId: string
  accountId: string
  contacts: Contact[]
  initialData?: OpportunityStakeholder
  onSuccess: () => void
}) {
  const { addStakeholder, updateStakeholder } = useCrmStore()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      opportunityId,
      accountId,
      role: 'influencer',
      influenceLevel: 'medio',
      seniorityLevel: 'pleno',
      stance: 'neutro',
      accessLevel: 'moderado',
      isChampion: false,
      isEconomicBuyer: false,
      isDecisionMaker: false,
    },
  })

  useEffect(() => {
    if (initialData) reset(initialData)
  }, [initialData, reset])

  const onSubmit = (data: any) => {
    const contact = contacts.find((c) => c.id === data.contactId)
    const payload = {
      ...data,
      contactName: contact?.name || '',
    }

    if (initialData?.id) {
      updateStakeholder(initialData.id, payload)
      toast({ title: 'Stakeholder atualizado!' })
    } else {
      addStakeholder(payload)
      toast({ title: 'Stakeholder adicionado!' })
    }
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 col-span-2">
          <Label>Contato *</Label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            {...register('contactId', { required: true })}
          >
            <option value="">Selecione um contato</option>
            {contacts.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.contactId && <span className="text-xs text-destructive">Obrigatório</span>}
        </div>

        <div className="space-y-2">
          <Label>Papel (Role) *</Label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            {...register('role', { required: true })}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label>Nível de Influência</Label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            {...register('influenceLevel')}
          >
            {INFLUENCES.map((r) => (
              <option key={r} value={r}>
                {r.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label>Senioridade</Label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            {...register('seniorityLevel')}
          >
            {SENIORITIES.map((r) => (
              <option key={r} value={r}>
                {r.replace('_', ' ').toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label>Postura (Stance)</Label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            {...register('stance')}
          >
            {STANCES.map((r) => (
              <option key={r} value={r}>
                {r.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label>Nível de Acesso</Label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            {...register('accessLevel')}
          >
            {ACCESS_LEVELS.map((r) => (
              <option key={r} value={r}>
                {r.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="col-span-2 flex gap-4 pt-2 pb-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isChampion"
              {...register('isChampion')}
              className="rounded border-input"
            />
            <Label htmlFor="isChampion" className="font-normal cursor-pointer">
              Champion
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isEconomicBuyer"
              {...register('isEconomicBuyer')}
              className="rounded border-input"
            />
            <Label htmlFor="isEconomicBuyer" className="font-normal cursor-pointer">
              Economic Buyer
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isDecisionMaker"
              {...register('isDecisionMaker')}
              className="rounded border-input"
            />
            <Label htmlFor="isDecisionMaker" className="font-normal cursor-pointer">
              Decision Maker
            </Label>
          </div>
        </div>

        <div className="space-y-2 col-span-2">
          <Label>Notas</Label>
          <Textarea
            {...register('notes')}
            placeholder="Detalhes adicionais sobre este stakeholder..."
          />
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t mt-4">
        <Button type="button" variant="outline" onClick={onSuccess} className="mr-2">
          Cancelar
        </Button>
        <Button type="submit">Salvar Stakeholder</Button>
      </div>
    </form>
  )
}
