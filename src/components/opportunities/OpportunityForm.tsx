import { useForm } from 'react-hook-form'
import { useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useCrmStore from '@/stores/useCrmStore'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

const OPTS = {
  currency: ['BRL', 'USD'],
  saleType: ['one_shot', 'recorrente'],
  modality: ['revenda', 'agenciamento'],
  partner: ['huawei', 'aws', 'fortinet', 'acronis', 'outro'],
  stage: ['prospeccao', 'qualificacao', 'proposta_enviada', 'negociacao', 'ganho', 'perdido'],
  temperature: ['fria', 'morna', 'quente'],
  riskLevel: ['baixo', 'medio', 'alto', 'critico'],
  statusFollowUp: ['em_dia', 'atrasado', 'critico'],
  competitivePosition: ['liderando', 'empatado', 'perdendo'],
  productType: ['hardware', 'software_servico'],
  distributor: ['SND', 'AGIS', 'DICOMP', 'INGRAM', 'TD Synnex', 'WDC', 'ESY', 'CLM'],
  forecastCategory: ['pipeline', 'best_case', 'commit', 'closed'],
}

const FieldInput = ({ l, n, r, t = 'text', step, readOnly, className, register, errors }: any) => (
  <div className="space-y-1">
    <Label className="text-[11px]">
      {l}
      {r && ' *'}
    </Label>
    <Input
      type={t}
      step={step}
      readOnly={readOnly}
      className={cn('h-8 text-xs', className)}
      {...register(n, { required: r })}
    />
    {errors[n] && <span className="text-[10px] text-destructive">Obrigatório</span>}
  </div>
)

const FieldSelect = ({ l, n, opts, r, register, errors }: any) => (
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

export function OpportunityForm({
  onSuccess,
  defaultAccountId = '',
  initialData,
}: {
  onSuccess: () => void
  defaultAccountId?: string
  initialData?: any
}) {
  const { addOpportunity, updateOpportunity, accounts } = useCrmStore()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      accountId: defaultAccountId,
      currency: 'BRL',
      stage: 'prospeccao',
      temperature: 'morna',
      dealRegistration: false,
    },
  })

  useEffect(() => {
    if (initialData) reset(initialData)
  }, [initialData, reset])

  const watchValues = watch([
    'value',
    'totalCost',
    'icmsHardwarePercent',
    'icmsSoftwarePercent',
    'issHardwarePercent',
    'issSoftwarePercent',
    'pisCofinsPercent',
    'ipiPercent',
    'sellerCommissionPercent',
  ])

  useEffect(() => {
    const [value, totalCost, icmsH, icmsS, issH, issS, pis, ipi, comm] = watchValues
    const v = Number(value) || 0
    const c = Number(totalCost) || 0
    if (v > 0) {
      const taxesPct =
        (Number(icmsH) || 0) +
        (Number(icmsS) || 0) +
        (Number(issH) || 0) +
        (Number(issS) || 0) +
        (Number(pis) || 0) +
        (Number(ipi) || 0) +
        (Number(comm) || 0)

      const margin = ((v - c) / v) * 100 - taxesPct
      if (isFinite(margin)) {
        setValue('netMarginPercent', parseFloat(margin.toFixed(2)), { shouldDirty: true })
      }
    }
  }, [watchValues, setValue])

  const onSubmit = (data: any) => {
    const payload = {
      ...data,
      value: parseFloat(Number(data.value).toFixed(2)) || 0,
      updatedAt: new Date().toISOString(),
    }

    if (initialData?.id) {
      updateOpportunity(initialData.id, payload)
      toast({ title: 'Oportunidade atualizada!' })
    } else {
      addOpportunity({ ...payload, createdAt: new Date().toISOString() })
      toast({ title: 'Oportunidade criada com sucesso!' })
    }
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="w-full flex justify-start bg-muted p-1 overflow-x-auto">
          <TabsTrigger value="geral" className="text-xs">
            Geral
          </TabsTrigger>
          <TabsTrigger value="dinamica" className="text-xs">
            Dinâmica
          </TabsTrigger>
          <TabsTrigger value="financeiro" className="text-xs">
            Financeiro
          </TabsTrigger>
          <TabsTrigger value="pos" className="text-xs">
            Pós-Venda
          </TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="space-y-3 pt-2">
          <div className="space-y-1">
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
          </div>
          <FieldInput l="Título da Oportunidade" n="title" r register={register} errors={errors} />
          <div className="grid grid-cols-2 gap-3">
            <FieldInput
              l="Valor"
              n="value"
              t="number"
              step="0.01"
              r
              register={register}
              errors={errors}
            />
            <FieldSelect
              l="Moeda"
              n="currency"
              opts={OPTS.currency}
              r
              register={register}
              errors={errors}
            />
            <FieldSelect
              l="Tipo de Venda"
              n="saleType"
              opts={OPTS.saleType}
              register={register}
              errors={errors}
            />
            <FieldSelect
              l="Modalidade"
              n="modality"
              opts={OPTS.modality}
              register={register}
              errors={errors}
            />
            <FieldSelect
              l="Parceiro"
              n="partner"
              opts={OPTS.partner}
              register={register}
              errors={errors}
            />
            <FieldSelect
              l="Fase"
              n="stage"
              opts={OPTS.stage}
              r
              register={register}
              errors={errors}
            />
            <FieldSelect
              l="Temperatura"
              n="temperature"
              opts={OPTS.temperature}
              register={register}
              errors={errors}
            />
            <FieldInput
              l="Fechamento Previsto"
              n="expectedCloseDate"
              t="date"
              register={register}
              errors={errors}
            />
            <div className="col-span-2">
              <FieldInput l="Próximo Passo" n="nextStep" register={register} errors={errors} />
            </div>
            <FieldInput
              l="Data Próx. Passo"
              n="nextStepDate"
              t="date"
              register={register}
              errors={errors}
            />
          </div>
        </TabsContent>

        <TabsContent value="dinamica" className="grid grid-cols-2 gap-3 pt-2">
          <FieldInput
            l="Probabilidade (%)"
            n="winProbability"
            t="number"
            step="1"
            register={register}
            errors={errors}
          />
          <FieldSelect
            l="Nível de Risco"
            n="riskLevel"
            opts={OPTS.riskLevel}
            register={register}
            errors={errors}
          />
          <FieldInput
            l="Dias no Estágio (Auto)"
            n="daysInStage"
            t="number"
            readOnly
            className="bg-muted text-muted-foreground"
            register={register}
            errors={errors}
          />
          <FieldSelect
            l="Status Follow-up"
            n="statusFollowUp"
            opts={OPTS.statusFollowUp}
            register={register}
            errors={errors}
          />
          <FieldInput
            l="Resumo Última Interação"
            n="lastInteractionSummary"
            register={register}
            errors={errors}
          />
          <FieldInput
            l="Data Última Interação"
            n="lastInteractionAt"
            t="date"
            register={register}
            errors={errors}
          />
          <div className="col-span-2 mt-2 font-semibold text-xs border-b pb-1 text-muted-foreground">
            Inteligência Competitiva
          </div>
          <FieldInput
            l="Concorrente Principal"
            n="mainCompetitorName"
            register={register}
            errors={errors}
          />
          <FieldSelect
            l="Posição Competitiva"
            n="competitivePosition"
            opts={OPTS.competitivePosition}
            register={register}
            errors={errors}
          />
        </TabsContent>

        <TabsContent value="financeiro" className="grid grid-cols-2 gap-3 pt-2">
          <FieldInput
            l="Budget do Cliente"
            n="clientBudget"
            t="number"
            step="0.01"
            register={register}
            errors={errors}
          />
          <FieldInput
            l="Margem sobre Budget (%)"
            n="budgetMargin"
            t="number"
            step="0.01"
            register={register}
            errors={errors}
          />
          <FieldInput
            l="Custo Total"
            n="totalCost"
            t="number"
            step="0.01"
            register={register}
            errors={errors}
          />
          <FieldInput
            l="Fator LeapIT"
            n="fatorLeapit"
            t="number"
            step="0.01"
            register={register}
            errors={errors}
          />
          <FieldSelect
            l="Tipo de Produto"
            n="productType"
            opts={OPTS.productType}
            register={register}
            errors={errors}
          />
          <FieldSelect
            l="Distribuidor"
            n="distributor"
            opts={OPTS.distributor}
            register={register}
            errors={errors}
          />
          <div className="col-span-2 mt-2 font-semibold text-xs border-b pb-1 text-muted-foreground">
            Impostos & Comissões
          </div>
          <FieldInput
            l="ICMS Hardware (%)"
            n="icmsHardwarePercent"
            t="number"
            step="0.01"
            register={register}
            errors={errors}
          />
          <FieldInput
            l="IPI (%)"
            n="ipiPercent"
            t="number"
            step="0.01"
            register={register}
            errors={errors}
          />
          <FieldInput
            l="ISS Hardware (%)"
            n="issHardwarePercent"
            t="number"
            step="0.01"
            register={register}
            errors={errors}
          />
          <FieldInput
            l="ICMS Software (%)"
            n="icmsSoftwarePercent"
            t="number"
            step="0.01"
            register={register}
            errors={errors}
          />
          <FieldInput
            l="PIS/COFINS (%)"
            n="pisCofinsPercent"
            t="number"
            step="0.01"
            register={register}
            errors={errors}
          />
          <FieldInput
            l="ISS Software (%)"
            n="issSoftwarePercent"
            t="number"
            step="0.01"
            register={register}
            errors={errors}
          />
          <FieldInput
            l="Comissão Vendedor (%)"
            n="sellerCommissionPercent"
            t="number"
            step="0.01"
            register={register}
            errors={errors}
          />
          <FieldInput
            l="Margem Líquida (%) Auto"
            n="netMarginPercent"
            t="number"
            step="0.01"
            readOnly
            className="bg-muted text-muted-foreground"
            register={register}
            errors={errors}
          />
        </TabsContent>

        <TabsContent value="pos" className="grid grid-cols-2 gap-3 pt-2">
          <div className="col-span-2 flex items-center gap-2 border p-2 rounded-md bg-muted/20">
            <input type="checkbox" {...register('dealRegistration')} id="deal" />
            <Label htmlFor="deal" className="text-[11px] font-semibold cursor-pointer">
              Possui Deal Registration?
            </Label>
          </div>
          <FieldSelect
            l="Forecast Category"
            n="forecastCategory"
            opts={OPTS.forecastCategory}
            register={register}
            errors={errors}
          />
          <div className="col-span-2">
            <FieldInput l="Motivo da Perda" n="lossReason" register={register} errors={errors} />
          </div>
          <div className="col-span-2">
            <FieldInput
              l="Detalhe da Perda"
              n="lossReasonDetail"
              register={register}
              errors={errors}
            />
          </div>
          <div className="col-span-2">
            <Label className="text-[11px]">Notas de Auditoria / Gerais</Label>
            <Textarea className="min-h-[60px] text-xs p-2 mt-1" {...register('notes')} />
          </div>
        </TabsContent>
      </Tabs>
      <div className="flex justify-end pt-2 pb-4">
        <Button type="submit" size="sm">
          Salvar Oportunidade
        </Button>
      </div>
    </form>
  )
}
