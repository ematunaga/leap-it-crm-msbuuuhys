import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Target, ArrowLeft } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loadingLogin, setLoadingLogin] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const { signIn, resetPassword } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingLogin(true)
    try {
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
    } catch (err) {
      toast({
        title: 'Acesso Negado',
        description: 'Verifique suas credenciais e tente novamente.',
        variant: 'destructive',
      })
    } finally {
      setLoadingLogin(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoadingLogin(true)
    try {
      const { error } = await resetPassword(email)
      if (error) {
        toast({
          title: 'Erro',
          description: error.message || 'Erro ao tentar enviar o e-mail de recuperação.',
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'E-mail enviado!',
          description: 'Verifique sua caixa de entrada com as instruções para redefinir sua senha.',
        })
        setIsForgotPassword(false)
      }
    } finally {
      setLoadingLogin(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <Card className="w-full max-w-md shadow-xl border-primary/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
        <CardHeader className="text-center space-y-4 pb-8 pt-8">
          <div className="mx-auto bg-primary rounded-xl w-14 h-14 flex items-center justify-center shadow-sm">
                            {/* Logo da Leap IT */}
                <div className="flex justify-center mb-6">
                  <img
                    src="/leap-it-logo.svg"
                    alt="Leap IT Logo"
                    className="h-16 w-auto"
                  />
                </div><Target className="w-8 h-8 text-primary-foreground" />
            
          </div>
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">LEAP IT CRM</CardTitle>
            <CardDescription className="text-base mt-1">
              {isForgotPassword
                ? 'Recuperação de credenciais'
                : 'Acesso restrito a usuários cadastrados.'}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {isForgotPassword ? (
            <form onSubmit={handleResetPassword} className="space-y-6 animate-fade-in">
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
                <p className="text-xs text-muted-foreground">
                  Enviaremos um link seguro para você redefinir sua senha.
                </p>
              </div>
              <div className="space-y-3">
                <Button type="submit" className="w-full h-11 text-base" disabled={loadingLogin}>
                  {loadingLogin ? 'Enviando...' : 'Enviar link de recuperação'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full text-muted-foreground"
                  onClick={() => setIsForgotPassword(false)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para o login
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-6 animate-fade-in">
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha de acesso</Label>
                  <Button
                    type="button"
                    variant="link"
                    className="px-0 font-normal h-auto text-xs text-muted-foreground hover:text-primary"
                    onClick={() => setIsForgotPassword(true)}
                  >
                    Esqueci minha senha
                  </Button>
                </div>
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
