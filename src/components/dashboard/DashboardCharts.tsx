import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  CartesianGrid,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import useCrmStore from '@/stores/useCrmStore'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { convertCurrency } from '@/lib/utils'
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const COLORS = ['#2563eb', '#f59e0b', '#e11d48']

export function DashboardCharts() {
  const { opps, currencyView, ptaxRate } = useCrmStore()

  const pipelineData = useMemo(() => {
    const stages = ['prospeccao', 'qualificacao', 'proposta', 'negociacao']
    return stages.map((stage) => ({
      name: stage,
      value: opps
        .filter((o) => o.stage === stage)
        .reduce(
          (sum, o) => sum + convertCurrency(o.value, o.currency || 'BRL', currencyView, ptaxRate),
          0
        ),
    }))
  }, [opps, currencyView, ptaxRate])

  const temperatureData = useMemo(() => {
    const counts = { fria: 0, morna: 0, quente: 0 }
    opps.forEach((o) => {
      if (counts[o.temperature as keyof typeof counts] !== undefined) {
        counts[o.temperature as keyof typeof counts]++
      }
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [opps])

  // Grafico de Tendencia Historica (ultimos 6 meses)
  const monthlyRevenueData = useMemo(() => {
    const months = []
    for (let i = 5; i >= 0; i--) {
      months.push(startOfMonth(subMonths(new Date(), i)))
    }

    return months.map((monthStart) => {
      const monthEnd = endOfMonth(monthStart)
      const monthOpps = opps.filter((opp) => {
        if (!opp.expected_close_date) return false
        const closeDate = new Date(opp.expected_close_date)
        return closeDate >= monthStart && closeDate <= monthEnd
      })

      const totalRevenue = monthOpps.reduce(
        (sum, o) => sum + convertCurrency(o.value, o.currency || 'BRL', currencyView, ptaxRate),
        0
      )

      return {
        month: format(monthStart, 'MMM', { locale: ptBR }),
        receita: totalRevenue,
        count: monthOpps.length,
      }
    })
  }, [opps, currencyView, ptaxRate])

  const formatCurrency = (value: number) => {
    const symbol = currencyView === 'USD' ? 'US$' : 'R$'
    if (value >= 1000000) return `${symbol} ${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${symbol} ${(value / 1000).toFixed(0)}k`
    return `${symbol} ${value.toFixed(0)}`
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 mb-6">
      <Card className="shadow-subtle animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <CardHeader>
          <CardTitle className="text-lg">Pipeline por Estagio</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: { label: 'Valor', color: 'hsl(var(--primary))' },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pipelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  tickFormatter={(v) => v.slice(0, 6)}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  content={(props) => (
                    <ChartTooltipContent
                      {...props}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                  )}
                />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="shadow-subtle animate-fade-in-up" style={{ animationDelay: '600ms' }}>
        <CardHeader>
          <CardTitle className="text-lg">Receita por Mes</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              receita: { label: 'Receita', color: '#10b981' },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyRevenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  content={(props) => (
                    <ChartTooltipContent
                      {...props}
                      formatter={(value: number) => formatCurrency(value)}
                    />
                  )}
                />
                <Area
                  type="monotone"
                  dataKey="receita"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="shadow-subtle animate-fade-in-up" style={{ animationDelay: '800ms' }}>
        <CardHeader>
          <CardTitle className="text-lg">Temperatura</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: { label: 'Quantidade' },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={temperatureData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                >
                  {temperatureData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip content={(props) => <ChartTooltipContent {...props} />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="shadow-subtle animate-fade-in-up" style={{ animationDelay: '1000ms' }}>
        <CardHeader>
          <CardTitle className="text-lg">Oportunidades por Mes</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: { label: 'Quantidade', color: '#6366f1' },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={(props) => <ChartTooltipContent {...props} />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ fill: '#6366f1', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
