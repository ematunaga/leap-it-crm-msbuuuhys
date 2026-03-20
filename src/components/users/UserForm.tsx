import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import useCrmStore from '@/stores/useCrmStore'
import { AppUser } from '@/types'
import { useToast } from '@/hooks/use-toast'

interface UserFormProps {
  initialData?: AppUser | null
  onSuccess: () => void
}

export function UserForm({ initialData, onSuccess }: UserFormProps) {
  const { addUser, updateUser, profiles } = useCrmStore()
  const { toast } = useToast()

  const defaultAvatar = `https://img.usecurling.com/ppl/thumbnail?gender=${Math.random() > 0.5 ? 'male' : 'female'}&seed=${Math.floor(Math.random() * 100)}`

  const [formData, setFormData] = useState<Partial<AppUser>>(
    initialData || {
      name: '',
      email: '',
      role: '',
      profileId: '',
      status: 'ativo',
      origin: 'crm',
      avatarUrl: defaultAvatar,
    },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.role) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha nome, email e cargo.',
        variant: 'destructive',
      })
      return
    }

    if (initialData) {
      updateUser(initialData.id, formData)
      toast({
        title: 'Usuário atualizado',
        description: 'Dados salvos com sucesso e pendentes de sincronização.',
      })
    } else {
      addUser(formData as Omit<AppUser, 'id'>)
      toast({
        title: 'Usuário criado',
        description: 'Novo usuário adicionado e pendente de sincronização.',
      })
    }
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div className="space-y-2">
        <Label htmlFor="name">Nome Completo *</Label>
        <Input
          id="name"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Ex: João da Silva"
          className="bg-background"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email || ''}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="Ex: joao@empresa.com"
          className="bg-background"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Cargo / Função *</Label>
        <Input
          id="role"
          value={formData.role || ''}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          placeholder="Ex: Executivo de Vendas"
          className="bg-background"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Perfil de Acesso</Label>
          <Select
            value={formData.profileId || ''}
            onValueChange={(v) => setFormData({ ...formData, profileId: v })}
          >
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {profiles.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={formData.status || 'ativo'}
            onValueChange={(v) => setFormData({ ...formData, status: v })}
          >
            <SelectTrigger className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 mt-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancelar
        </Button>
        <Button type="submit">Salvar Usuário</Button>
      </div>
    </form>
  )
}
