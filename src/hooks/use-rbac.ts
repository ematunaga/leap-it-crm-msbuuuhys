import useCrmStore from '@/stores/useCrmStore'
import { useAuth } from '@/hooks/use-auth'
import { PermissionsMatrix } from '@/types'

export function useRbac() {
  const { user } = useAuth()
  const { users, profiles } = useCrmStore()

  // Make the email comparison case-insensitive to prevent access issues
  const appUser = users.find(
    (u) =>
      u.id === user?.id ||
      (u.email && user?.email && u.email.toLowerCase() === user.email.toLowerCase()),
  )
  const profile = profiles.find((p) => p.id === appUser?.profileId)
  const permissions = (profile?.permissions || {}) as PermissionsMatrix

  const can = (module: string, action: string = 'visualizar') => {
    if (!profile) return false

    // System Admins have full access
    if (profile.type === 'sistema') return true

    // Always allow dashboard access if they have a profile, unless specifically restricted
    if (module === 'dashboard' && permissions.dashboard?.visualizar !== false) {
      return true
    }

    // Special logic for settings module mapping
    if (module === 'settings') {
      if (action === 'visualizar') {
        return (
          !!permissions.settings?.visualizar ||
          !!permissions.settings?.gerenciar_perfis ||
          !!permissions.settings?.gerenciar_usuarios
        )
      }
      return !!(permissions.settings as any)?.[action]
    }

    // Handle generic modules
    const modPerms = (permissions as any)[module]
    if (!modPerms) return false

    return !!modPerms[action]
  }

  return { appUser, profile, permissions, can }
}
