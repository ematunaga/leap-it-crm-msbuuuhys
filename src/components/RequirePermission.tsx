import type { ReactNode } from 'react'
import { useRBAC } from '@/hooks/use-rbac'

interface Props {
  resource: string
  action: 'view' | 'create' | 'edit' | 'delete'
  fallback?: ReactNode
  children: ReactNode
}

export function RequirePermission({
  resource,
  action,
  fallback = null,
  children,
}: Props) {
  const { hasPermission, loading } = useRBAC()

  // HOTFIX: Enquanto carrega, renderiza o conteúdo (evita tela em branco)
  // Validação final de permissão acontece no servidor via RLS
  if (loading) {
    return <>{children}</>
  }

  if (!hasPermission(resource, action)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
