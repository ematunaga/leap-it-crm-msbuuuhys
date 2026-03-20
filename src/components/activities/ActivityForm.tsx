import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useCrmStore from '@/stores/useCrmStore'
import { useToast } from '@/hooks/use-toast'

const TYPES = [
  'call',
  'email',
  'whatsapp',
  'meeting',
  'follow_up',
  'proposal_sent',
  'proposal_review',
  'visit',
  'task',
  'note',
]
const CHANNELS = [
  'telefone',
  'email',
  'whatsapp',
  'linkedin',
  'reuniao_online',
  'reuniao_presencial',
  'interno',
  'outro',
]
const STATUS = ['planejada', 'em_andamento', 'concluida', 'cancelada', 'atrasada']
const OUTCOMES = [
  'positivo',
  'neutro',
  'negativo',
  'sem_resposta',
  'reagendado',
  'cancelado',
  'concluido',
]
const ENGAGEMENT = ['baixo', 'medio', 'alto']
const PRIORITIES = ['baixa', 'media', 'alta', 'critica']

export function ActivityForm({ onSuccess, initialData, defaultRelatedTo, defaultRelatedId }: any) {
  const { addActivity, updateActivity, accounts, opps, contacts } = useCrmStore()
  const { toast } = useToast()

  const defaultAcc = defaultRelatedTo === 'Account' ? defaultRelatedId : ''
  const defaultOpp = defaultRelatedTo === 'Opportunity' ? defaultRelatedId : ''
  const defaultLead = defaultRelatedTo === 'Lead' ? defaultRelatedId : ''

  const { register, handleSubmit, watch, reset, setValue } = useForm({
    defaultValues: initialData || {
      type: 'call',
      channel: 'telefone',
      status: 'planejada',
      priority: 'media',
      scheduledDate: new Date().toISOString().slice(0, 16),
      accountId: defaultAcc,
      opportunityId: defaultOpp,
      leadId: defaultLead,
    },
  })

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        scheduledDate: initialData.scheduledDate ? initialData.scheduledDate.slice(0, 16) : '',
        interactionAt: initialData.interactionAt ? initialData.interactionAt.slice(0, 16) : '',
        nextStepDate: initialData.nextStepDate ? initialData.nextStepDate.slice(0, 16) : '',
      })
    }
  }, [initialData, reset])

  const watchAccountId = watch('accountId')
  const watchOppId = watch('opportunityId')
  const watchContactId = watch('contactId')

  useEffect(() => {
    if (watchAccountId) {
      const acc = accounts.find((a) => a.id === watchAccountId)
      if (acc) setValue('accountName', acc.name)
    }
  }, [watchAccountId, accounts, setValue])

  useEffect(() => {
    if (watchOppId) {
      const opp = opps.find((o) => o.id === watchOppId)
      if (opp) setValue('opportunityTitle', opp.title)
    }
  }, [watchOppId, opps, setValue])

  useEffect(() => {
    if (watchContactId) {
      const c = contacts.find((c) => c.id === watchContactId)
      if (c) setValue('contactName', c.name)
    }
  }, [watchContactId, contacts, setValue])

  const onSubmit = (data: any) => {
    if (data.scheduledDate) data.scheduledDate = new Date(data.scheduledDate).toISOString()
    if (data.interactionAt) data.interactionAt = new Date(data.interactionAt).toISOString()
    if (data.nextStepDate) data.nextStepDate = new Date(data.nextStepDate).toISOString()

    if (data.status === 'concluida') {
      data.completed = true
      if (!initialData?.completedAt) data.completedAt = new Date().toISOString()
    }

    if (initialData?.id) {
      updateActivity(initialData.id, data)
      toast({ title: 'Atividade atualizada com sucesso!' })
    } else {
      addActivity(data)
      toast({ title: 'Atividade registrada com sucesso!' })
    }

    if (
      data.customerSignals?.toLowerCase().includes('urgente') ||
      data.customerSignals?.toLowerCase().includes('urgência')
    ) {
      toast({ title: '🚨 Alerta Gerado: Sinal de Urgência Detectado!', variant: 'destructive' })
    }

    onSuccess()
  }

  const F = ({ l, n, r, t = 'text', type = 'input' }: any) => (
    <div className="space-y-1">
      <Label className="text-[11px]">
        {l}
        {r && ' *'}
      </Label>
      {type === 'textarea' ? (
        <Textarea className="min-h-[80px] text-xs" {...register(n, { required: r })} />
      ) : (
        <Input type={t} className="h-8 text-xs" {...register(n, { required: r })} />
      )}
    </div>
  )

  const S = ({ l, n, opts, r }: any) => (
    <div className="space-y-1">
      <Label className="text-[11px]">
        {l}
        {r && ' *'}
      </Label>
      <select
        className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs capitalize"
        {...register(n, { required: r })}
      >
        <option value="">Selecione...</option>
        {opts.map((o: any) => (
          <option key={o} value={o}>
            {o.replace(/_/g, ' ')}
          </option>
        ))}
      </select>
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pb-16">
      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="geral">Dados Gerais</TabsTrigger>
          <TabsTrigger value="conteudo">Conteúdo</TabsTrigger>
          <TabsTrigger value="feedback">Feedback & Engajamento</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="space-y-4 pt-4 animate-fade-in">
          <F l="Assunto / Título da Interação" n="subject" r />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <S l="Tipo" n="type" opts={TYPES} r />
            <S l="Canal" n="channel" opts={CHANNELS} r />
            <S l="Status" n="status" opts={STATUS} r />
            <S l="Prioridade" n="priority" opts={PRIORITIES} r />
          </div>

          <div className="border-t pt-3 mt-3">
            <Label className="text-xs font-semibold mb-3 block">Relacionamentos</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label className="text-[11px]">Conta Vinculada</Label>
                <select
                  className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
                  {...register('accountId')}
                >
                  <option value="">Selecione...</option>
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-[11px]">Contato Vinculado</Label>
                <select
                  className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
                  {...register('contactId')}
                >
                  <option value="">Selecione...</option>
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-[11px]">Oportunidade</Label>
                <select
                  className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
                  {...register('opportunityId')}
                >
                  <option value="">Selecione...</option>
                  {opps.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border-t pt-3 mt-3">
            <F l="Data Agendada" n="scheduledDate" t="datetime-local" />
            <F l="Data da Interação" n="interactionAt" t="datetime-local" />
            <F l="Duração (min)" n="durationMinutes" t="number" />
            <F l="Local" n="location" />
          </div>
        </TabsContent>

        <TabsContent value="conteudo" className="space-y-4 pt-4 animate-fade-in">
          <F l="Resumo Objetivo (Obrigatório)" n="summary" r type="textarea" />
          <F l="Detalhamento Completo" n="details" type="textarea" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t">
            <F l="Ação Combinada (Próximo Passo)" n="nextStep" type="textarea" />
            <F l="Data Próximo Passo" n="nextStepDate" t="datetime-local" />
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4 pt-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <S l="Resultado da Interação" n="outcome" opts={OUTCOMES} />
            <S l="Nível de Engajamento" n="engagementLevel" opts={ENGAGEMENT} />
          </div>
          <F l="Objeções Levantadas" n="objections" type="textarea" />
          <F l="Sinais do Cliente (Urgência, Interesse, etc)" n="customerSignals" type="textarea" />
        </TabsContent>
      </Tabs>

      <div className="absolute bottom-0 left-0 right-0 bg-background border-t p-4 flex justify-end">
        <Button type="submit">Salvar Atividade</Button>
      </div>
    </form>
  )
}
