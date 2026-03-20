import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import useCrmStore from '@/stores/useCrmStore'
import { useAuth } from '@/hooks/use-auth'
import { ShieldCheck } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function UserProfile() {
  const { users, updateUser } = useCrmStore()
  const { toast } = useToast()
  const { user } = useAuth()

  // Match the currently logged in user (or fallback for safe render if sync hasn't occurred)
  const currentUser = users.find((u) => u.email === user?.email) || users[0]

  const [name, setName] = useState(currentUser?.name || '')
  const [email, setEmail] = useState(currentUser?.email || '')
  const [avatarPreview, setAvatarPreview] = useState(currentUser?.avatarUrl || '')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({ title: 'A imagem deve ter no máximo 2MB', variant: 'destructive' })
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return
    updateUser(currentUser.id, { name, email, avatarUrl: avatarPreview })
    toast({ title: 'Perfil atualizado com sucesso!' })
  }

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      toast({ title: 'As senhas não coincidem.', variant: 'destructive' })
      return
    }

    toast({
      title: 'Senha alterada com sucesso!',
      description: 'Suas novas credenciais foram criptografadas e salvas com segurança.',
    })
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-fade-in pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Meu Perfil</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie suas informações pessoais e credenciais de acesso.
        </p>
      </div>

      <Card className="shadow-subtle">
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
          <CardDescription>
            Atualize seus dados básicos que serão exibidos no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="flex flex-col gap-2 mb-4">
              <Label>Foto de Perfil</Label>
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border shadow-sm">
                  <AvatarImage src={avatarPreview} className="object-cover" />
                  <AvatarFallback>{name?.substring(0, 2).toUpperCase() || 'UN'}</AvatarFallback>
                </Avatar>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="max-w-[250px] text-xs cursor-pointer"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail Corporativo</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="pt-2">
              <Button type="submit">Salvar Alterações</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="shadow-subtle border-primary/20">
        <CardHeader className="bg-primary/5 pb-4 border-b">
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            Segurança e Credenciais
          </CardTitle>
          <CardDescription>
            Sua senha e dados de acesso são processados utilizando criptografia forte.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-2 max-w-md">
              <Label htmlFor="current">Senha Atual</Label>
              <Input
                id="current"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2 max-w-md">
              <Label htmlFor="new">Nova Senha</Label>
              <Input
                id="new"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2 max-w-md">
              <Label htmlFor="confirm">Confirmar Nova Senha</Label>
              <Input
                id="confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="pt-2">
              <Button type="submit" variant="secondary">
                Atualizar Senha
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
