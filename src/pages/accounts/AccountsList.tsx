import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { GenericDataTable } from '../shared/GenericDataTable'
import { AccountForm } from '@/components/accounts/AccountForm'
import useCrmStore from '@/stores/useCrmStore'
import { Account } from '@/types'
import { formatDate } from '@/lib/utils'
import { Plus } from 'lucide-react'
import { useState } from 'react'

export default function AccountsList() {
  const { accounts } = useCrmStore()
  const [open, setOpen] = useState(false)

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

  const actions = (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Nova Conta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Cadastro Rápido de Conta</DialogTitle>
        </DialogHeader>
        <div className="pt-4">
          <AccountForm onSuccess={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  )

  return (
    <GenericDataTable
      title="Contas"
      subtitle="Gerenciamento de contas e portfólio de clientes."
      data={accounts}
      columns={columns}
      searchKey="name"
      actions={actions}
    />
  )
}
