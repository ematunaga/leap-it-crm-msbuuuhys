import type { ReactNode } from 'react'
import { useRbac } from '@/hooks/use-rbac'
import type { Module, Action } from '@/lib/rbac'

interface Props {
  module: Module
  action: Action
  fallback?: ReactNode
  children: ReactNode
}

export function RequirePermission({
  module,
  action,
  fallback = null,
  children,
}: Props) {
  const { can } = useRbac()

  if (!can(module, action)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}