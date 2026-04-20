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

  // Aguarda perfil RBAC carregar — retorna null (tela em branco) sem expor o conteudo
  if (loading) {
    return null
  }

  if (!hasPermission(resource, action)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
