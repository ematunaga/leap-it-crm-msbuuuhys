import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Target } from 'lucide-react'

export default function ProtectedRoute() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-muted/20">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="bg-primary rounded-md p-2">
            <Target className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground font-medium">Validando acesso...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
