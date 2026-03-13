import { Link, useLocation } from 'react-router-dom'
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
      { title: 'Dashboard', url: '/', icon: LayoutDashboard },
      { title: 'Contas', url: '/contas', icon: Building2 },
      { title: 'Contatos', url: '/contatos', icon: Users },
      { title: 'Oportunidades', url: '/oportunidades', icon: Briefcase },
      { title: 'Pipeline', url: '/pipeline', icon: GitPullRequest },
      { title: 'Atividades', url: '/atividades', icon: Calendar },
      { title: 'Propostas', url: '/propostas', icon: FileText },
    ],
  },
  {
    title: 'Inteligência',
    items: [
      { title: 'Concorrentes', url: '/concorrentes', icon: Target },
      { title: 'Relatórios', url: '/relatorios', icon: BarChart2 },
    ],
  },
  {
    title: 'Operação',
    items: [
      { title: 'Leads', url: '/leads', icon: Filter },
      { title: 'Campanhas', url: '/campanhas', icon: Megaphone },
      { title: 'Contratos', url: '/contratos', icon: FileSignature },
    ],
  },
  {
    title: 'Administração',
    items: [
      { title: 'Usuários', url: '/usuarios', icon: Users },
      { title: 'Configurações', url: '/configuracoes', icon: Settings },
      { title: 'Auditoria', url: '/auditoria', icon: ShieldCheck },
    ],
  },
]

export function AppSidebar() {
  const location = useLocation()

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
        {navigation.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-sidebar-foreground/50">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
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
        ))}
      </SidebarContent>
    </Sidebar>
  )
}
