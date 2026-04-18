import { GenericDataTable } from '../shared/GenericDataTable'
import useCrmStore from '@/stores/useCrmStore'
import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { useRBAC } from '@/hooks/use-rbac'
import { AccessDenied } from '@/components/AccessDenied'

export default function BranchesReport() {
  const { accounts } = useCrmStore()
  const { can } = useRBAC()

  if (!can('accounts', 'visualizar')) return <AccessDenied />

  const branches = accounts.flatMap((acc) =>
    (acc.branches || []).map((b, index) => ({
      id: `${acc.id}-${index}`,
      accountId: acc.id,
      accountName: acc.name,
      accountStatus: acc.status,
      ...b,
    })),
  )

  const columns = [
    {
      key: 'name',
      label: 'Razão Social / Fantasia',
      render: (_: any, b: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-sm">{b.name || '-'}</span>
          <span className="text-xs text-muted-foreground">{b.tradingName || '-'}</span>
        </div>
      ),
    },
    {
      key: 'cnpj',
      label: 'CNPJ / IE',
      render: (_: any, b: any) => (
        <div className="flex flex-col">
          <span className="font-mono text-sm">{b.cnpj || '-'}</span>
          <span className="font-mono text-xs text-muted-foreground">IE: {b.ie || '-'}</span>
        </div>
      ),
    },
    {
      key: 'accountName',
      label: 'Conta Matriz',
      render: (_: any, b: any) => (
        <div className="flex flex-col items-start gap-1">
          <Link to={`/contas/${b.accountId}`} className="font-medium hover:underline text-primary">
            {b.accountName}
          </Link>
          <Badge variant="outline" className="text-[10px] capitalize py-0">
            {b.accountStatus}
          </Badge>
        </div>
      ),
    },
    {
      key: 'address',
      label: 'Endereço',
      render: (_: any, b: any) => (
        <div className="flex flex-col text-sm max-w-xs">
          <span className="truncate" title={b.address}>
            {b.address || '-'}
          </span>
          <span className="text-xs text-muted-foreground truncate">
            {b.neighborhood ? `${b.neighborhood}, ` : ''}
            {b.city} {b.state ? `- ${b.state}` : ''}
          </span>
        </div>
      ),
    },
  ]

  return (
    <GenericDataTable
      title="Relatório de Filiais"
      subtitle="Auditoria e conferência de dados fiscais de todas as filiais cadastradas."
      data={branches}
      columns={columns}
      searchKey="name"
    />
  )
}
