import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ProfilesList from './ProfilesList'
import { Card, CardContent } from '@/components/ui/card'

export default function SettingsDashboard() {
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

      <Tabs defaultValue="perfis" className="w-full">
        <TabsList className="bg-muted w-full sm:w-auto flex overflow-x-auto justify-start h-auto p-1">
          <TabsTrigger value="geral" className="px-4 py-2">
            Geral
          </TabsTrigger>
          <TabsTrigger value="perfis" className="px-4 py-2">
            Perfis de Acesso (RBAC)
          </TabsTrigger>
          <TabsTrigger value="usuarios" className="px-4 py-2">
            Usuários e Equipes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="geral" className="mt-6">
          <Card className="shadow-subtle">
            <CardContent className="pt-6 text-center text-muted-foreground py-12">
              Configurações gerais do CRM (em desenvolvimento).
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="perfis" className="mt-6">
          <ProfilesList />
        </TabsContent>

        <TabsContent value="usuarios" className="mt-6">
          <Card className="shadow-subtle">
            <CardContent className="pt-6 text-center text-muted-foreground py-12">
              Gestão de usuários da plataforma (em desenvolvimento).
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
