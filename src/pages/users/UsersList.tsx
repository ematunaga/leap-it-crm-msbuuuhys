import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { GenericDataTable } from '../shared/GenericDataTable'
import { UserForm } from '@/components/users/UserForm'
import useCrmStore from '@/stores/useCrmStore'
import { AppUser } from '@/types'
import {
  RefreshCw,
  Link as LinkIcon,
  Database,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
  Edit,
  Trash2,
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { formatDate } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export default function UsersList() {
  const { users, syncWithPricingApp, deleteUser } = useCrmStore()
  const { toast } = useToast()

  const [isSyncing, setIsSyncing] = useState(false)
  const [openForm, setOpenForm] = useState(false)
  const [editUser, setEditUser] = useState<AppUser | null>(null)

  const [openDelete, setOpenDelete] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)

  const handleSync = async () => {
    setIsSyncing(true)
    try {
      await syncWithPricingApp()
      toast({
        title: 'Sincronização Concluída',
        description: 'Os usuários foram sincronizados com sucesso com o LEAP IT Precificação.',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro na Sincronização',
        description: 'Ocorreu um erro ao tentar sincronizar com o aplicativo de Precificação.',
      })
    } finally {
      setIsSyncing(false)
    }
  }

  const confirmDelete = () => {
    if (userToDelete) {
      deleteUser(userToDelete)
      toast({
        title: 'Usuário Removido',
        description:
          'O usuário foi excluído do CRM e a alteração será propagada para a Precificação.',
      })
    }
    setOpenDelete(false)
  }

  const columns = [
    {
      key: 'name',
      label: 'Usuário',
      render: (_: any, user: AppUser) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Função / Perfil',
      render: (val: string) => (
        <div className="flex flex-col gap-1">
          <span className="font-medium text-sm">{val}</span>
        </div>
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
      key: 'origin',
      label: 'Origem dos Dados',
      render: (val: string) => (
        <Badge variant="outline" className="flex items-center gap-1 w-fit bg-muted/50">
          <Database className="w-3 h-3 text-muted-foreground" />
          <span className="capitalize">{val === 'crm' ? 'CRM' : 'Precificação'}</span>
        </Badge>
      ),
    },
    {
      key: 'syncStatus',
      label: 'Status Sincronização',
      render: (val: string, user: AppUser) => {
        let icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
        let text = 'Sincronizado'
        let variant: 'default' | 'secondary' | 'destructive' | 'outline' = 'outline'
        let borderClass =
          'border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20'

        if (val === 'pending') {
          icon = <Clock className="w-3.5 h-3.5 text-amber-500" />
          text = 'Pendente'
          borderClass =
            'border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20'
        } else if (val === 'error') {
          icon = <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
          text = 'Erro na Sync'
          borderClass =
            'border-rose-200 bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:border-rose-500/20'
        }

        return (
          <div className="flex flex-col gap-1 items-start">
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant={variant} className={`flex items-center gap-1 w-fit ${borderClass}`}>
                  {icon}
                  <span>{text}</span>
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Status de integração com LEAP IT Precificação</p>
                {user.lastSyncAt && (
                  <p className="text-xs mt-1 text-muted-foreground">
                    Última sync: {formatDate(user.lastSyncAt)}
                  </p>
                )}
              </TooltipContent>
            </Tooltip>
            {user.lastSyncAt && val === 'synced' && (
              <span className="text-[10px] text-muted-foreground">
                Em: {formatDate(user.lastSyncAt)}
              </span>
            )}
          </div>
        )
      },
    },
    {
      key: 'actions',
      label: '',
      render: (_: any, user: AppUser) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setEditUser(user)
              setOpenForm(true)
            }}
          >
            <Edit className="w-4 h-4 text-muted-foreground" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setUserToDelete(user.id)
              setOpenDelete(true)
            }}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      ),
    },
  ]

  const actions = (
    <div className="flex items-center gap-3">
      <Button
        variant="outline"
        onClick={handleSync}
        disabled={isSyncing}
        className="bg-primary/5 border-primary/20 hover:bg-primary/10 text-primary"
      >
        {isSyncing ? (
          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <LinkIcon className="w-4 h-4 mr-2" />
        )}
        Sincronizar Forçado
      </Button>
      <Button
        onClick={() => {
          setEditUser(null)
          setOpenForm(true)
        }}
      >
        <Plus className="w-4 h-4 mr-2" /> Novo Usuário
      </Button>
    </div>
  )

  return (
    <>
      <div className="bg-card rounded-xl">
        <GenericDataTable
          title="Usuários e Integração"
          subtitle="Gestão de acesso centralizada com o aplicativo LEAP IT Precificação."
          data={users}
          columns={columns}
          searchKey="name"
          actions={actions}
        />
      </div>

      <Dialog open={openForm} onOpenChange={setOpenForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editUser ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
          </DialogHeader>
          <UserForm initialData={editUser} onSuccess={() => setOpenForm(false)} />
        </DialogContent>
      </Dialog>

      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação removerá o acesso deste usuário permanentemente no CRM e as mudanças
              refletirão no aplicativo de Precificação.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenDelete(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              Remover Usuário
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
