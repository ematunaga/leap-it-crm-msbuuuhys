import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { useRBAC } from '@/hooks/use-rbac'
import { Target } from 'lucide-react'

export default function ProtectedRoute() {
  const { session, loading } = useAuth()
  const { loading: rbacLoading } = useRBAC()

  if (loading || rbacLoading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-2 text-muted-foreground">
        <Target className="h-8 w-8 animate-pulse text-primary" />
        <p className="text-sm">Validando acesso...</p>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
