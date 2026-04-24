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

  /P/ermissive durante carregamento - evita tela branca
  if (loading) {
    return <>{children}</>
      }

  if (!hasPermission(resource, action)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
