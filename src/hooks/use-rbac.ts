import { useEffect, useState } from 'react'
import { useAuth } from './use-auth'
import { supabase } from '@/lib/supabase/client'

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
  nome: string
  descricao: string
  permissoes: Record<string, Permission>
  escopo: 'tudo' | 'proprio' | 'equipe'
  is_admin: boolean
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

      if (userData?.access_profile_id) {
        const { data: profileData, error: profileError } = await supabase
          .from('access_profiles')
          .select('*')
          .eq('id', userData.access_profile_id)
          .single()

        if (profileError) throw profileError
        setProfile(profileData)
      }
    } catch (error) {
      console.error('Erro ao carregar perfil de acesso:', error)
    } finally {
      setLoading(false)
    }
  }

  const hasPermission = (
    resource: string,
    action: 'view' | 'create' | 'edit' | 'delete'
  ): boolean => {
    if (!profile) return false
    if (profile.is_admin) return true

    const permission = profile.permissoes?.[resource]
    if (!permission) return false

    return permission.actions[action] === true
  }

  const canView = (resource: string) => hasPermission(resource, 'view')
  const canCreate = (resource: string) => hasPermission(resource, 'create')
  const canEdit = (resource: string) => hasPermission(resource, 'edit')
  const canDelete = (resource: string) => hasPermission(resource, 'delete')

  const getScope = () => profile?.escopo || 'proprio'
  const isAdmin = () => profile?.is_admin || false

  return {
    profile,
    loading,
    hasPermission,
    canView,
    canCreate,
    canEdit,
    canDelete,
    getScope,
    isAdmin,
    refresh: loadUserProfile
  }
}
