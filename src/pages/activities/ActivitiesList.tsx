import { GenericDataTable } from '../shared/GenericDataTable'
import useCrmStore from '@/stores/useCrmStore'
import { Activity } from '@/types'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

export default function ActivitiesList() {
  const { activities, opps, accounts } = useCrmStore()

  const columns = [
    {
      key: 'summary',
      label: 'Resumo da Atividade',
      render: (val: string, a: Activity) => (
        <div>
          <p className="font-medium">{val}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{a.type}</p>
        </div>
      ),
    },
    {
      key: 'relatedTo',
      label: 'Relacionado',
      render: (_: any, a: Activity) => {
        let name = '-'
        if (a.relatedTo === 'Opportunity')
          name = opps.find((o) => o.id === a.relatedId)?.title || ''
        if (a.relatedTo === 'Account')
          name = accounts.find((ac) => (acc) => acc.id === a.relatedId)?.name || ''
        return (
          <span className="text-sm truncate max-w-[200px] inline-block">
            {a.relatedTo}: {name}
          </span>
        )
      },
    },
    {
      key: 'date',
      label: 'Data',
      render: (val: string) => formatDate(val),
    },
    {
      key: 'status',
      label: 'Status',
      render: (val: string, a: Activity) => (
        <Badge
          variant={val === 'Concluída' ? 'default' : 'secondary'}
          className={a.isOverdue ? 'bg-rose-500 hover:bg-rose-600 text-white' : ''}
        >
          {a.isOverdue ? 'Atrasado' : val}
        </Badge>
      ),
    },
  ]

  return (
    <GenericDataTable
      title="Central de Atividades"
      subtitle="Histórico de interações e follow-ups pendentes."
      data={activities}
      columns={columns}
      searchKey="summary"
    />
  )
}
