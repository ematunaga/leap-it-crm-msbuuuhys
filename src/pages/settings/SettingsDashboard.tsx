import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProfilesList from './ProfilesList'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Download, Database, HardDriveDownload, UploadCloud, History } from 'lucide-react'
import useCrmStore from '@/stores/useCrmStore'
import { useToast } from '@/hooks/use-toast'
import { useRBAC } from '@/hooks/use-rbac'
import { AccessDenied } from '@/components/AccessDenied'
import { RequirePermission } from '@/components/RequirePermission'

export default function SettingsDashboard() {
  const {
    accounts,
    contacts,
    opps,
    activities,
    stakeholders,
    restoreBackup,
    localSnapshots,
    restoreLocalSnapshot,
  } = useCrmStore()
  const { toast } = useToast()
  const { can, permissions } = useRBAC()
  const [isRestoring, setIsRestoring] = useState(false)

  if (!can('settings', 'visualizar')) return <AccessDenied />

  const handleRestoreFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (event) => {
      try {
        setIsRestoring(true)
        const data = JSON.parse(event.target?.result as string)
        await restoreBackup(data)
      } catch (err) {
        toast({
          title: 'Arquivo inválido',
          description: 'O arquivo de backup não pôde ser lido corretamente.',
          variant: 'destructive',
        })
      } finally {
        setIsRestoring(false)
        // Reset file input
        e.target.value = ''
      }
    }
    reader.readAsText(file)
  }

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
      stakeholders,
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
                <Database className="w-5 h-5 text-primary" /> Banco de Dados & Restauração
              </CardTitle>
              <CardDescription>
                Exporte planilhas ou arquivos de segurança do sistema. Utilize a restauração para
                recuperar dados sem afetar as funcionalidades (código) implementadas após a
                publicação.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Exportar CSV */}
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

                {/* Backup Completo */}
                <div className="space-y-4 border p-5 rounded-xl bg-card">
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <HardDriveDownload className="w-4 h-4 text-muted-foreground" /> Exportar
                      Backup Seguro
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Gere um arquivo estruturado (.json) com todos os dados do seu CRM para
                      segurança e posterior restauração.
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
                        Baixar Backup (.JSON)
                      </Button>
                    </div>
                  </RequirePermission>
                </div>

                {/* Importar Backup */}
                <div className="space-y-4 border p-5 rounded-xl bg-card">
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <UploadCloud className="w-4 h-4 text-muted-foreground" /> Importar Backup
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Restaure seus dados a partir de um arquivo JSON. O desenvolvimento e as novas
                      funcionalidades permanecerão intactos.
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
                    <div className="flex flex-col gap-3">
                      <Input
                        type="file"
                        accept=".json"
                        onChange={handleRestoreFile}
                        disabled={isRestoring}
                        className="cursor-pointer"
                      />
                      <p className="text-[10px] text-muted-foreground">
                        Nota: Isso fará um "upsert" dos dados (atualizará os existentes e criará os
                        ausentes).
                      </p>
                    </div>
                  </RequirePermission>
                </div>

                {/* Histórico Local (Autosave) */}
                <div className="space-y-4 border p-5 rounded-xl bg-card sm:col-span-2">
                  <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2">
                      <History className="w-4 h-4 text-muted-foreground" /> Histórico de Autosave
                      (Navegador)
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      O sistema salva snapshots automáticos no armazenamento local. Útil para
                      reverter perdas imediatas após uma atualização do sistema sem perder o código.
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
                    {localSnapshots.length === 0 ? (
                      <p className="text-sm text-muted-foreground border border-dashed p-4 rounded-lg text-center bg-muted/20">
                        Nenhum snapshot local disponível neste dispositivo.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {localSnapshots
                          .slice()
                          .reverse()
                          .map((snap) => (
                            <div
                              key={snap.id}
                              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-muted/30 p-3 rounded-lg border"
                            >
                              <div>
                                <p className="font-medium text-sm">Backup Automático Local</p>
                                <p className="text-xs text-muted-foreground">
                                  Salvo em: {new Date(snap.timestamp).toLocaleString('pt-BR')}
                                </p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      'Tem certeza que deseja restaurar os dados deste snapshot? Isso sobrescreverá os dados atuais do banco.',
                                    )
                                  ) {
                                    setIsRestoring(true)
                                    restoreLocalSnapshot(snap.id).finally(() =>
                                      setIsRestoring(false),
                                    )
                                  }
                                }}
                                disabled={isRestoring}
                              >
                                {isRestoring ? 'Restaurando...' : 'Restaurar Dados'}
                              </Button>
                            </div>
                          ))}
                      </div>
                    )}
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
