import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { GenericDataTable } from '../shared/GenericDataTable'
import { AccountForm } from '@/components/accounts/AccountForm'
import useCrmStore from '@/stores/useCrmStore'
import { Account } from '@/types'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

export default function AccountsList() {
  const { accounts, deleteAccount } = useCrmStore()
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const columns = [
    {
      key: 'name',
      label: 'Conta',
      render: (_: any, acc: Account) => (
        <div className="flex flex-col gap-1">
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
          {acc.cnpj && (
            <span className="text-[10px] text-muted-foreground ml-11 font-mono">{acc.cnpj}</span>
          )}
        </div>
      ),
    },
    {
      key: 'segment',
      label: 'Segmento / Porte',
      render: (_: any, acc: Account) => (
        <div className="flex flex-col gap-0.5">
          <span className="capitalize font-medium">{acc.segment || '-'}</span>
          <span className="text-[10px] text-muted-foreground">
            {acc.porte ? `Porte: ${acc.porte}` : 'Porte: N/A'}
          </span>
        </div>
      ),
    },
    {
      key: 'accountHealth',
      label: 'Saúde / Status',
      render: (_: any, acc: Account) => (
        <div className="flex flex-col gap-1 items-start">
          <div className="flex gap-1">
            <Badge
              variant={
                acc.accountHealth === 'saudavel'
                  ? 'default'
                  : acc.accountHealth === 'critico'
                    ? 'destructive'
                    : 'secondary'
              }
              className={
                acc.accountHealth === 'saudavel'
                  ? 'bg-emerald-500 hover:bg-emerald-600 capitalize text-[10px] py-0'
                  : 'capitalize text-[10px] py-0'
              }
            >
              {acc.accountHealth?.replace('_', ' ') || 'N/A'}
            </Badge>
            <Badge variant="outline" className="capitalize text-[10px] py-0">
              {acc.status || '-'}
            </Badge>
          </div>
          <span className="text-[10px] text-muted-foreground capitalize">
            Relac: {acc.relationshipStatus?.replace(/_/g, ' ') || '-'}
          </span>
        </div>
      ),
    },
    {
      key: 'accountTier',
      label: 'Tier / Potencial',
      render: (_: any, acc: Account) => {
        const pot = Number(acc.accountPotential)
        return (
          <div className="flex flex-col gap-1 items-start">
            <Badge variant="outline" className="font-mono capitalize text-[10px] py-0">
              {acc.accountTier || '-'}
            </Badge>
            {pot > 0 && (
              <span className="text-[11px] text-muted-foreground font-mono">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pot)}
              </span>
            )}
          </div>
        )
      },
    },
    {
      key: 'actions',
      label: '',
      render: (_: any, acc: Account) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (
                window.confirm(
                  'Tem certeza que deseja excluir esta conta? Todas as oportunidades associadas ficarão orfãs.',
                )
              ) {
                deleteAccount(acc.id)
                toast({ title: 'Conta excluída com sucesso.' })
              }
            }}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ]

  const actions = (
    <Button onClick={() => setOpen(true)}>
      <Plus className="mr-2 h-4 w-4" /> Nova Conta
    </Button>
  )

  return (
    <>
      <GenericDataTable
        title="Contas"
        subtitle="Gerenciamento de contas e portfólio de clientes."
        data={accounts}
        columns={columns}
        searchKey="name"
        actions={actions}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Cadastro Completo de Conta</DialogTitle>
          </DialogHeader>
          <div className="pt-2">
            <AccountForm onSuccess={() => setOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
