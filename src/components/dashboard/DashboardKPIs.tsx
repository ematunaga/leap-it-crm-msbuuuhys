import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Briefcase, TrendingUp, TrendingDown, DollarSign, AlertCircle, Target, CheckCircle2 } from 'lucide-react'
import useCrmStore from '@/stores/useCrmStore'
import { formatMoney, convertCurrency } from '@/lib/utils'
import { useMemo } from 'react'

export function DashboardKPIs() {
  const { opps, activities, leads, currencyView, ptaxRate } = useCrmStore()

  const pipelineTotal = opps.reduce(
    (sum, o) => sum + convertCurrency(o.value, o.currency || 'BRL', currencyView, ptaxRate),
    0
  )

  const convertedLeads = leads.filter((l) => l.status === 'Convertido').length
  const winRate = leads.length ? Math.round((convertedLeads / leads.length) * 100) : 0
  
  const forecast = opps
    .filter((o) => o.stage === 'negociacao')
    .reduce(
      (sum, o) => sum + convertCurrency(o.value, o.currency || 'BRL', currencyView, ptaxRate),
      0
    )

  const criticalAlerts =
    activities.filter((a) => a.isOverdue).length + opps.filter((o) => o.isOverdue).length

  const wonDeals = opps.filter((o) => o.stage === 'fechamento').length
  const lostDeals = opps.filter((o) => o.stage === 'perdido').length
  const dealWinRate = wonDeals + lostDeals > 0 ? Math.round((wonDeals / (wonDeals + lostDeals)) * 100) : 0

  // Simulacao de dados historicos para trend (em produção virá do DB)
  const lastMonthPipeline = pipelineTotal * 0.87
  const pipelineTrend = pipelineTotal > 0 ? ((pipelineTotal - lastMonthPipeline) / lastMonthPipeline) * 100 : 0
  
  const lastMonthWinRate = winRate - 3
  const winRateTrend = winRate - lastMonthWinRate

  const lastMonthForecast = forecast * 0.92
  const forecastTrend = forecast > 0 ? ((forecast - lastMonthForecast) / lastMonthForecast) * 100 : 0

  const kpis = [
    {
      title: 'Pipeline Total',
      value: formatMoney(pipelineTotal, currencyView),
      subtitle: 'Todas as oportunidades',
      icon: Briefcase,
      trend: pipelineTrend,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Taxa de Conversao',
      value: `${winRate}%`,
      subtitle: `${convertedLeads} de ${leads.length} leads`,
      icon: Target,
      trend: winRateTrend,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Forecast',
      value: formatMoney(forecast, currencyView),
      subtitle: 'Oportunidades em negociação',
      icon: DollarSign,
      trend: forecastTrend,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Alertas Criticos',
      value: criticalAlerts,
      subtitle: 'Atividades e opport. atrasadas',
      icon: AlertCircle,
      trend: -5,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
    {
      title: 'Win Rate (Negocios)',
      value: `${dealWinRate}%`,
      subtitle: `${wonDeals} ganhos / ${lostDeals} perdidos`,
      icon: CheckCircle2,
      trend: 2,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
      {kpis.map((kpi, idx) => (
        <Card
          key={kpi.title}
          className="shadow-subtle animate-fade-in-up hover:shadow-md transition-shadow"
          style={{ animationDelay: `${idx * 100}ms` }}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">{kpi.value}</div>
              {kpi.trend !== undefined && (
                <Badge
                  variant={kpi.trend >= 0 ? 'default' : 'destructive'}
                  className="ml-2 text-xs flex items-center gap-1"
                >
                  {kpi.trend >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {Math.abs(kpi.trend).toFixed(1)}%
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{kpi.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
