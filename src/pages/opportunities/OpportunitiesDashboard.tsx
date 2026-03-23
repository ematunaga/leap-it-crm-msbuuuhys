import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import useCrmStore from '@/stores/useCrmStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts'
import { Briefcase, DollarSign, Target, Plus, Edit, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatMoney, formatDate, convertCurrency } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { OpportunityForm } from '@/components/opportunities/OpportunityForm'
import { useToast } from '@/hooks/use-toast'
import { useRbac } from '@/hooks/use-rbac'
import { AccessDenied } from '@/components/AccessDenied'
import { RequirePermission } from '@/components/RequirePermission'

const COLORS = ['#2563eb', '#f59e0b', '#e11d48', '#10b981', '#8b5cf6', '#6366f1', '#14b8a6']

export default function OpportunitiesDashboard() {
  const { opps, accounts, deleteOpportunity, currencyView, setCurrencyView, ptaxRate, ptaxDate } =
    useCrmStore()
  const { toast } = useToast()
  const { can } = useRbac()
  
  const [year, setYear] = useState<string>('todos')
  const [quarter, setQuarter] = useState<string>('todos')
  const [openOpp, setOpenOpp] = useState(false)
  const [editOpp, setEditOpp] = useState<any>(null)

  if (!can('opportunities', 'visualizar')) return <AccessDenied />

  const filteredOpps = useMemo(() => {
    return opps.filter((o) => {
      const date = new Date(o.expectedCloseDate || o.nextStepDate || new Date())
      const oppYear = date.getFullYear().toString()
      const oppQuarter = `Q${Math.floor(date.getMonth() / 3) + 1}`

      if (year !== 'todos' && oppYear !== year) return false
      if (quarter !== 'todos' && oppQuarter !== quarter) return false
      return true
    })
  }, [opps, year, quarter])

  const totalValue = filteredOpps.reduce(
    (sum, o) => sum + convertCurrency(o.value, o.currency || 'BRL', currencyView, ptaxRate),
    0,
  )
  const totalQtd = filteredOpps.length

  const byPartner = useMemo(() => {
    const data: Record<string, { name: string; value: number; qtd: number }> = {}
    filteredOpps.forEach((o) => {
      const p = o.partner || 'Outro'
      if (!data[p]) data[p] = { name: p.toUpperCase(), value: 0, qtd: 0 }
      data[p].value += convertCurrency(o.value, o.currency || 'BRL', currencyView, ptaxRate)
      data[p].qtd += 1
    })
    return Object.values(data).sort((a, b) => b.value - a.value)
  }, [filteredOpps, currencyView, ptaxRate])

  const byQuarterChart = useMemo(() => {
    const data: Record<string, { name: string; value: number }> = {}
    filteredOpps.forEach((o) => {
      const date = new Date(o.expectedCloseDate || o.nextStepDate || new Date())
      const q = `Q${Math.floor(date.getMonth() / 3) + 1} ${date.getFullYear()}`
      if (!data[q]) data[q] = { name: q, value: 0 }
      data[q].value += convertCurrency(o.value, o.currency || 'BRL', currencyView, ptaxRate)
    })
    return Object.values(data).sort((a, b) => a.name.localeCompare(b.name))
  }, [filteredOpps, currencyView, ptaxRate])

  const availableYears = Array.from(
    new Set(
      opps.map((o) =>
        new Date(o.expectedCloseDate || o.nextStepDate || new Date()).getFullYear().toString(),
      ),
    ),
  ).sort()

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Oportunidades Mapeadas</h1>
          <p className="text-muted-foreground mt-1">
            Visão analítica de todo o funil de negócios (Dashboard BI).
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-3 flex-wrap justify-end">
            <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border">
              <Button
                variant={currencyView === 'BRL' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 text-xs px-3"
                onClick={() => setCurrencyView('BRL')}
              >
                BRL
              </Button>
              <Button
                variant={currencyView === 'USD' ? 'secondary' : 'ghost'}
                size="sm"
                className="h-8 text-xs px-3"
                onClick={() => setCurrencyView('USD')}
              >
                USD
              </Button>
            </div>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger className="w-[120px] bg-background">
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Anos</SelectItem>
                {availableYears.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={quarter} onValueChange={setQuarter}>
              <SelectTrigger className="w-[140px] bg-background">
                <SelectValue placeholder="Trimestre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Trims.</SelectItem>
                <SelectItem value="Q1">Q1 (Jan-Mar)</SelectItem>
                <SelectItem value="Q2">Q2 (Abr-Jun)</SelectItem>
                <SelectItem value="Q3">Q3 (Jul-Set)</SelectItem>
                <SelectItem value="Q4">Q4 (Out-Dez)</SelectItem>
              </SelectContent>
            </Select>
            <RequirePermission module="opportunities" action="criar">
              <Button
                onClick={() => {
                  setEditOpp(null)
                  setOpenOpp(true)
                }}
              >
                <Plus className="w-4 h-4 mr-2" /> Nova Oportunidade
              </Button>
            </RequirePermission>
          </div>
          <div className="text-[10px] text-muted-foreground mt-1 mr-1">
            Cotação PTAX: R$ {ptaxRate.toFixed(4)} (Data: {ptaxDate ? formatDate(ptaxDate) : '-'})
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-subtle hover:shadow-elevation transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Volume Mapeado
            </CardTitle>
            <Briefcase className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalQtd}</div>
            <p className="text-xs text-muted-foreground mt-1">Oportunidades no período</p>
          </CardContent>
        </Card>
        <Card className="shadow-subtle hover:shadow-elevation transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Valor Total (Pipeline)
            </CardTitle>
            <DollarSign className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatMoney(totalValue, currencyView)}</div>
            <p className="text-xs text-muted-foreground mt-1">Soma de todas as negociações</p>
          </CardContent>
        </Card>
        <Card className="shadow-subtle hover:shadow-elevation transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ticket Médio
            </CardTitle>
            <Target className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {totalQtd ? formatMoney(totalValue / totalQtd, currencyView) : 'R$ 0,00'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Valor médio por oportunidade</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-subtle">
          <CardHeader>
            <CardTitle className="text-lg">Valor por Fabricante / Parceiro</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ value: { label: 'Valor' } }} className="h-[300px]">
              <BarChart data={byPartner} layout="vertical" margin={{ left: 20 }}>
                <XAxis
                  type="number"
                  tickFormatter={(val) => `${currencyView === 'USD' ? 'US

<skip-file path="src/pages/opportunities/OpportunityDetail.tsx" type="typescript">
import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useCrmStore from '@/stores/useCrmStore'
import { cn, formatDate, formatMoney, convertCurrency } from '@/lib/utils'
import { OpportunityForm } from '@/components/opportunities/OpportunityForm'
import { StakeholderForm } from '@/components/opportunities/StakeholderForm'
import NotFound from '../NotFound'
import { Edit, Plus, Trash2 } from 'lucide-react'
import { useRbac } from '@/hooks/use-rbac'
import { AccessDenied } from '@/components/AccessDenied'
import { RequirePermission } from '@/components/RequirePermission'

export default function OpportunityDetail() {
  const { id } = useParams()
  const {
    opps,
    accounts,
    activities,
    contacts,
    stakeholders,
    updateOpportunity,
    deleteStakeholder,
    currencyView,
    setCurrencyView,
    ptaxRate,
    ptaxDate,
  } = useCrmStore()
  const [openEdit, setOpenEdit] = useState(false)
  const [openStakeholder, setOpenStakeholder] = useState(false)
  const [editingStakeholder, setEditingStakeholder] = useState<any>(undefined)
  const { can } = useRbac()

  if (!can('opportunities', 'visualizar')) return <AccessDenied />

  const opp = opps.find((o) => o.id === id)
  if (!opp) return <NotFound />

  const account = accounts.find((a) => a.id === opp.accountId)
  const oppActivities = activities.filter(
    (a) => a.relatedTo === 'Opportunity' && a.relatedId === id,
  )
  const accountContacts = contacts.filter((c) => c.accountId === opp.accountId)
  const oppStakeholders = stakeholders?.filter((s) => s.opportunityId === opp.id) || []
  
  const canEdit = can('opportunities', 'editar')

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex items-start justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold">{opp.title}</h1>
          <p className="text-lg text-muted-foreground mt-1 flex items-center gap-2">
            <Link
              to={`/contas/${account?.id}`}
              className="hover:underline hover:text-primary font-medium"
            >
              {account?.name}
            </Link>
          </p>
          <RequirePermission module="opportunities" action="editar">
            <Dialog open={openEdit} onOpenChange={setOpenEdit}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="mt-3">
                  <Edit className="w-4 h-4 mr-2" /> Editar Oportunidade
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle>Editar Oportunidade</DialogTitle>
                </DialogHeader>
                <div className="pt-2">
                  <OpportunityForm initialData={opp} onSuccess={() => setOpenEdit(false)} />
                </div>
              </DialogContent>
            </Dialog>
          </RequirePermission>
        </div>
        <div className="text-right flex flex-col items-end">
          <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border mb-2">
            <Button
              variant={currencyView === 'BRL' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-6 text-[10px] px-2"
              onClick={() => setCurrencyView('BRL')}
            >
              BRL
            </Button>
            <Button
              variant={currencyView === 'USD' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-6 text-[10px] px-2"
              onClick={() => setCurrencyView('USD')}
            >
              USD
            </Button>
          </div>
          <div className="text-3xl font-bold font-mono text-primary">
            {formatMoney(
              convertCurrency(opp.value, opp.currency || 'BRL', currencyView, ptaxRate),
              currencyView,
            )}
          </div>
          {opp.currency && opp.currency !== currencyView && (
            <div className="text-xs text-muted-foreground font-mono mt-1">
              Original: {formatMoney(opp.value, opp.currency)}
            </div>
          )}
          <div className="flex justify-end gap-2 mt-2">
            <Badge variant="outline" className="capitalize">
              {opp.stage.replace('_', ' ')}
            </Badge>
            <Badge
              className={
                opp.temperature === 'quente'
                  ? 'bg-rose-500 hover:bg-rose-600'
                  : opp.temperature === 'morna'
                    ? 'bg-amber-500 hover:bg-amber-600'
                    : 'bg-blue-500 hover:bg-blue-600'
              }
            >
              {opp.temperature}
            </Badge>
          </div>
          <div className="text-[10px] text-muted-foreground mt-2 text-right">
            PTAX: R$ {ptaxRate.toFixed(4)} <br />
            (Ref: {ptaxDate ? formatDate(ptaxDate) : '-'})
          </div>
        </div>
      </div>

      <Tabs defaultValue="360" className="w-full">
        <TabsList className="bg-muted flex flex-wrap h-auto w-full justify-start gap-1 p-1">
          <TabsTrigger value="360">Visão 360º</TabsTrigger>
          <TabsTrigger value="meddic">Qualificação MEDDPICC</TabsTrigger>
          <TabsTrigger value="committee">Comitê de Compra</TabsTrigger>
          <TabsTrigger value="finance">Finanças & Produto</TabsTrigger>
          {can('activities', 'visualizar') && (
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="360" className="mt-4 space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="shadow-subtle md:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Pipeline, Dinâmica & Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div className="bg-muted/30 p-3 rounded-lg border">
                    <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                      Probabilidade
                    </p>
                    <p className="font-semibold text-base mt-1">
                      {opp.winProbability ? `${opp.winProbability}%` : '-'}
                    </p>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg border">
                    <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                      Nível de Risco
                    </p>
                    <p className="font-semibold text-base mt-1 capitalize">
                      {opp.riskLevel || '-'}
                    </p>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg border">
                    <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                      Dias na Fase
                    </p>
                    <p className="font-semibold text-base mt-1">{opp.daysInStage || '-'}</p>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg border">
                    <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                      Fechamento Previsto
                    </p>
                    <p className="font-semibold text-base mt-1">
                      {formatDate(opp.expectedCloseDate || opp.nextStepDate)}
                    </p>
                  </div>
                  <div className="bg-primary/5 border-primary/20 p-3 rounded-lg border col-span-2 sm:col-span-4 flex justify-between items-center">
                    <div>
                      <p className="text-primary/70 text-[11px] uppercase font-semibold">
                        Próximo Passo
                      </p>
                      <p className="font-semibold text-base mt-1">{opp.nextStep || '-'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-primary/70 text-[11px] uppercase font-semibold">Data</p>
                      <p className="font-semibold text-base mt-1">{formatDate(opp.nextStepDate)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-subtle">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Detalhes Comerciais & Pós-Venda</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-x-2 gap-y-4">
                  <div>
                    <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                      Tipo de Venda
                    </p>
                    <p className="font-medium capitalize">{opp.saleType.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                      Modalidade
                    </p>
                    <p className="font-medium capitalize">{opp.modality}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                      Moeda
                    </p>
                    <p className="font-medium">{opp.currency}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                      Forecast Category
                    </p>
                    <p className="font-medium capitalize">{opp.forecastCategory || '-'}</p>
                  </div>
                  <div className="col-span-2 border-t pt-2">
                    <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                      Deal Registration
                    </p>
                    <p className="font-medium">{opp.dealRegistration ? 'Ativo' : 'Não'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-subtle">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Inteligência Competitiva</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-x-2 gap-y-4">
                  <div>
                    <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                      Concorrente Principal
                    </p>
                    <p className="font-medium">{opp.mainCompetitorName || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                      Nossa Posição
                    </p>
                    <p className="font-medium capitalize">{opp.competitivePosition || '-'}</p>
                  </div>
                  <div className="col-span-2 border-t pt-2">
                    <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                      Notas e Auditoria
                    </p>
                    <p className="font-medium mt-1">
                      {opp.notes || (
                        <span className="text-muted-foreground italic">Sem notas...</span>
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="meddic" className="mt-4">
          <Card className="shadow-subtle">
            <CardHeader>
              <CardTitle>Framework de Qualificação Detalhado</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Pain (Dor Identificada)</Label>
                <Textarea
                  disabled={!canEdit}
                  defaultValue={opp.identifiedPain}
                  placeholder="Qual a dor principal?"
                  onBlur={(e) => updateOpportunity(opp.id, { identifiedPain: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Metrics / Business Impact</Label>
                <Textarea
                  disabled={!canEdit}
                  defaultValue={opp.businessImpact}
                  placeholder="Quais os ganhos mensuráveis?"
                  onBlur={(e) => updateOpportunity(opp.id, { businessImpact: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Decision Criteria (Critérios de Decisão)</Label>
                <Textarea
                  disabled={!canEdit}
                  defaultValue={opp.decisionCriteria}
                  placeholder="Como eles avaliam a solução?"
                  onBlur={(e) => updateOpportunity(opp.id, { decisionCriteria: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Decision Process (Processo de Decisão)</Label>
                <Textarea
                  disabled={!canEdit}
                  defaultValue={opp.decisionProcess}
                  placeholder="Quais os passos até a compra?"
                  onBlur={(e) => updateOpportunity(opp.id, { decisionProcess: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Status de Orçamento (Budget)</Label>
                <Select
                  disabled={!canEdit}
                  defaultValue={opp.budgetStatus || 'nao_confirmado'}
                  onValueChange={(val) => updateOpportunity(opp.id, { budgetStatus: val })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nao_confirmado">Não Confirmado</SelectItem>
                    <SelectItem value="parcialmente_confirmado">Parcialmente Confirmado</SelectItem>
                    <SelectItem value="confirmado">Confirmado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="committee" className="mt-4 space-y-4">
          <Card className="shadow-subtle">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Comitê de Compra (Stakeholders)</CardTitle>
              <RequirePermission module="opportunities" action="editar">
                <Dialog open={openStakeholder} onOpenChange={setOpenStakeholder}>
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={() => setEditingStakeholder(undefined)}>
                      <Plus className="w-4 h-4 mr-2" /> Adicionar Stakeholder
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>
                        {editingStakeholder ? 'Editar' : 'Adicionar'} Stakeholder
                      </DialogTitle>
                    </DialogHeader>
                    <StakeholderForm
                      opportunityId={opp.id}
                      accountId={opp.accountId}
                      contacts={accountContacts}
                      initialData={editingStakeholder}
                      onSuccess={() => setOpenStakeholder(false)}
                    />
                  </DialogContent>
                </Dialog>
              </RequirePermission>
            </CardHeader>
            <CardContent>
              {oppStakeholders.length === 0 ? (
                <p className="text-muted-foreground text-center py-6 text-sm">
                  Nenhum stakeholder mapeado ainda.
                </p>
              ) : (
                <div className="overflow-x-auto border rounded-md">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Contato</th>
                        <th className="px-4 py-3 font-semibold">Papel</th>
                        <th className="px-4 py-3 font-semibold">Influência</th>
                        <th className="px-4 py-3 font-semibold">Postura</th>
                        <th className="px-4 py-3 font-semibold">Tags</th>
                        <th className="px-4 py-3 font-semibold text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {oppStakeholders.map((sh) => (
                        <tr key={sh.id} className="border-t last:border-0 hover:bg-muted/20">
                          <td className="px-4 py-3 font-medium">{sh.contactName}</td>
                          <td className="px-4 py-3 capitalize">{sh.role?.replace('_', ' ')}</td>
                          <td className="px-4 py-3 capitalize">{sh.influenceLevel}</td>
                          <td className="px-4 py-3 capitalize">
                            <Badge
                              variant="outline"
                              className={cn(
                                sh.stance === 'favoravel' && 'border-green-500 text-green-600',
                                sh.stance === 'contrario' && 'border-red-500 text-red-600',
                              )}
                            >
                              {sh.stance}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1 flex-wrap">
                              {sh.isChampion && (
                                <Badge className="bg-amber-500 text-[10px]">Champion</Badge>
                              )}
                              {sh.isEconomicBuyer && (
                                <Badge className="bg-blue-500 text-[10px]">Eco. Buyer</Badge>
                              )}
                              {sh.isDecisionMaker && (
                                <Badge className="bg-purple-500 text-[10px]">Dec. Maker</Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <RequirePermission module="opportunities" action="editar">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingStakeholder(sh)
                                  setOpenStakeholder(true)
                                }}
                              >
                                <Edit className="w-4 h-4 text-muted-foreground" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => deleteStakeholder(sh.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </RequirePermission>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="finance" className="mt-4">
          <Card className="shadow-subtle">
            <CardHeader>
              <CardTitle>Informações Financeiras & Produtos</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
              <div>
                <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                  Budget do Cliente
                </p>
                <p className="font-medium mt-1 font-mono">
                  {opp.clientBudget ? formatMoney(opp.clientBudget) : '-'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                  Custo Total
                </p>
                <p className="font-medium mt-1 font-mono">
                  {opp.totalCost ? formatMoney(opp.totalCost) : '-'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                  Margem Líquida
                </p>
                <p className="font-medium mt-1">
                  {opp.netMarginPercent ? `${opp.netMarginPercent}%` : '-'}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                  Distribuidor
                </p>
                <p className="font-medium mt-1">{opp.distributor || '-'}</p>
              </div>

              <div className="col-span-2 sm:col-span-4 border-t pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                    Fator LeapIT
                  </p>
                  <p className="font-medium">{opp.fatorLeapit || '-'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                    Comissão Vendas
                  </p>
                  <p className="font-medium">
                    {opp.sellerCommissionPercent ? `${opp.sellerCommissionPercent}%` : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                    ICMS (HW/SW)
                  </p>
                  <p className="font-medium">
                    {opp.icmsHardwarePercent || 0}% / {opp.icmsSoftwarePercent || 0}%
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                    ISS (HW/SW)
                  </p>
                  <p className="font-medium">
                    {opp.issHardwarePercent || 0}% / {opp.issSoftwarePercent || 0}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {can('activities', 'visualizar') && (
          <TabsContent value="timeline" className="mt-4">
            <Card className="shadow-subtle">
              <CardContent className="pt-6">
                {oppActivities.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    Nenhuma atividade registrada.
                  </p>
                ) : (
                  <div className="space-y-6">
                    {oppActivities.map((a) => (
                      <div key={a.id} className="flex gap-4">
                        <div className="w-24 text-sm text-muted-foreground shrink-0">
                          {formatDate(a.date)}
                        </div>
                        <div className="flex flex-col gap-1 pb-6 border-l pl-4 relative before:absolute before:left-[-5px] before:top-1 before:w-2 before:h-2 before:bg-primary before:rounded-full">
                          <span className="font-medium">{a.type}</span>
                          <span className="text-sm">{a.summary}</span>
                          {a.outcome && (
                            <Badge variant="outline" className="w-fit mt-1">
                              {a.outcome}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}

