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

import GenericListWrapper from './pages/shared/GenericListWrapper'
import SettingsDashboard from './pages/settings/SettingsDashboard'
import UsersList from './pages/users/UsersList'
import UserProfile from './pages/settings/UserProfile'

import { CrmProvider } from './stores/useCrmStore'
import { AuthProvider } from './hooks/use-auth'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/auth/Login'
import UpdatePassword from './pages/auth/UpdatePassword'

import { AccessDenied } from './components/AccessDenied'
import { useRbac } from './hooks/use-rbac'
import type { Module, Action } from './lib/rbac'

// Componente que protege uma rota por módulo + ação
function PrivateRoute({
  module,
  action = 'visualizar',
  element,
}: {
  module: Module
  action?: Action
  element: React.ReactElement
}) {
  const { can } = useRbac()
  return can(module, action) ? element : <AccessDenied />
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

                {/* Dashboard — todos os autenticados */}
                <Route path="/" element={<Index />} />

                {/* Meu perfil — todos os autenticados */}
                <Route path="meu-perfil" element={<UserProfile />} />

                {/* Contas */}
                <Route
                  path="contas"
                  element={
                    <PrivateRoute
                      module="accounts"
                      element={<AccountsList />}
                    />
                  }
                />
                <Route
                  path="contas/:id"
                  element={
                    <PrivateRoute
                      module="accounts"
                      element={<AccountDetail />}
                    />
                  }
                />
                <Route
                  path="filiais"
                  element={
                    <PrivateRoute
                      module="accounts"
                      element={<BranchesReport />}
                    />
                  }
                />

                {/* Contatos */}
                <Route
                  path="contatos"
                  element={
                    <PrivateRoute
                      module="contacts"
                      element={<ContactsList />}
                    />
                  }
                />
                <Route
                  path="contatos/:id"
                  element={
                    <PrivateRoute
                      module="contacts"
                      element={<ContactDetail />}
                    />
                  }
                />

                {/* Pipeline */}
                <Route
                  path="pipeline"
                  element={
                    <PrivateRoute
                      module="opportunities"
                      element={<PipelineBoard />}
                    />
                  }
                />

                {/* Oportunidades */}
                <Route
                  path="oportunidades"
                  element={
                    <PrivateRoute
                      module="opportunities"
                      element={<OpportunitiesDashboard />}
                    />
                  }
                />
                <Route
                  path="oportunidades/:id"
                  element={
                    <PrivateRoute
                      module="opportunities"
                      element={<OpportunityDetail />}
                    />
                  }
                />

                {/* Atividades */}
                <Route
                  path="atividades"
                  element={
                    <PrivateRoute
                      module="activities"
                      element={<ActivitiesList />}
                    />
                  }
                />
                <Route
                  path="atividades/:id"
                  element={
                    <PrivateRoute
                      module="activities"
                      element={<ActivityDetail />}
                    />
                  }
                />

                {/* Propostas */}
                <Route
                  path="propostas"
                  element={
                    <PrivateRoute
                      module="proposals"
                      element={<GenericListWrapper />}
                    />
                  }
                />

                {/* Inteligência */}
                <Route
                  path="concorrentes"
                  element={
                    <PrivateRoute
                      module="competitors"
                      element={<GenericListWrapper />}
                    />
                  }
                />
                <Route
                  path="relatorios"
                  element={
                    <PrivateRoute
                      module="reports"
                      element={<GenericListWrapper />}
                    />
                  }
                />

                {/* Operação */}
                <Route
                  path="leads"
                  element={
                    <PrivateRoute
                      module="leads"
                      element={<GenericListWrapper />}
                    />
                  }
                />
                <Route
                  path="campanhas"
                  element={
                    <PrivateRoute
                      module="campaigns"
                      element={<GenericListWrapper />}
                    />
                  }
                />
                <Route
                  path="contratos"
                  element={
                    <PrivateRoute
                      module="contracts"
                      element={<GenericListWrapper />}
                    />
                  }
                />

                {/* Administração — só admin e gestor */}
                <Route
                  path="usuarios"
                  element={
                    <PrivateRoute
                      module="settings"
                      action="gerenciar_usuarios"
                      element={<UsersList />}
                    />
                  }
                />
                <Route
                  path="configuracoes"
                  element={
                    <PrivateRoute
                      module="settings"
                      element={<SettingsDashboard />}
                    />
                  }
                />
                <Route
                  path="auditoria"
                  element={
                    <PrivateRoute
                      module="settings"
                      action="gerenciar_papeis"
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