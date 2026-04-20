import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Label } from '@/components/ui/label'

// ============================================================
// CONVENCAO: todas as chaves de acao em INGLES
// Alinhadas com use-rbac.ts: 'view' | 'create' | 'edit' | 'delete'
// ============================================================

const CRUD_MODULES = [
  { key: 'leads', label: 'Leads', scope: true },
  { key: 'opportunities', label: 'Oportunidades', scope: true },
  { key: 'contacts', label: 'Contatos', scope: true },
  { key: 'accounts', label: 'Contas', scope: true },
  { key: 'activities', label: 'Atividades', scope: true },
  { key: 'proposals', label: 'Propostas', scope: true },
  { key: 'tickets', label: 'Tickets', scope: true },
  { key: 'campaigns', label: 'Campanhas', scope: false },
  { key: 'competitors', label: 'Concorrentes', scope: false },
  { key: 'distributors', label: 'Distribuidores', scope: false },
]

const ADVANCED_PERMS = [
  { key: 'view_financial_values', label: 'Ver Valores Financeiros' },
  { key: 'export_data', label: 'Exportar Dados' },
  { key: 'access_advanced_reports', label: 'Relatorios Avancados' },
  { key: 'manage_tags', label: 'Gerenciar Tags' },
  { key: 'view_audit', label: 'Visualizar Auditoria' },
  { key: 'assign_records', label: 'Atribuir Registros' },
  { key: 'bulk_delete', label: 'Exclusao em Massa' },
  { key: 'import_data', label: 'Importar Dados' },
]

export function PermissionsMatrixEditor({ value, onChange }: any) {
  const updateModule = (mod: string, field: string, val: any) => {
    onChange({ ...value, [mod]: { ...(value[mod] || {}), [field]: val } })
  }

  const updateAdvanced = (field: string, val: boolean) => {
    onChange({ ...value, advanced: { ...(value.advanced || {}), [field]: val } })
  }

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h3 className="text-lg font-semibold mb-3">Permissoes de Modulos (CRUD)</h3>
        <div className="border rounded-md overflow-x-auto bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Modulo</TableHead>
                <TableHead className="text-center">Visualizar</TableHead>
                <TableHead className="text-center">Criar</TableHead>
                <TableHead className="text-center">Editar</TableHead>
                <TableHead className="text-center">Excluir</TableHead>
                <TableHead>Escopo de Visao</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CRUD_MODULES.map((m) => (
                <TableRow key={m.key} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{m.label}</TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={value[m.key]?.view || false}
                      onCheckedChange={(v) => updateModule(m.key, 'view', v)}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={value[m.key]?.create || false}
                      onCheckedChange={(v) => updateModule(m.key, 'create', v)}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={value[m.key]?.edit || false}
                      onCheckedChange={(v) => updateModule(m.key, 'edit', v)}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={value[m.key]?.delete || false}
                      onCheckedChange={(v) => updateModule(m.key, 'delete', v)}
                    />
                  </TableCell>
                  <TableCell>
                    {m.scope ? (
                      <Select
                        value={value[m.key]?.scope || 'own'}
                        onValueChange={(v) => updateModule(m.key, 'scope', v)}
                      >
                        <SelectTrigger className="w-[140px] h-8 text-xs bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tudo (Global)</SelectItem>
                          <SelectItem value="team">Sua Equipe</SelectItem>
                          <SelectItem value="own">Apenas Proprio</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className="text-muted-foreground text-xs italic">- N/A -</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Permissoes Avancadas e Sistema</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-muted/20 p-5 rounded-xl border">
          {ADVANCED_PERMS.map((p) => (
            <div
              key={p.key}
              className="flex items-center justify-between space-x-2 bg-background p-3 rounded-lg border shadow-sm"
            >
              <Label
                htmlFor={`adv-${p.key}`}
                className="text-sm font-medium leading-none cursor-pointer"
              >
                {p.label}
              </Label>
              <Switch
                id={`adv-${p.key}`}
                checked={value.advanced?.[p.key] || false}
                onCheckedChange={(v) => updateAdvanced(p.key, v)}
              />
            </div>
          ))}

          <div className="flex items-center justify-between space-x-2 bg-background p-3 rounded-lg border shadow-sm col-span-1 sm:col-span-2 lg:col-span-3 mt-2 border-primary/20 bg-primary/5">
            <div className="flex flex-col">
              <Label htmlFor="adv-manage-users" className="text-sm font-bold">
                Gestao de Usuarios e Perfis
              </Label>
              <span className="text-xs text-muted-foreground mt-1">
                Permite criar, editar e excluir usuarios e matrizes de permissao.
              </span>
            </div>
            <Switch
              id="adv-manage-users"
              checked={value.settings?.manage_users || false}
              onCheckedChange={(v) => {
                onChange({
                  ...value,
                  settings: {
                    ...(value.settings || {}),
                    view: v || (value.settings?.view ?? false),
                    manage_users: v,
                    manage_profiles: v,
                  },
                })
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
