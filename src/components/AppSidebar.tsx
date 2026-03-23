import { Link, useLocation } from 'react-router-dom'
import { useRbac } from '@/hooks/use-rbac'
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

const navigation = [
  {
    title: 'Comercial',
    items: [
      { title: 'Dashboard', url: '/', icon: LayoutDashboard, module: 'dashboard' },
      { title: 'Contas', url: '/contas', icon: Building2, module: 'accounts' },
      { title: 'Contatos', url: '/contatos', icon: Users, module: 'contacts' },
      { title: 'Oportunidades', url: '/oportunidades', icon: Briefcase, module: 'opportunities' },
      { title: 'Pipeline', url: '/pipeline', icon: GitPullRequest, module: 'opportunities' },
      { title: 'Atividades', url: '/atividades', icon: Calendar, module: 'activities' },
      { title: 'Propostas', url: '/propostas', icon: FileText, module: 'proposals' },
    ],
  },
  {
    title: 'Inteligência',
    items: [
      { title: 'Concorrentes', url: '/concorrentes', icon: Target, module: 'competitors' },
      { title: 'Relatórios', url: '/relatorios', icon: BarChart2, module: 'reports' },
    ],
  },
  {
    title: 'Operação',
    items: [
      { title: 'Leads', url: '/leads', icon: Filter, module: 'leads' },
      { title: 'Campanhas', url: '/campanhas', icon: Megaphone, module: 'campaigns' },
      { title: 'Contratos', url: '/contratos', icon: FileSignature, module: 'contracts' },
    ],
  },
  {
    title: 'Administração',
    items: [
      { title: 'Usuários', url: '/usuarios', icon: Users, module: 'settings' },
      { title: 'Configurações', url: '/configuracoes', icon: Settings, module: 'settings' },
      { title: 'Auditoria', url: '/auditoria', icon: ShieldCheck, module: 'settings' },
    ],
  },
]

export function AppSidebar() {
  const location = useLocation()
  const { can } = useRbac()

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 font-bold text-xl text-sidebar-foreground">
          <div className="bg-primary rounded-md p-1">
            <Target className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="truncate group-data-[collapsible=icon]:hidden">LEAP IT CRM</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navigation.map((group) => {
          // Filter items based on permissions
          const visibleItems = group.items.filter((item) => can(item.module, 'visualizar'))

          // Hide group if no items are visible
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
