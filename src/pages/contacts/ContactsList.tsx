import { Link } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { GenericDataTable } from '../shared/GenericDataTable'
import { ContactForm } from '@/components/contacts/ContactForm'
import useCrmStore from '@/stores/useCrmStore'
import { Contact } from '@/types'
import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'

export default function ContactsList() {
  const { contacts, accounts, deleteContact } = useCrmStore()
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const columns = [
    {
      key: 'name',
      label: 'Contato',
      render: (_: any, c: Contact) => (
        <Link
          to={`/contatos/${c.id}`}
          className="flex items-center gap-3 hover:bg-muted/50 p-1 rounded-md transition-colors"
        >
          <img
            src={c.avatarUrl || 'https://img.usecurling.com/ppl/thumbnail'}
            alt={c.name}
            className="w-10 h-10 rounded-full bg-muted border object-cover"
          />
          <div>
            <div className="font-medium text-primary hover:underline">{c.name}</div>
            <div className="text-xs text-muted-foreground">{c.email}</div>
          </div>
        </Link>
      ),
    },
    {
      key: 'accountId',
      label: 'Conta',
      render: (id: string) => {
        const acc = accounts.find((a) => a.id === id)
        return acc ? (
          <Link to={`/contas/${acc.id}`} className="hover:underline font-medium">
            {acc.name}
          </Link>
        ) : (
          '-'
        )
      },
    },
    {
      key: 'position',
      label: 'Cargo / Fone',
      render: (_: any, c: Contact) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">{c.position || '-'}</span>
          <span className="text-[11px] text-muted-foreground">{c.phone || c.mobile || 'N/A'}</span>
        </div>
      ),
    },
    {
      key: 'influenceLevelGlobal',
      label: 'Relacionamento',
      render: (_: any, c: Contact) => (
        <div className="flex flex-col gap-1 items-start">
          <Badge variant="outline" className="text-[10px] capitalize py-0">
            Inf: {c.influenceLevelGlobal || '?'}
          </Badge>
          <Badge
            variant={c.relationshipStrength === 'forte' ? 'default' : 'secondary'}
            className="text-[10px] capitalize py-0"
          >
            Rel: {c.relationshipStrength || '?'}
          </Badge>
        </div>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (_: any, c: Contact) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (window.confirm('Tem certeza que deseja excluir este contato?')) {
                deleteContact(c.id)
                toast({ title: 'Contato excluído com sucesso.' })
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
      <Plus className="mr-2 h-4 w-4" /> Novo Contato
    </Button>
  )

  return (
    <>
      <GenericDataTable
        title="Contatos"
        subtitle="Diretório de stakeholders e comitês de compra."
        data={contacts}
        columns={columns}
        searchKey="name"
        actions={actions}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Novo Contato</DialogTitle>
          </DialogHeader>
          <div className="pt-2">
            <ContactForm onSuccess={() => setOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
