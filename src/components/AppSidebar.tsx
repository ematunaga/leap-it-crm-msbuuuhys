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
} from 'lucide-react'

interface NavItem {
  title: string
  url: string
  icon: React.ElementType
  resource: string // Mudado de 'module' para 'resource'
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const navigation: NavGroup[] = [
  {
    title: 'Comercial',
    items: [
      { title: 'Dashboard', url: '/', icon: LayoutDashboard, resource: 'dashboard' },
      { title: 'Contas', url: '/contas', icon: Building2, resource: 'accounts' },
      { title: 'Filiais', url: '/filiais', icon: Store, resource: 'accounts' },
      { title: 'Contatos', url: '/contatos', icon: Users, resource: 'contacts' },
      { title: 'Oportunidades', url: '/oportunidades', icon: Briefcase, resource: 'oportunidades' },
      { title: 'Pipeline', url: '/pipeline', icon: GitPullRequest, resource: 'pipeline' },
      { title: 'Atividades', url: '/atividades', icon: Calendar, resource: 'atividades' },
      { title: 'Propostas', url: '/propostas', icon: FileText, resource: 'propostas' },
    ],
  },
  {
    title: 'Inteligência',
    items: [
      { title: 'Concorrentes', url: '/concorrentes', icon: Target, resource: 'concorrentes' },
      { title: 'Relatórios', url: '/relatorios', icon: BarChart2, resource: 'relatorios' },
    ],
  },
  {
    title: 'Operação',
    items: [
      { title: 'Leads', url: '/leads', icon: Filter, resource: 'leads' },
      { title: 'Campanhas', url: '/campanhas', icon: Megaphone, resource: 'campaigns' },
      { title: 'Contratos', url: '/contratos', icon: FileSignature, resource: 'contratos' },
    ],
  },
  {
    title: 'Administração',
    items: [
      { title: 'Usuários', url: '/usuarios', icon: Users, resource: 'configuracoes' },
      { title: 'Configurações', url: '/configuracoes', icon: Settings, resource: 'configuracoes' },
      { title: 'Auditoria', url: '/auditoria', icon: ShieldCheck, resource: 'configuracoes' },
    ],
  },
]

export function AppSidebar() {
  const location = useLocation()
  const { canView, isAdmin } = useRBAC()

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 font-bold text-xl text-sidebar-foreground">
          <div className="bg-primary rounded-md p-1">
            <Target className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="truncate group-data-[collapsible=icon]:hidden">
            LEAP IT CRM
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {navigation.map((group) => {
          // Filtra itens baseado em permissões de recursos
          const visibleItems = group.items.filter((item) => {
            // Dashboard é visível para todos
            if (item.resource === 'dashboard') return true
            // Admin vê tudo
            if (isAdmin()) return true
            // Verifica permissão de visualização do recurso
            return canView(item.resource)
          })

          // Esconde o grupo inteiro se não há itens visíveis
          if (visibleItems.length === 0) return null

          return (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel className="text-sidebar-foreground/50">
                {group.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {visibleItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={location.pathname === item.url}
                        tooltip={item.title}
                      >
                        <Link to={item.url}>
                          <item.icon className="w-4 h-4" />
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
