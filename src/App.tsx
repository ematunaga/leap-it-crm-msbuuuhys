import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import Layout from './components/Layout'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import AccountsList from './pages/accounts/AccountsList'
import AccountDetail from './pages/accounts/AccountDetail'
import ContactsList from './pages/contacts/ContactsList'
import ContactDetail from './pages/contacts/ContactDetail'
import PipelineBoard from './pages/pipeline/PipelineBoard'
import OpportunitiesDashboard from './pages/opportunities/OpportunitiesDashboard'
import OpportunityDetail from './pages/opportunities/OpportunityDetail'
import ActivitiesList from './pages/activities/ActivitiesList'
import ActivityDetail from './pages/activities/ActivityDetail'
import GenericListWrapper from './pages/shared/GenericListWrapper'
import SettingsDashboard from './pages/settings/SettingsDashboard'
import { CrmProvider } from './stores/useCrmStore'

const App = () => (
  <BrowserRouter future={{ v7_startTransition: false, v7_relativeSplatPath: false }}>
    <CrmProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Index />} />
            <Route path="/contas" element={<AccountsList />} />
            <Route path="/contas/:id" element={<AccountDetail />} />

            <Route path="/contatos" element={<ContactsList />} />
            <Route path="/contatos/:id" element={<ContactDetail />} />

            <Route path="/oportunidades" element={<OpportunitiesDashboard />} />
            <Route path="/pipeline" element={<PipelineBoard />} />
            <Route path="/oportunidades/:id" element={<OpportunityDetail />} />

            <Route path="/atividades" element={<ActivitiesList />} />
            <Route path="/atividades/:id" element={<ActivityDetail />} />

            {/* Configuracoes / Admin */}
            <Route path="/configuracoes" element={<SettingsDashboard />} />

            {/* Generics */}
            <Route path="/leads" element={<GenericListWrapper />} />
            <Route path="/concorrentes" element={<GenericListWrapper />} />
            <Route path="/contratos" element={<GenericListWrapper />} />
            <Route path="/campanhas" element={<GenericListWrapper />} />
            <Route path="/propostas" element={<GenericListWrapper />} />
            <Route path="/relatorios" element={<GenericListWrapper />} />
            <Route path="/usuarios" element={<GenericListWrapper />} />
            <Route path="/auditoria" element={<GenericListWrapper />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </CrmProvider>
  </BrowserRouter>
)

export default App
