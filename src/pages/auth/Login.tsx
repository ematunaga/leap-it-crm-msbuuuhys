import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Target } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loadingLogin, setLoadingLogin] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingLogin(true)
    const { error } = await signIn(email, password)
    if (error) {
      toast({
        title: 'Acesso Negado',
        description: 'Verifique suas credenciais e tente novamente.',
        variant: 'destructive',
      })
    } else {
      toast({ title: 'Login realizado com sucesso!' })
      navigate('/')
    }
    setLoadingLogin(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <Card className="w-full max-w-md shadow-xl border-primary/10">
        <CardHeader className="text-center space-y-4 pb-8">
          <div className="mx-auto bg-primary rounded-lg w-12 h-12 flex items-center justify-center">
            <Target className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">LEAP IT CRM</CardTitle>
            <CardDescription className="text-base mt-1">
              Acesso restrito a usuários cadastrados.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail corporativo</Label>
              <Input
                id="email"
                type="email"
                placeholder="nome@leapit.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha de acesso</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-background"
              />
            </div>
            <Button type="submit" className="w-full h-11 text-base" disabled={loadingLogin}>
              {loadingLogin ? 'Autenticando...' : 'Entrar no Sistema'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
