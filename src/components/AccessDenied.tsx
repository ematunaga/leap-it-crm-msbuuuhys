import { ShieldAlert } from 'lucide-react'

export function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in h-full">
      <div className="bg-destructive/10 p-5 rounded-full mb-4">
        <ShieldAlert className="w-12 h-12 text-destructive" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight mb-2">Acesso Restrito</h2>
      <p className="text-muted-foreground max-w-md">
        Seu perfil atual não possui permissões suficientes para visualizar esta área do sistema. Por
        favor, contate o administrador caso precise de acesso.
      </p>
    </div>
  )
}
