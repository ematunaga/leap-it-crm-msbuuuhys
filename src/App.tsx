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

import OpportunitiesDashboard from './pages/opportunities/OpportunitiesDashboard'
import OpportunityDetail from './pages/opportunities/OpportunityDetail'

import ActivitiesList from './pages/activities/ActivitiesList'
import ActivityDetail from './pages/activities/ActivityDetail'
import LeadsList from './pages/leads/LeadsList'

import GenericListWrapper from './pages/shared/GenericListWrapper'
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
                {/* Dashboard - todos os autenticados */}
                <Route path="/" element={<Index />} />
                
                {/* Meu perfil - todos os autenticados */}
                <Route path="meu-perfil" element={<UserProfile />} />
                
                {/* Contas */}
                <Route 
                  path="contas" 
                  element={
                    <ProtectedPermissionRoute 
                      resource="contas" 
                      element={<AccountsList />} 
                    />
                  } 
                />
                <Route 
                  path="contas/:id" 
                  element={
                    <ProtectedPermissionRoute 
                      resource="contas" 
                      element={<AccountDetail />} 
                    />
                  } 
                />
                <Route 
                  path="filiais" 
                  element={
                    <ProtectedPermissionRoute 
                      resource="contas" 
                      element={<BranchesReport />} 
                    />
                  } 
                />
                
                {/* Contatos */}
                <Route 
                  path="contatos" 
                  element={
                    <ProtectedPermissionRoute 
                      resource="contatos" 
                      element={<ContactsList />} 
                    />
                  } 
                />
                <Route 
                  path="contatos/:id" 
                  element={
                    <ProtectedPermissionRoute 
                      resource="contatos" 
                      element={<ContactDetail />} 
                    />
                  } 
                />
                
                {/* Pipeline */}
                <Route 
                  path="pipeline" 
                  element={
                    <ProtectedPermissionRoute 
                      resource="pipeline" 
                      element={<PipelineBoard />} 
                    />
                  } 
                />
                
                {/* Oportunidades */}
                <Route 
                  path="oportunidades" 
                  element={
                    <ProtectedPermissionRoute 
                      resource="oportunidades" 
                      element={<OpportunitiesDashboard />} 
                    />
                  } 
                />
                <Route 
                  path="oportunidades/:id" 
                  element={
                    <ProtectedPermissionRoute 
                      resource="oportunidades" 
                      element={<OpportunityDetail />} 
                    />
                  } 
                />
                
                {/* Atividades */}
                <Route 
                  path="atividades" 
                  element={

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
                    <ProtectedPermissionRoute 
                      resource="atividades" 
                      element={<ActivitiesList />} 
                    />
                  } 
                />
                <Route 
                  path="atividades/:id" 
                  element={
                    <ProtectedPermissionRoute 
                      resource="atividades" 
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
                      element={<GenericListWrapper />} 
                    />
                  } 
                />
                
                {/* Campanhas */}
                <Route 
                  path="campanhas" 
                  element={
                    <ProtectedPermissionRoute 
                      resource="campanhas" 
                      element={<GenericListWrapper />} 
                    />
                  } 
                />
                
                {/* Propostas */}
                <Route 
                  path="propostas" 
                  element={
                    <ProtectedPermissionRoute 
                      resource="propostas" 
                      element={<GenericListWrapper />} 
                    />
                  } 
                />
                
                {/* Relatórios */}
                <Route 
                  path="relatorios" 
                  element={
                    <ProtectedPermissionRoute 
                      resource="relatorios" 
                      element={<GenericListWrapper />} 
                    />
                  } 
                />
                
                {/* Contratos */}
                <Route 
                  path="contratos" 
                  element={
                    <ProtectedPermissionRoute 
                      resource="contratos" 
                      element={<GenericListWrapper />} 
                    />
                  } 
                />
                
                {/* Concorrentes */}
                <Route 
                  path="concorrentes" 
                  element={
                    <ProtectedPermissionRoute 
                      resource="concorrentes" 
                      element={<GenericListWrapper />} 
                    />
                  } 
                />
                
                {/* Administração */}
                <Route 
                  path="usuarios" 
                  element={
                    <ProtectedPermissionRoute 
                      resource="configuracoes" 
                      element={<UsersList />} 
                    />
                  } 
                />
                <Route 
                  path="configuracoes" 
                  element={
                    <ProtectedPermissionRoute 
                      resource="configuracoes" 
                      element={<SettingsDashboard />} 
                    />
                  } 
                />
                <Route 
                  path="auditoria" 
                  element={
                    <ProtectedPermissionRoute 
                      resource="configuracoes" 
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
