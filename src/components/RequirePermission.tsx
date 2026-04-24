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

  // While loading permissions, show content to prevent blank screen
  if (loading) {
    return <>{children}</>
      }
  if (!hasPermission(resource, action)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
