import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Briefcase, TrendingUp, DollarSign, AlertCircle } from 'lucide-react'
import useCrmStore from '@/stores/useCrmStore'
import { formatMoney } from '@/lib/utils'

export function DashboardKPIs() {
  const { opps, activities, leads } = useCrmStore()

  const pipelineTotal = opps.reduce((sum, o) => sum + o.value, 0)
  const convertedLeads = leads.filter((l) => l.status === 'Convertido').length
  const winRate = leads.length ? Math.round((convertedLeads / leads.length) * 100) : 0
  const forecast = opps.filter((o) => o.stage === 'Negociação').reduce((sum, o) => sum + o.value, 0)
  const criticalAlerts =
    activities.filter((a) => a.isOverdue).length + opps.filter((o) => o.isOverdue).length

  const kpis = [
    {
      title: 'Pipeline Total',
      value: formatMoney(pipelineTotal),
      subtitle: 'Todas as oportunidades',
      icon: Briefcase,
      color: 'text-blue-500',
    },
    {
      title: 'Taxa de Conversão',
      value: `${winRate}%`,
      subtitle: 'Leads em Oportunidades',
      icon: TrendingUp,
      color: 'text-emerald-500',
    },
    {
      title: 'Forecast do Mês',
      value: formatMoney(forecast),
      subtitle: 'Estágio de Negociação',
      icon: DollarSign,
      color: 'text-amber-500',
    },
    {
      title: 'Alertas Críticos',
      value: criticalAlerts.toString(),
      subtitle: 'Atrasos e pendências',
      icon: AlertCircle,
      color: 'text-rose-500',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      {kpis.map((kpi, i) => (
        <Card
          key={i}
          className="shadow-subtle hover:shadow-elevation transition-shadow animate-fade-in-up"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{kpi.title}</CardTitle>
            <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{kpi.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
