import { useMemo } from 'react'
import {
  FunnelChart,
  Funnel,
  LabelList,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import useCrmStore from '@/stores/useCrmStore'
import { convertCurrency } from '@/lib/utils'

const FUNNEL_COLORS = ['#6366f1', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe']

const STAGE_LABELS: Record<string, string> = {
  prospeccao: 'Prospecção',
  qualificacao: 'Qualificação',
  proposta: 'Proposta',
  negociacao: 'Negociação',
  fechamento: 'Fechamento',
}

export function SalesFunnelChart() {
  const { opps, currencyView, ptaxRate } = useCrmStore()

  const stages = ['prospeccao', 'qualificacao', 'proposta', 'negociacao', 'fechamento']

  const funnelData = useMemo(() => {
    return stages.map((stage, idx) => {
      const stageOpps = opps.filter((o) => o.stage === stage)
      const totalValue = stageOpps.reduce(
        (sum, o) => sum + convertCurrency(o.value, o.currency || 'BRL', currencyView, ptaxRate),
        0
      )
      return {
        name: STAGE_LABELS[stage] || stage,
        value: stageOpps.length,
        totalValue,
        fill: FUNNEL_COLORS[idx],
      }
    })
  }, [opps, currencyView, ptaxRate])

  const totalOpps = funnelData.reduce((sum, d) => sum + d.value, 0)
  const conversionRate =
    totalOpps > 0
      ? ((funnelData[funnelData.length - 1]?.value || 0) / (funnelData[0]?.value || 1)) * 100
      : 0

  const formatCurrency = (value: number) => {
    const symbol = currencyView === 'USD' ? 'US$' : 'R$'
    return `${symbol} ${value.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  }

  return (
    <Card className="shadow-subtle animate-fade-in-up" style={{ animationDelay: '300ms' }}>
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <CardTitle className="text-lg">Funil de Vendas</CardTitle>
          <CardDescription className="mt-1">
            {totalOpps} oportunidades ativas
          </CardDescription>
        </div>
        <Badge variant="secondary" className="text-xs">
          Conv. {conversionRate.toFixed(1)}%
        </Badge>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <FunnelChart>
            <Tooltip
              formatter={(value: number, name: string, props: { payload?: { totalValue?: number } }) => [
                `${value} oportunidades | ${formatCurrency(props?.payload?.totalValue ?? 0)}`,
                name,
              ]}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Funnel dataKey="value" data={funnelData} isAnimationActive>
              {funnelData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <LabelList
                position="right"
                content={(props) => {
                  const { x, y, width, height, value, index } = props as {
                    x: number; y: number; width: number; height: number; value: number; index: number
                  }
                  const item = funnelData[index]
                  if (!item) return null
                  return (
                    <g>
                      <text
                        x={x + width + 12}
                        y={y + height / 2 - 6}
                        fill="hsl(var(--foreground))"
                        fontSize={11}
                        fontWeight={600}
                      >
                        {item.name}
                      </text>
                      <text
                        x={x + width + 12}
                        y={y + height / 2 + 10}
                        fill="hsl(var(--muted-foreground))"
                        fontSize={10}
                      >
                        {value} oport. | {formatCurrency(item.totalValue)}
                      </text>
                    </g>
                  )
                }}
              />
            </Funnel>
          </FunnelChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-5 gap-1 mt-3">
          {funnelData.map((item, idx) => (
            <div key={idx} className="text-center">
              <div
                className="h-1.5 rounded-full mb-1"
                style={{ backgroundColor: item.fill }}
              />
              <p className="text-xs text-muted-foreground truncate">{item.name}</p>
              <p className="text-sm font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
