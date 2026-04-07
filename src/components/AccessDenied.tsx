import { ShieldX } from 'lucide-react'

export function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-muted-foreground py-24">
      <ShieldX className="w-12 h-12 text-destructive" />
      <h2 className="text-xl font-semibold text-foreground">
        Acesso Negado
      </h2>
      <p className="text-sm text-center max-w-sm">
        Você não tem permissão para acessar esta área. Entre em contato
        com o administrador do sistema.
      </p>
    </div>
  )
}