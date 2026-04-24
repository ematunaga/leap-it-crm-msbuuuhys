import { useMemo } from 'react'
import { AlertTriangle, Clock, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import useCrmStore from '@/stores/useCrmStore'

interface InactivityAlertsProps {
  thresholdDays?: number
  maxItems?: number
}

export function InactivityAlerts({ thresholdDays = 30, maxItems = 10 }: InactivityAlertsProps) {
  const { accounts, activities } = useCrmStore()

  const alertedAccounts = useMemo(() => {
    const now = Date.now()
    const thresholdMs = thresholdDays * 24 * 60 * 60 * 1000

    return (accounts ?? [])
      .map(account => {
        const accountActivities = (activities ?? []).filter(
          a => a.relatedId === account.id || a.accountId === account.id
        )
        const lastActivity = accountActivities
          .map(a => new Date(a.createdAt || a.date || 0).getTime())
          .sort((a, b) => b - a)[0]

        const lastInteraction = account.lastInteractionAt
          ? new Date(account.lastInteractionAt).getTime()
          : lastActivity ?? 0

        const daysSince = lastInteraction
          ? Math.floor((now - lastInteraction) / (24 * 60 * 60 * 1000))
          : 999

        return { account, daysSince, lastInteraction }
      })
      .filter(({ daysSince }) => daysSince >= thresholdDays)
      .sort((a, b) => b.daysSince - a.daysSince)
      .slice(0, maxItems)
  }, [accounts, activities, thresholdDays, maxItems])

  const getSeverity = (days: number) => {
    if (days >= 90) return { label: 'Critico', color: 'bg-red-500/10 text-red-400 border-red-500/20' }
    if (days >= 60) return { label: 'Alto', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' }
    return { label: 'Medio', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-400" />
          Alertas de Inatividade
          {alertedAccounts.length > 0 && (
            <Badge className="bg-red-500/10 text-red-400 border-red-500/20 ml-auto">
              {alertedAccounts.length} accounts
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alertedAccounts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Todas as accounts foram contatadas nos ultimos {thresholdDays} dias.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {alertedAccounts.map(({ account, daysSince }) => {
              const severity = getSeverity(daysSince)
              return (
                <div key={account.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted">
                      <AlertTriangle className="h-4 w-4 text-yellow-400" />
                    </div>
                    <div>
                      <div className="font-medium text-white text-sm">{account.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Tier: {account.accountTier ?? 'N/A'} • Segmento: {account.segment ?? 'N/A'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-medium text-white">{daysSince}d sem contato</div>
                      <Badge className={`text-xs ${severity.color}`}>{severity.label}</Badge>
                    </div>
                    <Button asChild size="sm" variant="outline" className="h-7 px-2">
                      <Link to={`/accounts/${account.id}`}>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
