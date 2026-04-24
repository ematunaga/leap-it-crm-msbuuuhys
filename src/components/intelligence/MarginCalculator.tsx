import { useState } from 'react'
import { Calculator, TrendingUp, DollarSign, Percent } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { Opportunity } from '@/types'

interface MarginCalculatorProps {
  opportunity: Opportunity
  onUpdate?: (fields: Partial<Opportunity>) => void
  readOnly?: boolean
}

export function MarginCalculator({ opportunity, onUpdate, readOnly = false }: MarginCalculatorProps) {
  const [fatorLeapit, setFatorLeapit] = useState(opportunity.fatorLeapit ?? 1.0)
  const [icms, setIcms] = useState(opportunity.icmsHardwarePercent ?? 12)
  const [ipi, setIpi] = useState(opportunity.ipiPercent ?? 0)

  const baseValue = opportunity.value ?? 0

  // Fiscal cost calculation:
  // Effective cost = baseValue / fatorLeapit
  // Total tax burden = (icms + ipi) / 100 * baseValue
  const costBase = fatorLeapit > 0 ? baseValue / fatorLeapit : baseValue
  const icmsCost = (icms / 100) * baseValue
  const ipiCost = (ipi / 100) * baseValue
  const totalCost = costBase + icmsCost + ipiCost
  const grossMargin = baseValue - totalCost
  const grossMarginPct = baseValue > 0 ? (grossMargin / baseValue) * 100 : 0

  const marginColor = grossMarginPct >= 30 ? 'text-green-400' : grossMarginPct >= 15 ? 'text-yellow-400' : 'text-red-400'
  const marginBadge = grossMarginPct >= 30 ? 'bg-green-500/10 text-green-400 border-green-500/20'
    : grossMarginPct >= 15 ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
    : 'bg-red-500/10 text-red-400 border-red-500/20'

  const handleChange = (field: keyof Opportunity, value: number, setter: (v: number) => void) => {
    setter(value)
    if (onUpdate) {
      onUpdate({ [field]: value })
    }
  }

  const fmt = (n: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n)

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Calculator className="h-4 w-4 text-blue-400" />
          Calculadora de Margem
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label className="text-xs">Fator Leap IT</Label>
            <Input
              type="number"
              step="0.01"
              min={0.1}
              value={fatorLeapit}
              onChange={e => handleChange('fatorLeapit', Number(e.target.value), setFatorLeapit)}
              disabled={readOnly}
              className="h-8 text-sm"
            />
            <p className="text-xs text-muted-foreground mt-0.5">Multiplicador interno</p>
          </div>
          <div>
            <Label className="text-xs">ICMS Hardware (%)</Label>
            <Input
              type="number"
              step="0.5"
              min={0}
              max={25}
              value={icms}
              onChange={e => handleChange('icmsHardwarePercent', Number(e.target.value), setIcms)}
              disabled={readOnly}
              className="h-8 text-sm"
            />
            <p className="text-xs text-muted-foreground mt-0.5">Incidencia sobre venda</p>
          </div>
          <div>
            <Label className="text-xs">IPI (%)</Label>
            <Input
              type="number"
              step="0.5"
              min={0}
              max={15}
              value={ipi}
              onChange={e => handleChange('ipiPercent', Number(e.target.value), setIpi)}
              disabled={readOnly}
              className="h-8 text-sm"
            />
            <p className="text-xs text-muted-foreground mt-0.5">Imposto sobre produto</p>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1"><DollarSign className="h-3 w-3" />Valor Bruto</span>
            <span className="text-white font-medium">{fmt(baseValue)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">(-) Custo Base (valor / fator)</span>
            <span className="text-red-400">- {fmt(costBase)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">(-) ICMS ({icms}%)</span>
            <span className="text-red-400">- {fmt(icmsCost)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">(-) IPI ({ipi}%)</span>
            <span className="text-red-400">- {fmt(ipiCost)}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span className="font-medium flex items-center gap-1"><TrendingUp className="h-4 w-4" />Margem Bruta</span>
            <div className="flex items-center gap-2">
              <span className={`font-bold text-lg ${marginColor}`}>{fmt(grossMargin)}</span>
              <Badge className={`${marginBadge} flex items-center gap-1`}>
                <Percent className="h-3 w-3" />{grossMarginPct.toFixed(1)}%
              </Badge>
            </div>
          </div>
        </div>

        {grossMarginPct < 15 && (
          <div className="rounded-md border border-red-500/20 bg-red-500/10 p-2 text-xs text-red-400">
            Atencao: margem abaixo de 15%. Revisar precificacao antes de enviar proposta.
          </div>
        )}
        {grossMarginPct >= 30 && (
          <div className="rounded-md border border-green-500/20 bg-green-500/10 p-2 text-xs text-green-400">
            Margem saudavel. Oportunidade dentro dos parametros ideais.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
