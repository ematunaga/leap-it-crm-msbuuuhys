import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import useCrmStore from '@/stores/useCrmStore'
import { Camera, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const OPTS = {
  influence: ['baixo', 'medio', 'alto'],
  relationship: ['fraco', 'medio', 'forte'],
  status: ['novo', 'ativo', 'inativo', 'prospecto', 'cliente'],
}

export function ContactForm({
  onSuccess,
  defaultAccountId = '',
  initialData,
}: {
  onSuccess: () => void
  defaultAccountId?: string
  initialData?: any
}) {
  const { addContact, updateContact, accounts } = useCrmStore()
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || { accountId: defaultAccountId },
  })
  const [isLoadingCep, setIsLoadingCep] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(initialData?.avatarUrl || null)

  useEffect(() => {
    if (initialData) {
      reset(initialData)
      setAvatarPreview(initialData.avatarUrl || null)
    }
  }, [initialData, reset])

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '')
    if (val.length === 8) {
      setIsLoadingCep(true)
      try {
        const res = await fetch(`https://viacep.com.br/ws/${val}/json/`)
        const data = await res.json()
        if (!data.erro) {
          setValue('address', data.logradouro)
          setValue('city', data.localidade)
          setValue('state', data.uf)
          toast({ title: 'Endereço preenchido via CEP' })
        }
      } catch (err) {
        toast({ title: 'Erro ao buscar CEP', variant: 'destructive' })
      } finally {
        setIsLoadingCep(false)
      }
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = (data: any) => {
    if (initialData?.id) {
      updateContact(initialData.id, {
        ...data,
        avatarUrl: avatarPreview || '',
        updatedAt: new Date().toISOString(),
      })
      toast({ title: 'Contato atualizado com sucesso!' })
    } else {
      addContact({
        ...data,
        avatarUrl: avatarPreview || '',
        createdAt: new Date().toISOString(),
      })
      toast({ title: 'Contato criado com sucesso!' })
    }
    onSuccess()
  }

  const F = ({ l, n, r }: any) => (
    <div className="space-y-1">
      <Label className="text-[11px]">
        {l}
        {r && ' *'}
      </Label>
      <Input className="h-8 text-xs" {...register(n, { required: r })} />
      {errors[n] && <span className="text-[10px] text-destructive">Obrigatório</span>}
    </div>
  )
  const S = ({ l, n, opts }: any) => (
    <div className="space-y-1">
      <Label className="text-[11px]">{l}</Label>
      <select
        className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
        {...register(n)}
      >
        <option value="">Selecione...</option>
        {opts.map((o: any) => (
          <option key={o} value={o}>
            {o.replace(/_/g, ' ')}
          </option>
        ))}
      </select>
    </div>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 flex items-center gap-4 mb-2">
          <div className="relative">
            <Avatar className="w-16 h-16 border cursor-pointer hover:opacity-80 transition-opacity">
              <AvatarImage src={avatarPreview || undefined} className="object-cover" />
              <AvatarFallback className="bg-muted text-muted-foreground">
                <Camera className="w-6 h-6" />
              </AvatarFallback>
            </Avatar>
            <Input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handlePhotoUpload}
            />
          </div>
          <div className="text-xs text-muted-foreground">
            <p className="font-medium text-foreground">Foto do Contato</p>
            <p>Clique na imagem para fazer upload</p>
          </div>
        </div>
        <div className="col-span-2 space-y-1">
          <Label className="text-[11px]">Conta Vinculada *</Label>
          <select
            className="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-xs"
            {...register('accountId', { required: true })}
          >
            <option value="">Selecione uma conta</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          {errors.accountId && <span className="text-[10px] text-destructive">Obrigatório</span>}
        </div>
        <F l="Nome Completo" n="name" r /> <F l="Cargo" n="position" /> <F l="E-mail" n="email" r />
        <F l="Telefone" n="phone" /> <F l="Celular (WhatsApp)" n="mobile" />{' '}
        <F l="LinkedIn" n="linkedin" />
        <div className="col-span-2 font-semibold text-xs mt-2 border-b pb-1 text-muted-foreground">
          Classificação
        </div>
        <S l="Nível de Influência" n="influenceLevelGlobal" opts={OPTS.influence} />
        <S l="Força do Relacionamento" n="relationshipStrength" opts={OPTS.relationship} />
        <S l="Status" n="relationshipStatus" opts={OPTS.status} />
        <div className="col-span-2 font-semibold text-xs mt-2 border-b pb-1 text-muted-foreground">
          Endereço (Opcional)
        </div>
        <div className="space-y-1 col-span-2 sm:col-span-1">
          <Label className="text-[11px]">CEP</Label>
          <div className="relative">
            <Input className="h-8 text-xs" {...register('zipCode')} onBlur={handleCepBlur} />
            {isLoadingCep && <Loader2 className="absolute right-2 top-2 h-4 w-4 animate-spin" />}
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-[11px]">Cidade / UF</Label>
          <div className="flex gap-2">
            <Input className="h-8 text-xs flex-1" {...register('city')} />
            <Input className="h-8 text-xs w-16" {...register('state')} />
          </div>
        </div>
        <div className="col-span-2">
          <F l="Endereço Completo" n="address" />
        </div>
      </div>
      <div className="flex justify-end pt-2 pb-4">
        <Button type="submit" size="sm">
          Salvar Contato
        </Button>
      </div>
    </form>
  )
}
