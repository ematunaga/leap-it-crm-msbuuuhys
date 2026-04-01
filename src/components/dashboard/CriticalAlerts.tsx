import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import useCrmStore from '@/stores/useCrmStore'
import { AlertTriangle, Clock, Briefcase } from 'lucide-react'
import { getDaysDiff, formatDate } from '@/lib/utils'
import { Link } from 'react-router-dom'

export function CriticalAlerts() {
  const { accounts, activities, opps } = useCrmStore()

  const inactiveAccounts = accounts.filter((a) => getDaysDiff(a.lastInteractionAt) > 30)
  const overdueActivities = activities.filter((a) => a.isOverdue)
  const overdueOpps = opps.filter(
    (o) => o.statusFollowUp === 'atrasado' || o.statusFollowUp === 'critico' || o.isOverdue,
  )

  return (
    <Card
      className="shadow-subtle col-span-1 md:col-span-2 lg:col-span-1 animate-fade-in-up"
      style={{ animationDelay: '600ms' }}
    >
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-rose-500" />
          Alertas Críticos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {overdueActivities.length === 0 &&
          inactiveAccounts.length === 0 &&
          overdueOpps.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhum alerta crítico no momento.
            </p>
          )}

        {overdueOpps.map((o) => (
          <div
            key={o.id}
            className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0"
          >
            <div>
              <Link
                to={`/oportunidades/${o.id}`}
                className="text-sm font-medium hover:underline flex items-center gap-1"
              >
                <Briefcase className="w-3 h-3" /> {o.title}
              </Link>
              <p className="text-xs text-muted-foreground mt-1">
                Ação esperada em {formatDate(o.nextStepDate)}
              </p>
            </div>
            <Badge variant="destructive" className="capitalize">
              {o.statusFollowUp === 'critico' ? 'Crítico' : 'Atrasado'}
            </Badge>
          </div>
        ))}

        {overdueActivities.map((a) => (
          <div
            key={a.id}
            className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0"
          >
            <div>
              <p className="text-sm font-medium">{a.summary}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Clock className="h-3 w-3" /> Venceu em {formatDate(a.date)}
              </p>
            </div>
            <Badge variant="destructive">Ativ. Atrasada</Badge>
          </div>
        ))}

        {inactiveAccounts.map((a) => (
          <div
            key={a.id}
            className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0"
          >
            <div>
              <Link to={`/contas/${a.id}`} className="text-sm font-medium hover:underline">
                {a.name}
              </Link>
              <p className="text-xs text-muted-foreground mt-1">
                Sem interação há {getDaysDiff(a.lastInteractionAt)} dias
              </p>
            </div>
            <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
              Conta em Risco
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
