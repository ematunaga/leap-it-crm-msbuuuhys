import { ReactNode } from 'react'
import { useRbac } from '@/hooks/use-rbac'

interface Props {
  module: string
  action?: string
  children: ReactNode
  fallback?: ReactNode
}

export function RequirePermission({
  module,
  action = 'visualizar',
  children,
  fallback = null,
}: Props) {
  const { can } = useRbac()

  if (!can(module, action)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
