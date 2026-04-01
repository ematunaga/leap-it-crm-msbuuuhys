import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AccessProfile } from '@/types'
import useCrmStore from '@/stores/useCrmStore'
import { PermissionsMatrixEditor } from './PermissionsMatrixEditor'

interface ProfileFormProps {
  initialData?: AccessProfile | null
  onSuccess: () => void
}

export function ProfileForm({ initialData, onSuccess }: ProfileFormProps) {
  const { addProfile, updateProfile } = useCrmStore()
  const [formData, setFormData] = useState<Partial<AccessProfile>>(
    initialData || {
      name: '',
      description: '',
      type: 'personalizado',
      status: 'ativo',
      permissions: {},
    },
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (initialData) {
      updateProfile(initialData.id, formData)
    } else {
      addProfile(formData as Omit<AccessProfile, 'id'>)
    }
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full animate-fade-in">
      <Tabs defaultValue="geral" className="flex-1 flex flex-col min-h-0">
        <TabsList className="grid w-full grid-cols-2 mb-4 bg-muted/50">
          <TabsTrigger value="geral">Dados Gerais</TabsTrigger>
          <TabsTrigger value="permissoes">Matriz de Permissões</TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="space-y-4 overflow-y-auto pr-2 flex-1 pb-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Perfil *</Label>
            <Input
              id="name"
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Gerente Comercial"
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Explique o propósito deste perfil de acesso e a quem se destina..."
              rows={4}
              className="bg-background"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo de Perfil</Label>
              <Select
                value={formData.type || 'personalizado'}
                onValueChange={(v) => setFormData({ ...formData, type: v })}
                disabled={formData.type === 'sistema'}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personalizado">Personalizado</SelectItem>
                  {formData.type === 'sistema' && (
                    <SelectItem value="sistema">Sistema (Padrão)</SelectItem>
                  )}
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
        </TabsContent>

        <TabsContent value="permissoes" className="overflow-y-auto pr-2 flex-1">
          <PermissionsMatrixEditor
            value={formData.permissions || {}}
            onChange={(p: any) => setFormData({ ...formData, permissions: p })}
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 pt-4 mt-auto border-t">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancelar
        </Button>
        <Button type="submit">Salvar Perfil</Button>
      </div>
    </form>
  )
}
