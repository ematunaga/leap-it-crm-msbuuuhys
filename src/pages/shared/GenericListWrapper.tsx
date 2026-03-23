import { useLocation } from 'react-router-dom'
import { GenericDataTable } from './GenericDataTable'
import useCrmStore from '@/stores/useCrmStore'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatMoney } from '@/lib/utils'
import { useRbac } from '@/hooks/use-rbac'
import { AccessDenied } from '@/components/AccessDenied'

export default function GenericListWrapper() {
  const location = useLocation()
  const path = location.pathname.substring(1) // e.g. "leads"
  const store = useCrmStore()
  const { can } = useRbac()

  if (!can(path, 'visualizar')) return <AccessDenied />

  let props: any = { title: 'Página', data: [], columns: [] }

  switch (path) {
    case 'leads':
      props = {
        title: 'Gestão de Leads',
        subtitle: 'Prospecção e qualificação inicial (MQL).',
        data: store.leads,
        columns: [
          {
            key: 'name',
            label: 'Nome',
            render: (val: string, item: any) => (
              <div className="font-medium">
                {val}
                <div className="text-xs text-muted-foreground">{item.company}</div>
              </div>
            ),
          },
          { key: 'source', label: 'Origem' },
          {
            key: 'status',
            label: 'Status',
            render: (v: string) => <Badge variant="outline">{v}</Badge>,
          },
          { key: 'createdAt', label: 'Entrada', render: (v: string) => formatDate(v) },
        ],
        searchKey: 'name',
      }
      break
    case 'concorrentes':
      props = {
        title: 'Inteligência Competitiva',
        data: store.competitors,
        columns: [
          {
            key: 'name',
            label: 'Concorrente',
            render: (v: string) => <span className="font-bold">{v}</span>,
          },
          { key: 'strength', label: 'Pontos Fortes' },
          { key: 'weakness', label: 'Fraquezas' },
          {
            key: 'winRate',
            label: 'Win Rate contra nós',
            render: (v: string) => <Badge variant="secondary">{v}</Badge>,
          },
        ],
      }
      break
    case 'contratos':
      props = {
        title: 'Contratos Ativos',
        data: store.contracts,
        columns: [
          {
            key: 'accountId',
            label: 'Conta',
            render: (id: string) => store.accounts.find((a) => a.id === id)?.name,
          },
          {
            key: 'mrr',
            label: 'MRR',
            render: (v: number) => <span className="font-mono">{formatMoney(v)}</span>,
          },
          { key: 'endDate', label: 'Vencimento', render: (v: string) => formatDate(v) },
          {
            key: 'status',
            label: 'Status',
            render: (v: string) => (
              <Badge variant={v === 'Ativo' ? 'default' : 'destructive'}>{v}</Badge>
            ),
          },
        ],
      }
      break
    default:
      props = {
        title: path.charAt(0).toUpperCase() + path.slice(1),
        subtitle: 'Módulo em construção ou sem dados mockados.',
        data: [],
        columns: [],
      }
  }

  return <GenericDataTable {...props} />
}
