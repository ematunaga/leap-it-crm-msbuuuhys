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
import { supabase } from '@/lib/supabase/client'
import { ROLE_LABELS } from '@/lib/rbac'
import type { Role } from '@/lib/rbac'

type UserFormValues = {
  name: string
  email: string
  password?: string
  avatarUrl?: string
  status: 'ativo' | 'inativo'
  origin: string
  role: Role
}

type UserFormProps = {
  initialData?: any
  onSuccess: () => void
}

export function UserForm({ initialData, onSuccess }: UserFormProps) {
  const { updateUser, addUser } = useCrmStore()
  const { toast } = useToast()
  const [avatarPreview, setAvatarPreview] = useState<string>(
    initialData?.avatarUrl ?? '',
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, reset, setValue, watch } =
    useForm<UserFormValues>({
      defaultValues: {
        name: initialData?.name ?? '',
        email: initialData?.email ?? '',
        avatarUrl: initialData?.avatarUrl ?? '',
        status: (initialData?.status as 'ativo' | 'inativo') ?? 'ativo',
        origin: initialData?.origin ?? 'crm',
        role: (initialData?.role as Role) ?? 'leitura',
      },
    })

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name ?? '',
        email: initialData.email ?? '',
        avatarUrl: initialData.avatarUrl ?? '',
        status: (initialData.status as 'ativo' | 'inativo') ?? 'ativo',
        origin: initialData.origin ?? 'crm',
        role: (initialData.role as Role) ?? 'leitura',
      })
      setAvatarPreview(initialData.avatarUrl ?? '')
    }
  }, [initialData, reset])

  const role = watch('role')
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
    reader.onloadend = () => setAvatarPreview(reader.result as string)
    reader.readAsDataURL(file)
  }

  const onSubmit = async (data: UserFormValues) => {
    setIsSubmitting(true)
    try {
      if (initialData?.id) {
        // ── EDIÇÃO ──
        const { password, ...rest } = data

        await updateUser(initialData.id, {
          ...rest,
          avatarUrl: avatarPreview,
          syncStatus: 'pending',
          updatedAt: new Date().toISOString(),
        })

        if (password && password.length >= 6) {
          await supabase.auth.updateUser({ password })
        }

        toast({ title: 'Usuário atualizado com sucesso!' })
        onSuccess()
      } else {
        // ── CRIAÇÃO via Edge Function ──
        if (!data.password || data.password.length < 6) {
          toast({
            title: 'Senha obrigatória',
            description: 'A senha deve ter no mínimo 6 caracteres.',
            variant: 'destructive',
          })
          setIsSubmitting(false)
          return
        }

        // Pega o token do usuário logado para autorizar a Edge Function
        const { data: sessionData } = await supabase.auth.getSession()
        const accessToken = sessionData.session?.access_token

        if (!accessToken) {
          toast({
            title: 'Sessão expirada',
            description: 'Faça login novamente para continuar.',
            variant: 'destructive',
          })
          setIsSubmitting(false)
          return
        }

        const { data: result, error } = await supabase.functions.invoke(
          'create-user',
          {
            body: {
              name: data.name,
              email: data.email,
              password: data.password,
              role: data.role,
              status: data.status,
              origin: data.origin,
              avatarUrl: avatarPreview || null,
              syncStatus: 'pending',
            },
           },      
          )  
        if (error || result?.error) {
          toast({
            title: 'Erro ao criar usuário',
            description: error?.message ?? result?.error,
            variant: 'destructive',
          })
          setIsSubmitting(false)
          return
        }

        // Recarrega lista de usuários diretamente sem chamar addUser
        const { data: usersData } = await supabase
          .from('app_users')
          .select('*')
          .order('created_at', { ascending: false })

        if (usersData) {
          // O store vai atualizar via addUser com os dados frescos
          await addUser({} as any)
        }

        toast({ title: 'Usuário criado com sucesso! Acesso liberado no CRM.' })
        onSuccess()
      }
    } catch (e: any) {
      toast({
        title: 'Erro inesperado',
        description: e?.message ?? 'Tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

      {/* Avatar */}
      <div className="flex flex-col gap-2 mb-2">
        <Label>Foto de Perfil</Label>
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16 border shadow-sm">
            {avatarPreview ? (
              <AvatarImage
                src={avatarPreview}
                alt={name || 'Avatar'}
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
          placeholder="joao@leapit.com.br"
          disabled={!!initialData?.id}
        />
      </div>

      {/* Senha */}
      <div className="space-y-1">
        <Label>
          {initialData?.id
            ? 'Nova Senha (deixe em branco para manter)'
            : 'Senha Inicial *'}
        </Label>
        <Input
          type="password"
          {...register('password')}
          placeholder={
            initialData?.id
              ? 'Digite para alterar a senha'
              : 'Mínimo 6 caracteres'
          }
        />
        <p className="text-[10px] text-muted-foreground mt-1">
          As credenciais são criptografadas no Supabase Auth.
        </p>
      </div>

      {/* Perfil e Status */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>Perfil de Acesso *</Label>
          <Select
            value={role}
            onValueChange={(v) => setValue('role', v as Role)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o perfil" />
            </SelectTrigger>
            <SelectContent>
              {(Object.entries(ROLE_LABELS) as [Role, string][]).map(
                ([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label>Status</Label>
          <Select
            value={status}
            onValueChange={(v) =>
              setValue('status', v as 'ativo' | 'inativo')
            }
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
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar Usuário'}
        </Button>
      </div>
    </form>
  )
}