import { Link, useLocation } from 'react-router-dom'
import { useRBAC } from '@/hooks/use-rbac'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar'
import {
  LayoutDashboard,
  Building2,
  Store,
  Users,
  Briefcase,
  GitPullRequest,
  Calendar,
  FileText,
  Target,
  BarChart2,
  Filter,
  Megaphone,
  FileSignature,
  Settings,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'

interface NavItem {
  title: string       // Label PT-BR exibido na interface
  url: string
  icon: React.ElementType
  resource: string    // Chave em ingles - alinhada com o schema do banco
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const navigation: NavGroup[] = [
  {
    title: 'Comercial',
    items: [
      { title: 'Dashboard',      url: '/',              icon: LayoutDashboard, resource: 'dashboard' },
      { title: 'Contas',         url: '/contas',        icon: Building2,       resource: 'accounts' },
      { title: 'Filiais',        url: '/filiais',       icon: Store,           resource: 'accounts' },
      { title: 'Contatos',       url: '/contatos',      icon: Users,           resource: 'contacts' },
      { title: 'Oportunidades',  url: '/oportunidades', icon: Briefcase,       resource: 'opportunities' },
      { title: 'Pipeline',       url: '/pipeline',      icon: GitPullRequest,  resource: 'pipeline' },
      { title: 'Atividades',     url: '/atividades',    icon: Calendar,        resource: 'activities' },
      { title: 'Propostas',      url: '/propostas',     icon: FileText,        resource: 'proposals' },
    ],
  },
  {
    title: 'Inteligencia',
    items: [
      { title: 'Concorrentes', url: '/concorrentes', icon: Target,    resource: 'competitors' },
      { title: 'Relatorios',   url: '/relatorios',   icon: BarChart2, resource: 'reports' },
    ],
  },
  {
    title: 'Operacao',
    items: [
      { title: 'Leads',     url: '/leads',     icon: Filter,        resource: 'leads' },
      { title: 'Campanhas', url: '/campanhas', icon: Megaphone,     resource: 'campaigns' },
      { title: 'Contratos', url: '/contratos', icon: FileSignature, resource: 'contracts' },
    ],
  },
  {
    title: 'Administracao',
    items: [
            { title: 'Usuarios',       url: '/usuarios',       icon: Users,       resource: 'users' },
      { title: 'Configuracoes', url: '/configuracoes', icon: Settings,    resource: 'settings' },
      { title: 'Auditoria',     url: '/auditoria',     icon: ShieldCheck, resource: 'settings' },
    ],
  },
]

export function AppSidebar() {
  const location = useLocation()
  const { canView, isAdmin } = useRBAC()

  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b">
        <span className="font-bold text-lg tracking-tight">LEAP IT CRM</span>
      </SidebarHeader>
      <SidebarContent>
        {navigation.map((group) => {
          const visibleItems = group.items.filter((item) => {
            if (item.resource === 'dashboard') return true
            if (isAdmin()) return true
            return canView(item.resource)
          })
          if (visibleItems.length === 0) return null
          return (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {visibleItems.map((item) => (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === item.url}
                      >
                        <Link to={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )
        })}
      </SidebarContent>
    </Sidebar>
  )
}
