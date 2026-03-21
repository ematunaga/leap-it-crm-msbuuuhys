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

const COLORS = ['#2563eb', '#f59e0b', '#e11d48', '#10b981', '#8b5cf6', '#6366f1', '#14b8a6']

export default function OpportunitiesDashboard() {
  const { opps, accounts, deleteOpportunity, currencyView, setCurrencyView, ptaxRate, ptaxDate } =
    useCrmStore()
  const { toast } = useToast()
  const [year, setYear] = useState<string>('todos')
  const [quarter, setQuarter] = useState<string>('todos')
  const [openOpp, setOpenOpp] = useState(false)
  const [editOpp, setEditOpp] = useState<any>(null)

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
            <Button
              onClick={() => {
                setEditOpp(null)
                setOpenOpp(true)
              }}
            >
              <Plus className="w-4 h-4 mr-2" /> Nova Oportunidade
            </Button>
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
                  tickFormatter={(val) => `${currencyView === 'USD' ? 'US$' : 'R$'}${val / 1000}k`}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <Tooltip content={<ChartTooltipContent />} cursor={{ fill: 'transparent' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {byPartner.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-subtle">
          <CardHeader>
            <CardTitle className="text-lg">Projeção por Trimestre</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ value: { label: 'Valor' } }} className="h-[300px]">
              <BarChart data={byQuarterChart}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  fontSize={12}
                  tickFormatter={(val) => `${currencyView === 'USD' ? 'US$' : 'R$'}${val / 1000}k`}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<ChartTooltipContent />} cursor={{ fill: 'transparent' }} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-subtle">
        <CardHeader>
          <CardTitle className="text-lg">Lista de Oportunidades Mapeadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-md">Oportunidade</th>
                  <th className="px-4 py-3">Conta</th>
                  <th className="px-4 py-3">Fabricante</th>
                  <th className="px-4 py-3">Fase</th>
                  <th className="px-4 py-3 text-right">Fechamento</th>
                  <th className="px-4 py-3 text-right">Valor</th>
                  <th className="px-4 py-3 text-right rounded-tr-md"></th>
                </tr>
              </thead>
              <tbody>
                {filteredOpps.length > 0 ? (
                  filteredOpps.map((o) => {
                    const acc = accounts.find((a) => a.id === o.accountId)
                    const convertedVal = convertCurrency(
                      o.value,
                      o.currency || 'BRL',
                      currencyView,
                      ptaxRate,
                    )
                    return (
                      <tr
                        key={o.id}
                        className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium">
                          <Link
                            to={`/oportunidades/${o.id}`}
                            className="hover:underline hover:text-primary"
                          >
                            {o.title}
                          </Link>
                        </td>
                        <td className="px-4 py-3">{acc?.name || '-'}</td>
                        <td className="px-4 py-3 capitalize">{o.partner || '-'}</td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="capitalize">
                            {o.stage.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right text-muted-foreground">
                          {formatDate(o.expectedCloseDate || o.nextStepDate)}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-medium">
                          <div>{formatMoney(convertedVal, currencyView)}</div>
                          {o.currency && o.currency !== currencyView && (
                            <div className="text-[10px] text-muted-foreground">
                              ({formatMoney(o.value, o.currency)})
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                setEditOpp(o)
                                setOpenOpp(true)
                              }}
                            >
                              <Edit className="w-4 h-4 text-muted-foreground" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                if (window.confirm('Excluir oportunidade permanentemente?')) {
                                  deleteOpportunity(o.id)
                                  toast({ title: 'Oportunidade excluída.' })
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      Nenhuma oportunidade encontrada com os filtros atuais.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={openOpp} onOpenChange={setOpenOpp}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{editOpp ? 'Editar Oportunidade' : 'Nova Oportunidade'}</DialogTitle>
          </DialogHeader>
          <div className="pt-2">
            <OpportunityForm initialData={editOpp} onSuccess={() => setOpenOpp(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
