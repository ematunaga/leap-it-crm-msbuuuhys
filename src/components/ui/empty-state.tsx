import { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-4 text-center',
        className
      )}
    >
      {Icon && (
        <div className="rounded-full bg-muted p-6 mb-4">
          <Icon className="h-12 w-12 text-muted-foreground" />
        </div>
      )}
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          {description}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick} size="lg">
          {action.label}
        </Button>
      )}
    </div>
  )
}

// Specific empty state variants
export function NoDataState({
  entityName = 'dados',
  onAction,
}: {
  entityName?: string
  onAction?: () => void
}) {
  return (
    <EmptyState
      title={`Nenhum ${entityName} encontrado`}
      description={`Você ainda não possui ${entityName}. Comece criando o primeiro agora.`}
      action={
        onAction
          ? {
              label: `Criar ${entityName}`,
              onClick: onAction,
            }
          : undefined
      }
    />
  )
}

export function NoSearchResultsState({
  searchTerm,
  onClear,
}: {
  searchTerm?: string
  onClear?: () => void
}) {
  return (
    <EmptyState
      title="Nenhum resultado encontrado"
      description={
        searchTerm
          ? `Não encontramos resultados para "${searchTerm}". Tente ajustar sua pesquisa.`
          : 'Não encontramos resultados. Tente ajustar seus filtros.'
      }
      action={
        onClear
          ? {
              label: 'Limpar filtros',
              onClick: onClear,
            }
          : undefined
      }
    />
  )
}

export function ErrorState({
  onRetry,
  message = 'Ocorreu um erro ao carregar os dados',
}: {
  onRetry?: () => void
  message?: string
}) {
  return (
    <EmptyState
      title="Ops! Algo deu errado"
      description={message}
      action={
        onRetry
          ? {
              label: 'Tentar novamente',
              onClick: onRetry,
            }
          : undefined
      }
    />
  )
}
