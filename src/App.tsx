import { BrowserRouter, Routes, Route } from 'react-router-dom'
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

const App = () => (
  <AuthProvider>
    <CrmProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <TooltipProvider>
          <Sonner />
          <Toaster />

          <Routes>
            {/* Rotas públicas (sem menu) */}
            <Route path="/login" element={<Login />} />
            <Route path="/update-password" element={<UpdatePassword />} />

            {/* Rotas protegidas (com Layout e menu lateral) */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                {/* Dashboard inicial */}
                <Route path="/" element={<Index />} />

                {/* Contas */}
                <Route path="contas" element={<AccountsList />} />
                <Route path="contas/:id" element={<AccountDetail />} />
                <Route path="filiais" element={<BranchesReport />} />

                {/* Contatos */}
                <Route path="contatos" element={<ContactsList />} />
                <Route path="contatos/:id" element={<ContactDetail />} />

                {/* Pipeline */}
                <Route path="pipeline" element={<PipelineBoard />} />

                {/* Oportunidades */}
                <Route
                  path="oportunidades"
                  element={<OpportunitiesDashboard />}
                />
                <Route
                  path="oportunidades/:id"
                  element={<OpportunityDetail />}
                />

                {/* Atividades */}
                <Route path="atividades" element={<ActivitiesList />} />
                <Route path="atividades/:id" element={<ActivityDetail />} />

                {/* Administração / Segurança */}
                <Route path="usuarios" element={<UsersList />} />
                <Route path="configuracoes" element={<SettingsDashboard />} />
                <Route path="meu-perfil" element={<UserProfile />} />

                {/* Generics (listas dinâmicas) */}
                <Route path="leads" element={<GenericListWrapper />} />
                <Route path="concorrentes" element={<GenericListWrapper />} />
                <Route path="contratos" element={<GenericListWrapper />} />
                <Route path="campanhas" element={<GenericListWrapper />} />
                <Route path="propostas" element={<GenericListWrapper />} />
                <Route path="relatorios" element={<GenericListWrapper />} />
                <Route path="auditoria" element={<GenericListWrapper />} />
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