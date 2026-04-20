import { useMemo } from 'react'
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Cell,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import useCrmStore from '@/stores/useCrmStore'
import { convertCurrency } from '@/lib/utils'
import { TrendingUp, TrendingDown, Target, Award } from 'lucide-react'

const MEMBER_COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#06b6d4']

export function TeamPerformance() {
  const { opps, activities, currencyView, ptaxRate } = useCrmStore()

  const memberStats = useMemo(() => {
    const statsMap: Record<
      string,
      {
        name: string
        won: number
        lost: number
        open: number
        totalRevenue: number
        activitiesDone: number
        winRate: number
      }
    > = {}

    opps.forEach((opp) => {
      const owner = opp.owner_name || opp.owner_id || 'Sem responsavel'
      if (!statsMap[owner]) {
        statsMap[owner] = {
          name: owner,
          won: 0,
          lost: 0,
          open: 0,
          totalRevenue: 0,
          activitiesDone: 0,
          winRate: 0,
        }
      }
      if (opp.stage === 'fechamento') {
        statsMap[owner].won++
        statsMap[owner].totalRevenue += convertCurrency(
          opp.value,
          opp.currency || 'BRL',
          currencyView,
          ptaxRate
        )
      } else if (opp.stage === 'perdido') {
        statsMap[owner].lost++
      } else {
        statsMap[owner].open++
      }
    })

    activities.forEach((act) => {
      const owner = act.owner_name || act.owner_id || 'Sem responsavel'
      if (statsMap[owner] && act.completed) {
        statsMap[owner].activitiesDone++
      }
    })

    return Object.values(statsMap)
      .map((m) => ({
        ...m,
        winRate: m.won + m.lost > 0 ? (m.won / (m.won + m.lost)) * 100 : 0,
      }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 6)
  }, [opps, activities, currencyView, ptaxRate])

  const radarData = useMemo(() => {
    if (memberStats.length === 0) return []
    const maxRevenue = Math.max(...memberStats.map((m) => m.totalRevenue)) || 1
    const maxActivities = Math.max(...memberStats.map((m) => m.activitiesDone)) || 1
    const maxWon = Math.max(...memberStats.map((m) => m.won)) || 1

    return memberStats.slice(0, 3).map((m) => ({
      name: m.name.split(' ')[0],
      Receita: Math.round((m.totalRevenue / maxRevenue) * 100),
      Atividades: Math.round((m.activitiesDone / maxActivities) * 100),
      'Negocios Ganhos': Math.round((m.won / maxWon) * 100),
      'Win Rate': Math.round(m.winRate),
    }))
  }, [memberStats])

  const formatCurrency = (value: number) => {
    const symbol = currencyView === 'USD' ? 'US$' : 'R$'
    if (value >= 1000000) return `${symbol} ${(value / 1000000).toFixed(1)}M`
    if (value >= 1000) return `${symbol} ${(value / 1000).toFixed(0)}k`
    return `${symbol} ${value.toFixed(0)}`
  }

  const topPerformer = memberStats[0]

  return (
    <Card className="shadow-subtle animate-fade-in-up" style={{ animationDelay: '500ms' }}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Performance da Equipe
            </CardTitle>
            <CardDescription className="mt-1">
              {memberStats.length} vendedores ativos
            </CardDescription>
          </div>
          {topPerformer && (
            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
              <Award className="h-3 w-3 mr-1" />
              Top: {topPerformer.name.split(' ')[0]}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="ranking" className="w-full">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="ranking" className="flex-1">Ranking</TabsTrigger>
            <TabsTrigger value="chart" className="flex-1">Grafico</TabsTrigger>
            <TabsTrigger value="radar" className="flex-1">Radar</TabsTrigger>
          </TabsList>

          <TabsContent value="ranking" className="space-y-3">
            {memberStats.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum dado de equipe disponivel
              </p>
            ) : (
              memberStats.map((member, idx) => (
                <div key={member.name} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground w-4">{idx + 1}</span>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback
                      className="text-xs text-white"
                      style={{ backgroundColor: MEMBER_COLORS[idx] }}
                    >
                      {member.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-sm font-medium truncate">{member.name}</p>
                      <span className="text-xs font-semibold ml-2">
                        {formatCurrency(member.totalRevenue)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={member.winRate}
                        className="flex-1 h-1.5"
                      />
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {member.winRate.toFixed(0)}% win
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {member.winRate >= 50 ? (
                      <TrendingUp className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                    )}
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="chart">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={memberStats} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10 }}
                  tickFormatter={(v) => v.split(' ')[0]}
                  angle={-30}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), 'Receita']}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="totalRevenue" radius={[4, 4, 0, 0]}>
                  {memberStats.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={MEMBER_COLORS[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="radar">
            {radarData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={[radarData[0]]}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  {radarData.map((member, idx) => (
                    <Radar
                      key={member.name}
                      name={member.name}
                      dataKey="value"
                      stroke={MEMBER_COLORS[idx]}
                      fill={MEMBER_COLORS[idx]}
                      fillOpacity={0.2}
                    />
                  ))}
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                Dados insuficientes para o radar
              </p>
            )}
          </TabsContent>
        </Tabs>

        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t">
          <div className="text-center">
            <Target className="h-4 w-4 mx-auto mb-1 text-blue-500" />
            <p className="text-lg font-bold">
              {memberStats.reduce((s, m) => s + m.open, 0)}
            </p>
            <p className="text-xs text-muted-foreground">Em aberto</p>
          </div>
          <div className="text-center">
            <TrendingUp className="h-4 w-4 mx-auto mb-1 text-green-500" />
            <p className="text-lg font-bold">
              {memberStats.reduce((s, m) => s + m.won, 0)}
            </p>
            <p className="text-xs text-muted-foreground">Ganhos</p>
          </div>
          <div className="text-center">
            <Award className="h-4 w-4 mx-auto mb-1 text-yellow-500" />
            <p className="text-lg font-bold">
              {memberStats.reduce((s, m) => s + m.activitiesDone, 0)}
            </p>
            <p className="text-xs text-muted-foreground">Atividades</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
