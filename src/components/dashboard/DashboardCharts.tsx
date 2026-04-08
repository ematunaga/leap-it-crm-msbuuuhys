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
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import useCrmStore from '@/stores/useCrmStore'
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart'
import { convertCurrency } from '@/lib/utils'

const COLORS = ['#2563eb', '#f59e0b', '#e11d48']

export function DashboardCharts() {
  const { opps, currencyView, ptaxRate } = useCrmStore()

  const pipelineData = useMemo(() => {
    const stages = ['prospeccao', 'qualificacao', 'proposta', 'negociacao']
    return stages.map((stage) => ({
      name: stage,
      valor: opps
        .filter((o) => o.stage === stage)
        .reduce(
          (sum, o) => sum + convertCurrency(o.value, o.currency || 'BRL', currencyView, ptaxRate),
          0,
        ),
    }))
  }, [opps, currencyView, ptaxRate])

  const temperatureData = useMemo(() => {
    const counts = { Fria: 0, Morna: 0, Quente: 0 }
    opps.forEach((o) => {
      if (counts[o.temperature as keyof typeof counts] !== undefined) {
        counts[o.temperature as keyof typeof counts]++
      }
    })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [opps])

  return (
    <div className="grid gap-6 md:grid-cols-2 mb-6">
      <Card className="shadow-subtle animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        <CardHeader>
          <CardTitle className="text-lg">Pipeline por Estágio</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{ valor: { label: 'Valor', color: 'hsl(var(--primary))' } }}
            className="h-[300px]"
          >
            <BarChart data={pipelineData}>
              <XAxis
                dataKey="name"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => {
                  const labels: Record<string, string> = {
                   prospeccao: 'Prospecção',
                    qualificacao: 'Qualificação',
                    proposta: 'Proposta',
                    negociacao: 'Negociação',
                  }
                  return labels[val] ?? val
                }}
              />
              <YAxis
                fontSize={12}
                tickFormatter={(val) => `${currencyView === 'USD' ? 'US$' : 'R$'}${val / 1000}k`}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<ChartTooltipContent />} cursor={{ fill: 'transparent' }} />
              <Bar dataKey="valor" fill="var(--color-valor)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="shadow-subtle animate-fade-in-up" style={{ animationDelay: '500ms' }}>
        <CardHeader>
          <CardTitle className="text-lg">Oportunidades por Temperatura</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ value: { label: 'Opps' } }} className="h-[300px]">
            <PieChart>
              <Pie
                data={temperatureData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
              >
                {temperatureData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
