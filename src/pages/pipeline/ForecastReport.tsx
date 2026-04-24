import { useMemo } from 'react'
import { TrendingUp, User, DollarSign, Target, BarChart3 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import useCrmStore from '@/stores/useCrmStore'
import { formatMoney } from '@/lib/utils'

const CLOSED_STAGES = ['fechado_ganho', 'fechado_perdido', 'negociacao', 'proposta_enviada', 'qualificacao', 'prospeccao']
const WIN_STAGE = 'fechado_ganho'
const LOSS_STAGE = 'fechado_perdido'

const STAGE_PROBABILITY: Record<string, number> = {
  prospeccao: 10,
  qualificacao: 25,
  proposta_enviada: 50,
  negociacao: 75,
  fechado_ganho: 100,
  fechado_perdido: 0,
}

export default function ForecastReport() {
  const { opps, appUsers } = useCrmStore()

  const forecastBySeller = useMemo(() => {
    const sellerMap: Record<string, {
      name: string
      total: number
      weighted: number
      won: number
      lost: number
      openCount: number
      opportunities: typeof opps
    }> = {}

    ;(opps ?? []).forEach(opp => {
      const ownerId = opp.ownerId ?? 'unassigned'
      const ownerName = opp.ownerName ??
        (appUsers ?? []).find(u => u.id === ownerId)?.name ??
        'Nao atribuido'

      if (!sellerMap[ownerId]) {
        sellerMap[ownerId] = { name: ownerName, total: 0, weighted: 0, won: 0, lost: 0, openCount: 0, opportunities: [] }
      }

      const value = opp.value ?? 0
      const winProb = opp.winProbability ??
        STAGE_PROBABILITY[opp.stage ?? 'prospeccao'] ?? 10
      const weighted = value * (winProb / 100)

      sellerMap[ownerId].total += value
      sellerMap[ownerId].weighted += weighted
      sellerMap[ownerId].opportunities.push(opp)

      if (opp.stage === WIN_STAGE) sellerMap[ownerId].won += value
      else if (opp.stage === LOSS_STAGE) sellerMap[ownerId].lost += value
      else sellerMap[ownerId].openCount++
    })

    return Object.values(sellerMap).sort((a, b) => b.weighted - a.weighted)
  }, [opps, appUsers])

  const grandTotalPipeline = forecastBySeller.reduce((s, r) => s + r.total, 0)
  const grandTotalForecast = forecastBySeller.reduce((s, r) => s + r.weighted, 0)
  const grandTotalWon = forecastBySeller.reduce((s, r) => s + r.won, 0)

  const stageBreakdown = useMemo(() => {
    const breakdown: Record<string, { count: number; value: number }> = {}
    ;(opps ?? []).forEach(opp => {
      const stage = opp.stage ?? 'prospeccao'
      if (!breakdown[stage]) breakdown[stage] = { count: 0, value: 0 }
      breakdown[stage].count++
      breakdown[stage].value += opp.value ?? 0
    })
    return Object.entries(breakdown).sort((a, b) =>
      (STAGE_PROBABILITY[b[0]] ?? 0) - (STAGE_PROBABILITY[a[0]] ?? 0)
    )
  }, [opps])

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Forecast Comercial</h1>
        <p className="text-muted-foreground">Pipeline ponderado por win_probability por vendedor</p>
      </div>

      {/* Grand total KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-border bg-card"><CardContent className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1"><DollarSign className="h-4 w-4 text-blue-400" />Pipeline Total</div>
          <div className="text-2xl font-bold text-white">{formatMoney(grandTotalPipeline)}</div>
          <div className="text-xs text-muted-foreground">{(opps ?? []).length} oportunidades</div>
        </CardContent></Card>
        <Card className="border-border bg-card"><CardContent className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1"><TrendingUp className="h-4 w-4 text-green-400" />Forecast Ponderado</div>
          <div className="text-2xl font-bold text-white">{formatMoney(grandTotalForecast)}</div>
          <div className="text-xs text-muted-foreground">valor x probabilidade</div>
        </CardContent></Card>
        <Card className="border-border bg-card"><CardContent className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1"><Target className="h-4 w-4 text-purple-400" />Receita Fechada</div>
          <div className="text-2xl font-bold text-white">{formatMoney(grandTotalWon)}</div>
          <div className="text-xs text-muted-foreground">oportunidades ganhas</div>
        </CardContent></Card>
      </div>

      {/* Stage Breakdown */}
      <Card className="border-border bg-card">
        <CardHeader><CardTitle className="flex items-center gap-2 text-sm"><BarChart3 className="h-4 w-4" />Pipeline por Estagio</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stageBreakdown.map(([stage, data]) => {
              const prob = STAGE_PROBABILITY[stage] ?? 0
              const pct = grandTotalPipeline > 0 ? (data.value / grandTotalPipeline) * 100 : 0
              return (
                <div key={stage} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-white capitalize">{stage.replace(/_/g, ' ')} ({data.count})</span>
                    <div className="flex items-center gap-2">
                      <Badge className="text-xs bg-muted/30 text-muted-foreground">{prob}% prob</Badge>
                      <span className="text-white">{formatMoney(data.value)}</span>
                    </div>
                  </div>
                  <Progress value={pct} className="h-1.5" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Per-Seller Table */}
      <Card className="border-border bg-card">
        <CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5" />Forecast por Vendedor</CardTitle></CardHeader>
        <CardContent>
          {forecastBySeller.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p>Nenhuma oportunidade no pipeline.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {forecastBySeller.map((seller, idx) => {
                const shareOfForecast = grandTotalForecast > 0 ? (seller.weighted / grandTotalForecast) * 100 : 0
                return (
                  <div key={idx} className="p-4 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/10">
                          <User className="h-4 w-4 text-blue-400" />
                        </div>
                        <span className="font-medium text-white">{seller.name}</span>
                      </div>
                      <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                        {seller.openCount} abertas
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm mb-2">
                      <div>
                        <div className="text-muted-foreground">Pipeline Total</div>
                        <div className="font-medium text-white">{formatMoney(seller.total)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Forecast Ponderado</div>
                        <div className="font-medium text-green-400">{formatMoney(seller.weighted)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Ganho</div>
                        <div className="font-medium text-blue-400">{formatMoney(seller.won)}</div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Share do Forecast Total</span>
                        <span>{shareOfForecast.toFixed(1)}%</span>
                      </div>
                      <Progress value={shareOfForecast} className="h-1.5" />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
