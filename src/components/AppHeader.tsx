import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bell, Search, User as UserIcon } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import useCrmStore from '@/stores/useCrmStore'
import { useAuth } from '@/hooks/use-auth'

export function AppHeader() {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter((x) => x)
  const { activities, users } = useCrmStore()
  const { signOut, user } = useAuth()

  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const unreadAlerts = activities.filter((a) => a.isOverdue).length
  const currentUser = users.find((u) => u.email === user?.email) || users[0]

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        setIsSearching(true)
        setTimeout(() => setIsSearching(false), 500) // Simulate search
      }
    }, 500)
    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="hidden md:block">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Início</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {pathnames.map((value, index) => {
                const to = `/${pathnames.slice(0, index + 1).join('/')}`
                const isLast = index === pathnames.length - 1
                return (
                  <div key={to} className="flex items-center gap-2 text-sm">
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage className="capitalize">{value}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild className="capitalize">
                          <Link to={to}>{value}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </div>
                )
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden w-64 md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Busca global..."
            className="w-full bg-muted/50 pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {isSearching && (
            <span className="absolute right-3 top-2.5 text-xs text-muted-foreground animate-pulse">
              Buscando...
            </span>
          )}
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadAlerts > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 h-5 w-5 justify-center rounded-full p-0 text-[10px]"
                >
                  {unreadAlerts}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Central de Notificações</SheetTitle>
            </SheetHeader>
            <div className="mt-4 space-y-4">
              {activities
                .filter((a) => a.isOverdue)
                .map((a) => (
                  <div
                    key={a.id}
                    className="rounded-lg border p-3 text-sm shadow-subtle border-destructive/20 bg-destructive/5"
                  >
                    <div className="font-semibold text-destructive">Atrasado: {a.type}</div>
                    <div className="text-muted-foreground">{a.summary}</div>
                  </div>
                ))}
              {unreadAlerts === 0 && (
                <p className="text-sm text-muted-foreground text-center mt-10">Tudo em dia!</p>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full bg-muted">
              <Avatar className="w-8 h-8 border">
                <AvatarImage src={currentUser?.avatarUrl} className="object-cover" />
                <AvatarFallback>
                  <UserIcon className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{currentUser?.name || 'Minha Conta'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/meu-perfil" className="w-full cursor-pointer">
                Perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/configuracoes" className="w-full cursor-pointer">
                Configurações
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive cursor-pointer" onClick={() => signOut()}>
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
