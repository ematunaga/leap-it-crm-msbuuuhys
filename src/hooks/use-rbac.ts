import { useEffect, useState } from 'react'
import { useAuth } from './use-auth'
import { supabase } from '@/lib/supabase/client'

// ============================================================
// CONVENCAO DE NOMENCLATURA
// - resource: chave em ingles alinhada ao schema do banco
//   ex: 'accounts', 'contacts', 'opportunities', 'activities'
// - action: sempre em ingles: 'view' | 'create' | 'edit' | 'delete'
// - A UI exibe rotulos em PT-BR, mas a logica usa ingles
// ============================================================

export type Action = 'view' | 'create' | 'edit' | 'delete'

export type Permission = {
  resource: string
  actions: {
    view: boolean
    create: boolean
    edit: boolean
    delete: boolean
  }
}

export type AccessProfile = {
  id: string
  name: string
  description: string
  permissions: Record<string, Permission>
  type: string
  status: string
  created_at: string
  updated_at: string
}

export const useRBAC = () => {
  const { user } = useAuth()
  const [profile, setProfile] = useState<AccessProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }
    loadUserProfile()
  }, [user])

  const loadUserProfile = async () => {
    try {
      setLoading(true)

      const { data: userData, error: userError } = await supabase
        .from('app_users')
        .select('access_profile_id')
        .eq('id', user!.id)
        .single()

      if (userError) throw userError

      if (!userData?.access_profile_id) {
        console.warn('Usuario sem access_profile_id - sem permissoes')
        setLoading(false)
        return
      }

      const { data: profileData, error: profileError } = await supabase
        .from('access_profiles')
        .select('*')
        .eq('id', userData.access_profile_id)
        .single()

      if (profileError) throw profileError
      setProfile(profileData)
    } catch (error) {
      console.error('Erro ao carregar perfil de acesso:', error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Verifica permissao para um recurso e acao.
   * @param resource  Chave em ingles (ex: 'accounts', 'contacts')
   * @param action    Acao em ingles (ex: 'view', 'create', 'edit', 'delete')
   */
  const hasPermission = (resource: string, action: Action): boolean => {
    if (!profile) return false

    // Administrador Global tem acesso irrestrito
    if (profile.name === 'Administrador Global') return true

    const permission = profile.permissions?.[resource]
    if (!permission) return false

    return permission.actions?.[action] === true
  }

  // Atalhos semanticos
  const canView   = (resource: string) => hasPermission(resource, 'view')
  const canCreate = (resource: string) => hasPermission(resource, 'create')
  const canEdit   = (resource: string) => hasPermission(resource, 'edit')
  const canDelete = (resource: string) => hasPermission(resource, 'delete')

  /**
   * Alias de hasPermission - mantido para compatibilidade com paginas
   * que chamam can(resource, action) diretamente.
   * Aceita APENAS acoes em ingles.
   */
  const can = (resource: string, action: Action) => hasPermission(resource, action)

  const isAdmin = () => profile?.name === 'Administrador Global' || false

  return {
    profile,
    loading,
    hasPermission,
    can,
    canView,
    canCreate,
    canEdit,
    canDelete,
    isAdmin,
    refresh: loadUserProfile,
  }
}
