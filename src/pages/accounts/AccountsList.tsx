import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { GenericDataTable } from '../shared/GenericDataTable'
import useCrmStore from '@/stores/useCrmStore'
import { Account } from '@/types'
import { formatDate } from '@/lib/utils'

export default function AccountsList() {
  const { accounts } = useCrmStore()

  const columns = [
    {
      key: 'name',
      label: 'Conta',
      render: (_: any, acc: Account) => (
        <Link
          to={`/contas/${acc.id}`}
          className="flex items-center gap-3 hover:text-primary font-medium transition-colors"
        >
          <img
            src={acc.logo || 'https://img.usecurling.com/i?q=company&shape=fill&color=gray'}
            alt={acc.name}
            className="w-8 h-8 rounded-md bg-white border object-contain p-1"
          />
          {acc.name}
        </Link>
      ),
    },
    {
      key: 'segment',
      label: 'Segmento',
      render: (val: string) => <span className="capitalize">{val}</span>,
    },
    {
      key: 'accountTier',
      label: 'Tier',
      render: (val: string) => (
        <Badge variant="outline" className="font-mono capitalize">
          {val || '-'}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (val: string) => (
        <Badge
          variant={val === 'ativa' ? 'default' : 'secondary'}
          className={
            val === 'ativa' ? 'bg-emerald-500 hover:bg-emerald-600 capitalize' : 'capitalize'
          }
        >
          {val}
        </Badge>
      ),
    },
    {
      key: 'lastInteractionAt',
      label: 'Última Interação',
      render: (val: string) => <span className="text-muted-foreground">{formatDate(val)}</span>,
    },
  ]

  return (
    <GenericDataTable
      title="Contas"
      subtitle="Gerenciamento de contas e portfólio de clientes."
      data={accounts}
      columns={columns}
      searchKey="name"
    />
  )
}
