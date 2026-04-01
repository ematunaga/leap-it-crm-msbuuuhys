import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import useCrmStore from '@/stores/useCrmStore'
import { useToast } from '@/hooks/use-toast'

type UserFormValues = {
  id?: string
  name: string
  email: string
  password?: string
  avatarUrl?: string
  status: 'ativo' | 'inativo'
  origin: string
  profileId: string
}

type UserFormProps = {
  initialData?: Partial<UserFormValues>
  onSuccess: () => void
}

export function UserForm({ initialData, onSuccess }: UserFormProps) {
  const { addUser, updateUser, profiles } = useCrmStore()
  const { toast } = useToast()
  const [avatarPreview, setAvatarPreview] = useState(
    initialData?.avatarUrl || '',
  )

  const { register, handleSubmit, reset, setValue, watch } =
    useForm<UserFormValues>({
      defaultValues: {
        status: 'ativo',
        origin: 'crm',
        profileId: '',
        ...initialData,
      },
    })

  useEffect(() => {
    if (initialData) {
      reset({
        status: 'ativo',
        origin: 'crm',
        profileId: '',
        ...initialData,
      })
      setAvatarPreview(initialData.avatarUrl || '')
    }
  }, [initialData, reset])

  const profileId = watch('profileId')
  const status = watch('status')
  const name = watch('name')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'A imagem deve ter no máximo 2MB',
        variant: 'destructive',
      })
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const onSubmit = (data: UserFormValues) => {
    const prof = profiles.find((p: any) => p.id === data.profileId)

    const payload = {
      ...data,
      avatarUrl: avatarPreview,
      role: prof ? prof.name : 'Usuário',
      updatedAt: new Date().toISOString(),
    }

    if (initialData?.id) {
      updateUser(initialData.id, payload)
      toast({
        title:
          'Usuário atualizado. Sincronização disparada para Precificação!',
      })
    } else {
      addUser({
        ...payload,
        createdAt: new Date().toISOString(),
      })
      toast({
        title: 'Usuário criado e acesso liberado em ambas as plataformas!',
      })
    }

    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Avatar / Foto de Perfil */}
      <div className="flex flex-col gap-2 mb-2">
        <Label>Foto de Perfil</Label>
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 border shadow-sm">
            {avatarPreview ? (
              <AvatarImage
                src={avatarPreview}
                alt={name || 'Avatar do usuário'}
                className="object-cover"
              />
            ) : (
              <AvatarFallback>
                {name?.substring(0, 2).toUpperCase() || 'UN'}
              </AvatarFallback>
            )}
          </Avatar>
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="max-w-[250px] text-xs cursor-pointer"
          />
        </div>
      </div>

      {/* Nome */}
      <div className="space-y-1">
        <Label>Nome Completo *</Label>
        <Input
          {...register('name', { required: true })}
          placeholder="Ex: João Silva"
        />
      </div>

      {/* Email */}
      <div className="space-y-1">
        <Label>E-mail Corporativo *</Label>
        <Input
          type="email"
          {...register('email', { required: true })}
          placeholder="joao@leapit.com"
        />
      </div>

      {/* Senha apenas na criação */}
      {!initialData?.id && (
        <div className="space-y-1">
          <Label>Senha Inicial *</Label>
          <Input
            type="password"
            {...register('password', { required: true })}
            placeholder="Senha segura"
          />
          <p className="text-[10px] text-muted-foreground mt-1">
            As credenciais de acesso serão criptografadas na base de dados.
          </p>
        </div>
      )}

      {/* Perfil de acesso / Status */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Perfil de Acesso *</Label>
          <Select
            value={profileId}
            onValueChange={(v) => setValue('profileId', v as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              {profiles.map((p: any) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label>Status</Label>
          <Select
            value={status}
            onValueChange={(v) => setValue('status', v as any)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="text-[10px] text-muted-foreground">
        As credenciais de acesso serão criptografadas na base de dados.
      </p>

      {/* Botões */}
      <div className="flex justify-end pt-4">
        <Button
          type="button"
          variant="outline"
          className="mr-2"
          onClick={onSuccess}
        >
          Cancelar
        </Button>
        <Button type="submit">Salvar Usuário</Button>
      </div>
    </form>
  )
}