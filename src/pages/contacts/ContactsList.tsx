import { GenericDataTable } from '../shared/GenericDataTable'
import useCrmStore from '@/stores/useCrmStore'
import { Contact } from '@/types'
import { Badge } from '@/components/ui/badge'

export default function ContactsList() {
  const { contacts, accounts } = useCrmStore()

  const columns = [
    {
      key: 'name',
      label: 'Contato',
      render: (_: any, c: Contact) => (
        <div className="flex items-center gap-3">
          <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full bg-muted border" />
          <div>
            <div className="font-medium">{c.name}</div>
            <div className="text-xs text-muted-foreground">{c.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'accountId',
      label: 'Conta',
      render: (id: string) => accounts.find((a) => a.id === id)?.name || '-',
    },
    { key: 'role', label: 'Cargo' },
    {
      key: 'influence',
      label: 'Influência',
      render: (val: string) => <Badge variant="secondary">{val}</Badge>,
    },
  ]

  return (
    <GenericDataTable
      title="Contatos"
      subtitle="Diretório de stakeholders e comitês de compra."
      data={contacts}
      columns={columns}
      searchKey="name"
    />
  )
}
