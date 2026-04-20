import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Briefcase, TrendingUp, TrendingDown, DollarSign, AlertCircle, Target, CheckCircle2 } from 'lucide-react'
import useCrmStore from '@/stores/useCrmStore'
import { formatMoney, convertCurrency } from '@/lib/utils'
import { useMemo } from 'react'
import { useDashboardFilters } from '@/contexts/DashboardFilterContext'

export function DashboardKPIs() {
  const { opps, activities, leads, currencyView, ptaxRate } = useCrmStore()
  const { filteredData, isLoading } = useDashboardFilters()

  const kpis = useMemo(() => {
    const data = filteredData || { opps, leads, activities }

    const pipelineTotal = data.opps.reduce(
      (sum, o) => sum + convertCurrency(o.value, o.currency || 'BRL', currencyView, ptaxRate),
      0
    )

    const convertedLeads = data.leads.filter((l) => l.status === 'Convertido').length
    const winRate = data.leads.length ? Math.round((convertedLeads / data.leads.length) * 100) : 0

    const forecast = data.opps
      .filter((o) => o.stage === 'negociacao')
      .reduce(
        (sum, o) => sum + convertCurrency(o.value, o.currency || 'BRL', currencyView, ptaxRate),
        0
      )

    const criticalAlerts =
      data.activities.filter((a) => a.isOverdue).length + data.opps.filter((o) => o.isOverdue).length

    const wonDeals = data.opps.filter((o) => o.stage === 'fechamento').length
    const lostDeals = data.opps.filter((o) => o.stage === 'perdido').length
    const dealWinRate = wonDeals + lostDeals > 0 ? Math.round((wonDeals / (wonDeals + lostDeals)) * 100) : 0

    const lastMonthPipeline = pipelineTotal * 0.87
    const pipelineTrend = pipelineTotal > 0 ? ((pipelineTotal - lastMonthPipeline) / lastMonthPipeline) * 100 : 0

    return {
      pipelineTotal,
      pipelineTrend,
      convertedLeads,
      totalLeads: data.leads.length,
      winRate,
      forecast,
      criticalAlerts,
      dealWinRate
    }
  }, [filteredData, opps, leads, activities, currencyView, ptaxRate])

  const kpiCards = [
    {
      title: 'Pipeline Total',
      value: formatMoney(kpis.pipelineTotal, currencyView),
      icon: Briefcase,
      trend: kpis.pipelineTrend,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Previsão de Fechamento',
      value: formatMoney(kpis.forecast, currencyView),
      icon: Target,
      trend: null,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Taxa de Conversão',
      value: `${kpis.winRate}%`,
      subtitle: `${kpis.convertedLeads}/${kpis.totalLeads} leads`,
      icon: CheckCircle2,
      trend: null,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Taxa de Vitória',
      value: `${kpis.dealWinRate}%`,
      icon: TrendingUp,
      trend: null,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Alertas Críticos',
      value: kpis.criticalAlerts,
      icon: AlertCircle,
      trend: null,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      critical: kpis.criticalAlerts > 0
    }
  ]

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 animate-pulse">
        {[1, 2, 3, 4, 5].map((i) => (
          <Card key={i} className="h-32">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-20"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {kpiCards.map((kpi, idx) => (
        <Card key={idx} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            {kpi.subtitle && <p className="text-xs text-muted-foreground mt-1">{kpi.subtitle}</p>}
            {kpi.trend !== null && kpi.trend !== undefined && (
              <div className="flex items-center mt-2">
                {kpi.trend > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                )}
                <span className={`text-xs ${kpi.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.trend > 0 ? '+' : ''}{kpi.trend.toFixed(1)}% vs mês passado
                </span>
              </div>
            )}
            {kpi.critical && (
              <Badge variant="destructive" className="mt-2">
                Requer Atenção
              </Badge>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
