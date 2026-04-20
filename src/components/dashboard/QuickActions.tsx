import { Plus, Users, Building2, Target, FileText } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface QuickAction {
  icon: React.ElementType
  label: string
  description: string
  path: string
  color: string
}

export function QuickActions() {
  const navigate = useNavigate()

  const actions: QuickAction[] = [
    {
      icon: Target,
      label: 'Nova Oportunidade',
      description: 'Criar nova oportunidade de venda',
      path: '/opportunities/new',
      color: 'text-blue-500',
    },
    {
      icon: Users,
      label: 'Novo Lead',
      description: 'Adicionar um novo lead',
      path: '/leads/new',
      color: 'text-emerald-500',
    },
    {
      icon: Building2,
      label: 'Nova Conta',
      description: 'Criar nova empresa/conta',
      path: '/accounts/new',
      color: 'text-purple-500',
    },
    {
      icon: FileText,
      label: 'Nova Atividade',
      description: 'Registrar tarefa ou follow-up',
      path: '/activities/new',
      color: 'text-amber-500',
    },
  ]

  return (
    <Card className="shadow-subtle hover:shadow-elevation transition-shadow animate-fade-in-up">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, i) => (
            <Button
              key={i}
              variant="outline"
              className={cn(
                'h-auto flex-col items-start p-4 hover:bg-accent transition-colors',
                'border-2 hover:border-primary/50'
              )}
              onClick={() => navigate(action.path)}
            >
              <action.icon className={cn('h-6 w-6 mb-2', action.color)} />
              <div className="text-left">
                <div className="font-semibold text-sm mb-1">{action.label}</div>
                <div className="text-xs text-muted-foreground font-normal">
                  {action.description}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
