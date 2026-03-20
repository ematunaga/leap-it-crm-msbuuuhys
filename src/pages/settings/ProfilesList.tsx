import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { GenericDataTable } from '../shared/GenericDataTable'
import { ProfileForm } from '@/components/settings/ProfileForm'
import useCrmStore from '@/stores/useCrmStore'
import { AccessProfile } from '@/types'
import { Plus, Edit, Shield, ShieldAlert } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function ProfilesList() {
  const { profiles } = useCrmStore()
  const [open, setOpen] = useState(false)
  const [editData, setEditData] = useState<AccessProfile | null>(null)

  const handleEdit = (p: AccessProfile) => {
    setEditData(p)
    setOpen(true)
  }

  const columns = [
    {
      key: 'name',
      label: 'Perfil',
      render: (val: string, p: AccessProfile) => (
        <div className="flex items-center gap-3">
          <div className="p-2 bg-muted rounded-md border">
            {p.type === 'sistema' ? (
              <ShieldAlert className="w-4 h-4 text-rose-500" />
            ) : (
              <Shield className="w-4 h-4 text-primary" />
            )}
          </div>
          <div>
            <p className="font-semibold text-foreground">{val}</p>
            <p className="text-xs text-muted-foreground line-clamp-1 max-w-[250px]">
              {p.description || 'Sem descrição'}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Tipo',
      render: (val: string) => (
        <Badge variant="outline" className="capitalize">
          {val}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (val: string) => (
        <Badge
          variant={val === 'ativo' ? 'default' : 'secondary'}
          className={`capitalize ${val === 'ativo' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}`}
        >
          {val}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      label: 'Criado em',
      render: (val: string) => <span className="text-muted-foreground">{formatDate(val)}</span>,
    },
    {
      key: 'actions',
      label: '',
      render: (_: any, p: AccessProfile) => (
        <Button variant="ghost" size="sm" onClick={() => handleEdit(p)}>
          <Edit className="w-4 h-4 mr-2 text-muted-foreground" /> Editar
        </Button>
      ),
    },
  ]

  const actions = (
    <Button
      onClick={() => {
        setEditData(null)
        setOpen(true)
      }}
    >
      <Plus className="w-4 h-4 mr-2" /> Novo Perfil
    </Button>
  )

  return (
    <>
      <div className="bg-card rounded-xl">
        <GenericDataTable
          title="Lista de Perfis"
          subtitle="Gerencie os níveis de permissão e escopo de visibilidade."
          data={profiles}
          columns={columns}
          searchKey="name"
          actions={actions}
        />
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[900px] h-[85vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>
              {editData ? 'Editar Perfil de Acesso' : 'Novo Perfil de Acesso'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden p-6">
            <ProfileForm initialData={editData} onSuccess={() => setOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
