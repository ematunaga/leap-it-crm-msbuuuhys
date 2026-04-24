import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from './components/Layout'
import Index from './pages/Index'
import NotFound from './pages/NotFound'

import AccountsList from './pages/accounts/AccountsList'
import AccountDetail from './pages/accounts/AccountDetail'
import BranchesReport from './pages/accounts/BranchesReport'
import ContactsList from './pages/contacts/ContactsList'
import ContactDetail from './pages/contacts/ContactDetail'
import PipelineBoard from './pages/pipeline/PipelineBoard'
import ForecastReport from './pages/pipeline/ForecastReport'
import OpportunitiesDashboard from './pages/opportunities/OpportunitiesDashboard'
import OpportunityDetail from './pages/opportunities/OpportunityDetail'
import ActivitiesList from './pages/activities/ActivitiesList'
import ActivityDetail from './pages/activities/ActivityDetail'
import LeadsList from './pages/leads/LeadsList'
import GenericListWrapper from './pages/shared/GenericListWrapper'
import ContractsList from './pages/contracts/ContractsList'
import CompetitorsList from './pages/competitors/CompetitorsList'
import SettingsDashboard from './pages/settings/SettingsDashboard'
import UsersList from './pages/users/UsersList'
import UserProfile from './pages/settings/UserProfile'
import { CrmProvider } from './stores/useCrmStore'
import { AuthProvider } from './hooks/use-auth'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/auth/Login'
import UpdatePassword from './pages/auth/UpdatePassword'
import { RequirePermission } from './components/RequirePermission'
import { useRBAC } from './hooks/use-rbac'

// Componente de acesso negado simples
const AccessDenied = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-2">Acesso Negado</h1>
      <p className="text-gray-600">Você não tem permissão para acessar esta página.</p>
    </div>
  </div>
)

// Wrapper para rotas protegidas por permissão
function ProtectedPermissionRoute({
  resource,
  action = 'view',
  element,
}: {
  resource: string
  action?: 'view' | 'create' | 'edit' | 'delete'
  element: React.ReactElement
}) {
  return (
    <RequirePermission
      resource={resource}
      action={action}
      fallback={<AccessDenied />}
    >
      {element}
    </RequirePermission>
  )
}

// Componente que redireciona SDR para /leads ao tentar acessar o Dashboard
function DashboardRoute() {
  const { profile, loading } = useRBAC()
  if (loading) return <Navigate to="/" replace />
  // SDR nao tem acesso ao dashboard - redireciona para leads
  if (profile && profile.name === 'SDR') {
    return <Navigate to="/leads" replace />
  }
  // Gestor Comercial e Admin tem acesso ao dashboard
  if (profile && profile.name !== 'Administrador Global' && profile.name !== 'Gestor Comercial') {
    const perms = profile.permissions?.['dashboard']
    if (!perms || !perms.actions?.view) {
      return <Navigate to="/leads" replace />
    }
  }
  return <Index />
}

const App = () => (
  <AuthProvider>
    <CrmProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <TooltipProvider>
          <Sonner />
          <Toaster />
          <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/update-password" element={<UpdatePassword />} />

            {/* Rotas protegidas por autenticação */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                {/* Dashboard - protegido por role */}
                <Route path="/" element={<DashboardRoute />} />

                {/* Meu perfil - todos os autenticados */}
                <Route path="meu-perfil" element={<UserProfile />} />

                {/* Contas */}
                <Route
                  path="contas"
                  element={
                    <ProtectedPermissionRoute
                      resource="accounts"
                      element={<AccountsList />}
                    />
                  }
                />
                <Route
                  path="contas/:id"
                  element={
                    <ProtectedPermissionRoute
                      resource="accounts"
                      element={<AccountDetail />}
                    />
                  }
                />
                <Route
                  path="filiais"
                  element={
                    <ProtectedPermissionRoute
                      resource="accounts"
                      element={<BranchesReport />}
                    />
                  }
                />

                {/* Contatos */}
                <Route
                  path="contatos"
                  element={
                    <ProtectedPermissionRoute
                      resource="contacts"
                      element={<ContactsList />}
                    />
                  }
                />
                <Route
                  path="contatos/:id"
                  element={
                    <ProtectedPermissionRoute
                      resource="contacts"
                      element={<ContactDetail />}
                    />
                  }
                />

                {/* Pipeline */}
                <Route
                  path="pipeline"
                  element={
                    <ProtectedPermissionRoute
                      resource="opportunities"
                      element={<PipelineBoard />}
                    />
                  }
                />

                {/* Oportunidades */}
                <Route
                  path="oportunidades"
                  element={
                    <ProtectedPermissionRoute
                      resource="opportunities"
                      element={<OpportunitiesDashboard />}
                    />
                  }
                />
                <Route
                  path="oportunidades/:id"
                  element={
                    <ProtectedPermissionRoute
                      resource="opportunities"
                      element={<OpportunityDetail />}
                    />
                  }
                />

                {/* Atividades */}
                <Route
                  path="atividades"
                  element={
                    <ProtectedPermissionRoute
                      resource="activities"
                      element={<ActivitiesList />}
                    />
                  }
                />
                <Route
                  path="atividades/:id"
                  element={
                    <ProtectedPermissionRoute
                      resource="activities"
                      element={<ActivityDetail />}
                    />
                  }
                />

                {/* Leads */}
                <Route
                  path="leads"
                  element={
                    <ProtectedPermissionRoute
                      resource="leads"
                      element={<LeadsList />}
                    />
                  }
                />

                {/* Campanhas */}
                <Route
                  path="campanhas"
                  element={
                    <ProtectedPermissionRoute
                      resource="campaigns"
                      element={<GenericListWrapper />}
                    />
                  }
                />

                {/* Propostas */}
                <Route
                  path="propostas"
                  element={
                    <ProtectedPermissionRoute
                      resource="proposals"
                      element={<GenericListWrapper />}
                    />
                  }
                />

                {/* Relatórios */}
                <Route
                  path="relatorios"
                  element={
                    <ProtectedPermissionRoute
                      resource="reports"
                      element={<GenericListWrapper />}
                    />
                  }
                />

                {/* Contratos */}
                <Route
                  path="contratos"
                  element={
                    <ProtectedPermissionRoute
                      resource="contracts"
                      element={<ContractsList />}
                    />
                  }
                />

                {/* Concorrentes */}
                <Route
                  path="concorrentes"
                  element={
                    <ProtectedPermissionRoute
                      resource="competitors"
                      element={<CompetitorsList />}
                    />
                  }
                />

                <Route
                  path="forecast"
                  element={
                    <ProtectedPermissionRoute
                      resource="opportunities"
                      element={<ForecastReport />}
                    />
                  }
                />
                {/* Administração */}
                <Route
                  path="usuarios"
                  element={
                    <ProtectedPermissionRoute
                      resource="settings"
                      element={<UsersList />}
                    />
                  }
                />
                <Route
                  path="settings"
                  element={
                    <ProtectedPermissionRoute
                      resource="settings"
                      element={<SettingsDashboard />}
                    />
                  }
                />
                <Route
                  path="auditoria"
                  element={
                    <ProtectedPermissionRoute
                      resource="settings"
                      element={<GenericListWrapper />}
                    />
                  }
                />
              </Route>
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </CrmProvider>
  </AuthProvider>
)

export default App
