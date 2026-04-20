import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Brain, TrendingUp, Users, Target, Lightbulb, AlertTriangle, Star, ArrowRight } from 'lucide-react'
import useCrmStore from '@/stores/useCrmStore'
import { useMemo } from 'react'
import { useDashboardFilters } from '@/contexts/DashboardFilterContext'

interface LeadScore {
  id: string
  name: string
  company?: string
  score: number
  status: string
  source?: string
  trend: 'up' | 'down' | 'stable'
  insights: string[]
}

export function LeadIntelligence() {
  const { leads, opps } = useCrmStore()
  const { filteredData } = useDashboardFilters()

  const intelligence = useMemo(() => {
    const data = filteredData || { leads, opps }

    // Lead Scoring (simulação com base em status e origem)
    const scoredLeads: LeadScore[] = data.leads.map((lead) => {
      let score = 50 // base score
      const insights: string[] = []

      // Score por status
      if (lead.status === 'Convertido') {
        score += 40
        insights.push('Lead convertido com sucesso')
      } else if (lead.status === 'Qualificado') {
        score += 30
        insights.push('Lead qualificado e pronto para abordagem')
      } else if (lead.status === 'Novo') {
        score += 15
        insights.push('Lead novo requer qualificação')
      }

      // Score por origem
      if (lead.source === 'Indicação') {
        score += 20
        insights.push('Alta taxa de conversão por indicação')
      } else if (lead.source === 'Evento') {
        score += 15
        insights.push('Engajamento em evento demonstra interesse')
      } else if (lead.source === 'Website') {
        score += 10
        insights.push('Lead orgânico via website')
      }

      // Simula tendência
      const trend: 'up' | 'down' | 'stable' = score > 70 ? 'up' : score < 40 ? 'down' : 'stable'

      return {
        id: lead.id,
        name: lead.name,
        company: lead.company,
        score: Math.min(100, score),
        status: lead.status,
        source: lead.source,
        trend,
        insights
      }
    })

    // Top leads por score
    const topLeads = scoredLeads
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)

    // Análise por origem
    const sourceAnalysis = data.leads.reduce((acc: Record<string, number>, lead) => {
      const source = lead.source || 'Desconhecido'
      acc[source] = (acc[source] || 0) + 1
      return acc
    }, {})

    const topSource = Object.entries(sourceAnalysis)
      .sort(([, a], [, b]) => (b as number) - (a as number))[0]

    // Taxa de conversão
    const convertedLeads = data.leads.filter(l => l.status === 'Convertido').length
    const conversionRate = data.leads.length > 0 ? (convertedLeads / data.leads.length) * 100 : 0

    // Média de score
    const avgScore = scoredLeads.length > 0
      ? scoredLeads.reduce((sum, l) => sum + l.score, 0) / scoredLeads.length
      : 0

    // Recomendações baseadas em IA
    const recommendations: string[] = []
    if (conversionRate < 15) {
      recommendations.push('Taxa de conversão abaixo da média. Revise o processo de qualificação.')
    }
    if (avgScore < 50) {
      recommendations.push('Score médio baixo. Foque em leads de maior qualidade.')
    }
    if (topSource && topSource[1] > data.leads.length * 0.6) {
      recommendations.push(`${topSource[0]} é a principal origem. Considere investir mais neste canal.`)
    }
    if (topLeads.length > 0 && topLeads[0].score > 85) {
      recommendations.push(`Lead ${topLeads[0].name} tem score muito alto. Priorize contato imediato.`)
    }

    return {
      topLeads,
      sourceAnalysis,
      conversionRate,
      avgScore,
      recommendations,
      totalLeads: data.leads.length,
      convertedLeads
    }
  }, [filteredData, leads, opps])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50'
    if (score >= 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />
    if (trend === 'down') return <AlertTriangle className="h-4 w-4 text-red-600" />
    return <ArrowRight className="h-4 w-4 text-gray-600" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-purple-50">
            <Brain className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Lead Intelligence</h2>
            <p className="text-sm text-muted-foreground">
              Insights e recomendações baseadas em IA para seus leads
            </p>
          </div>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Total de Leads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{intelligence.totalLeads}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {intelligence.convertedLeads} convertidos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Taxa de Conversão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{intelligence.conversionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {intelligence.conversionRate >= 20 ? 'Acima da média' : 'Abaixo da média'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Star className="h-4 w-4" />
              Score Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{intelligence.avgScore.toFixed(0)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              de 100 pontos possíveis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Melhor Origem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(intelligence.sourceAnalysis)[0] || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Object.values(intelligence.sourceAnalysis)[0] || 0} leads
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Leads */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-600" />
              Top 5 Leads por Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {intelligence.topLeads.map((lead, idx) => (
                <div key={lead.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-medium">{lead.name}</div>
                      {lead.company && (
                        <div className="text-xs text-muted-foreground">{lead.company}</div>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{lead.status}</Badge>
                        {lead.source && <Badge variant="secondary" className="text-xs">{lead.source}</Badge>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(lead.trend)}
                    <div className={`text-lg font-bold px-3 py-1 rounded-full ${getScoreColor(lead.score)}`}>
                      {lead.score}
                    </div>
                  </div>
                </div>
              ))}
              {intelligence.topLeads.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  Nenhum lead disponível
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recomendações IA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-blue-600" />
              Recomendações IA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {intelligence.recommendations.map((rec, idx) => (
                <div key={idx} className="flex gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                  <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-blue-900">{rec}</p>
                </div>
              ))}
              {intelligence.recommendations.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  Nenhuma recomendação no momento. Continue o bom trabalho!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
