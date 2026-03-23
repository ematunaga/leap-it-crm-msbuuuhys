import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProfilesList from './ProfilesList'
import UsersList from '../users/UsersList'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Database, HardDriveDownload } from 'lucide-react'
import useCrmStore from '@/stores/useCrmStore'
import { useToast } from '@/hooks/use-toast'
import { useRbac } from '@/hooks/use-rbac'
import { AccessDenied } from '@/components/AccessDenied'
import { RequirePermission } from '@/components/RequirePermission'

export default function SettingsDashboard() {
  const { accounts, contacts, opps, activities } = useCrmStore()
  const { toast } = useToast()
  const { can, permissions } = useRbac()

  if (!can('settings', 'visualizar')) return <AccessDenied />

  const handleExportCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) {
      toast({ title: `Nenhum dado para exportar em ${filename}`, variant: 'destructive' })
      return
    }

    const headers = Object.keys(data[0]).join(',')
    const rows = data.map((row) =>
      Object.values(row)
        .map((val) => `"${String(val).replace(/"/g, '""')}"`)
        .join(','),
    )

    const csvContent = [headers, ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({ title: `Exportação de ${filename} concluída com sucesso!` })
  }

  const handleFullBackup = () => {
    const backupData = {
      accounts,
      contacts,
      opportunities: opps,
      activities,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute(
      'download',
      `leapit_crm_backup_${new Date().toISOString().split('T')[0]}.json`,
    )
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: 'Backup Completo Concluído',
      description: 'Todos os seus dados foram exportados em formato JSON.',
    })
  }

  const canManageProfiles =
    !!permissions.settings?.gerenciar_perfis || permissions?.settings?.gerenciar_usuarios

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configurações do Sistema</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie perfis, permissões e parâmetros da plataforma.
          </p>
        </div>
      </div>

      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="bg-muted w-full sm:w-auto flex overflow-x-auto justify-start h-auto p-1">
          <TabsTrigger value="geral" className="px-4 py-2">
            Geral & Dados
          </TabsTrigger>
          {canManageProfiles && (
            <TabsTrigger value="perfis" className="px-4 py-2">
              Perfis de Acesso (RBAC)
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="geral" className="mt-6 space-y-6">
          <Card className="shadow-subtle border-primary/20">
            <CardHeader className="bg-primary/5 border-b pb-4">
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" /> Banco de Dados & Exportação
              </CardTitle>
              <CardDescription>
                Seus dados estão seguros e sincronizados em tempo real com a nuvem (Supabase).
                Utilize as opções abaixo para gerar cópias de segurança locais.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4 border p-5 rounded-xl bg-card">
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <Download className="w-4 h-4 text-muted-foreground" /> Exportar Planilhas
                      (CSV)
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Baixe dados específicos em formato de planilha para análise externa.
                    </p>
                  </div>
                  <RequirePermission
                    module="settings"
                    action="exportar"
                    fallback={
                      <p className="text-xs text-muted-foreground mt-2 italic">
                        Você não possui permissão para exportar dados.
                      </p>
                    }
                  >
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportCSV(accounts, 'Contas')}
                      >
                        Contas
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportCSV(contacts, 'Contatos')}
                      >
                        Contatos
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportCSV(opps, 'Oportunidades')}
                      >
                        Oportunidades
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExportCSV(activities, 'Atividades')}
                      >
                        Atividades
                      </Button>
                    </div>
                  </RequirePermission>
                </div>

                <div className="space-y-4 border p-5 rounded-xl bg-card">
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <HardDriveDownload className="w-4 h-4 text-muted-foreground" /> Backup
                      Completo
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Gere um arquivo estruturado (JSON) com todos os dados do seu CRM para
                      segurança.
                    </p>
                  </div>
                  <RequirePermission
                    module="settings"
                    action="exportar"
                    fallback={
                      <p className="text-xs text-muted-foreground mt-2 italic">
                        Acesso restrito a administradores.
                      </p>
                    }
                  >
                    <div>
                      <Button onClick={handleFullBackup} className="w-full sm:w-auto">
                        Baixar Backup Completo (.JSON)
                      </Button>
                    </div>
                  </RequirePermission>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {canManageProfiles && (
          <TabsContent value="perfis" className="mt-6">
            <ProfilesList />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
