import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { GenericDataTable } from '../shared/GenericDataTable'
import { UserForm } from '@/components/users/UserForm'
import useCrmStore from '@/stores/useCrmStore'
import { AppUser } from '@/types'
import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRbac } from '@/hooks/use-rbac'
import { AccessDenied } from '@/components/AccessDenied'

export default function UsersList() {
  const { users, profiles, deleteUser, syncWithPricingApp } = useCrmStore()
  const { toast } = useToast()
  const { permissions, profile } = useRbac()
  const [open, setOpen] = useState(false)
  const [editData, setEditData] = useState<AppUser | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)

  const canManageUsers = profile?.type === 'sistema' || !!permissions.settings?.gerenciar_usuarios

  if (!canManageUsers) return <AccessDenied />

  const handleEdit = (u: AppUser) => {
    setEditData(u)
    setOpen(true)
  }

  const handleDelete = (id: string) => {
    if (
      window.confirm(
        'Tem certeza que deseja excluir este usuário? O acesso será revogado em todas as plataformas interligadas.',
      )
    ) {
      deleteUser(id)
      toast({ title: 'Usuário excluído com sucesso.' })
    }
  }

  const handleSyncAll = async () => {
    setIsSyncing(true)
    try {
      await syncWithPricingApp()
      toast({
        title: 'Sincronização concluída!',
        description: 'Os usuários da plataforma de precificação foram importados com sucesso.',
        variant: 'default',
      })
    } catch (error) {
      toast({
        title: 'Aviso de sincronização',
        description:
          'A comunicação com a API principal falhou, mas os dados locais foram atualizados.',
        variant: 'destructive',
      })
    } finally {
      setIsSyncing(false)
    }
  }

  const columns = [
    {
      key: 'name',
      label: 'Usuário',
      render: (_: any, u: AppUser) => (
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9 border shadow-sm">
            <AvatarImage src={u.avatarUrl} className="object-cover" />
            <AvatarFallback>{u.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{u.name}</div>
            <div className="text-xs text-muted-foreground">{u.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'profileId',
      label: 'Perfil / Cargo',
      render: (val: string, u: AppUser) => {
        const prof = profiles.find((p) => p.id === val)
        return <span>{prof ? prof.name : u.role}</span>
      },
    },
    {
      key: 'origin',
      label: 'Origem',
      render: (val: string) => <span className="capitalize">{val || 'CRM'}</span>,
    },
    {
      key: 'syncStatus',
      label: 'Sincronização',
      render: (val: string) => (
        <Badge
          variant={val === 'synced' ? 'default' : val === 'error' ? 'destructive' : 'secondary'}
          className={val === 'synced' ? 'bg-emerald-500 hover:bg-emerald-600' : ''}
        >
          {val === 'synced' ? 'Sincronizado' : val === 'error' ? 'Erro' : 'Pendente'}
        </Badge>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (val: string) => (
        <Badge
          variant="outline"
          className={
            val === 'ativo' ? 'border-emerald-500 text-emerald-600' : 'text-muted-foreground'
          }
        >
          {val}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: '',
      render: (_: any, u: AppUser) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => handleEdit(u)}>
            <Edit className="w-4 h-4 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => handleDelete(u.id)}>
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ]

  const actions = (
    <div className="flex gap-2">
      <Button variant="outline" onClick={handleSyncAll} disabled={isSyncing}>
        <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} /> Sincronizar
        Agora
      </Button>
      <Button
        onClick={() => {
          setEditData(null)
          setOpen(true)
        }}
      >
        <Plus className="w-4 h-4 mr-2" /> Novo Usuário
      </Button>
    </div>
  )

  return (
    <>
      <GenericDataTable
        title="Usuários e Equipe"
        subtitle="Gestão centralizada de contas e acessos interligados com outros sistemas."
        data={users}
        columns={columns}
        searchKey="name"
        actions={actions}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editData ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
          </DialogHeader>
          <div className="pt-4">
            <UserForm initialData={editData} onSuccess={() => setOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
