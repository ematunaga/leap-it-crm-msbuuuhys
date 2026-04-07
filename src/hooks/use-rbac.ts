import { useAuth } from '@/hooks/use-auth'
import { hasPermission } from '@/lib/rbac'
import type { Module, Action, Role } from '@/lib/rbac'

export function useRbac() {
  const { user } = useAuth()

  // O papel vem do user_metadata do Supabase
  const role = (user?.user_metadata?.role ?? 'leitura') as Role

  function can(module: Module, action: Action): boolean {
    if (!user) return false
    return hasPermission(role, module, action)
  }

  return { can, role }
}