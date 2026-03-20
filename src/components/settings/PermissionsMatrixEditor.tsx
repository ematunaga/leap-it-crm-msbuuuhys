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

const CRUD_MODULES = [
  { key: 'leads', label: 'Leads', scope: true },
  { key: 'opportunities', label: 'Oportunidades', scope: true },
  { key: 'contacts', label: 'Contatos', scope: true },
  { key: 'accounts', label: 'Contas', scope: true },
  { key: 'proposals', label: 'Propostas', scope: true },
  { key: 'tickets', label: 'Tickets', scope: true },
  { key: 'campaigns', label: 'Campanhas', scope: false },
  { key: 'competitors', label: 'Concorrentes', scope: false },
  { key: 'distributors', label: 'Distribuidores', scope: false },
]

const ADVANCED_PERMS = [
  { key: 'visualizar_valores_financeiros', label: 'Ver Valores Financeiros' },
  { key: 'exportar_dados', label: 'Exportar Dados' },
  { key: 'acessar_relatorios_avancados', label: 'Relatórios Avançados' },
  { key: 'gerenciar_tags', label: 'Gerenciar Tags' },
  { key: 'visualizar_auditoria', label: 'Visualizar Auditoria' },
  { key: 'atribuir_registros', label: 'Atribuir Registros' },
  { key: 'excluir_em_massa', label: 'Exclusão em Massa' },
  { key: 'importar_dados', label: 'Importar Dados' },
]

export function PermissionsMatrixEditor({ value, onChange }: any) {
  const updateModule = (mod: string, field: string, val: any) => {
    onChange({ ...value, [mod]: { ...(value[mod] || {}), [field]: val } })
  }

  const updateAdvanced = (field: string, val: boolean) => {
    onChange({ ...value, avancadas: { ...(value.avancadas || {}), [field]: val } })
  }

  return (
    <div className="space-y-8 pb-8">
      <div>
        <h3 className="text-lg font-semibold mb-3">Permissões de Módulos (CRUD)</h3>
        <div className="border rounded-md overflow-x-auto bg-card">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Módulo</TableHead>
                <TableHead className="text-center">Visualizar</TableHead>
                <TableHead className="text-center">Criar</TableHead>
                <TableHead className="text-center">Editar</TableHead>
                <TableHead className="text-center">Excluir</TableHead>
                <TableHead>Escopo de Visão</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CRUD_MODULES.map((m) => (
                <TableRow key={m.key} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{m.label}</TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={value[m.key]?.visualizar || false}
                      onCheckedChange={(v) => updateModule(m.key, 'visualizar', v)}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={value[m.key]?.criar || false}
                      onCheckedChange={(v) => updateModule(m.key, 'criar', v)}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={value[m.key]?.editar || false}
                      onCheckedChange={(v) => updateModule(m.key, 'editar', v)}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={value[m.key]?.excluir || false}
                      onCheckedChange={(v) => updateModule(m.key, 'excluir', v)}
                    />
                  </TableCell>
                  <TableCell>
                    {m.scope ? (
                      <Select
                        value={value[m.key]?.escopo || 'proprio'}
                        onValueChange={(v) => updateModule(m.key, 'escopo', v)}
                      >
                        <SelectTrigger className="w-[140px] h-8 text-xs bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tudo">Tudo (Global)</SelectItem>
                          <SelectItem value="equipe">Sua Equipe</SelectItem>
                          <SelectItem value="proprio">Apenas Próprio</SelectItem>
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
        <h3 className="text-lg font-semibold mb-3">Permissões Avançadas e Sistema</h3>
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
                checked={value.avancadas?.[p.key] || false}
                onCheckedChange={(v) => updateAdvanced(p.key, v)}
              />
            </div>
          ))}
          <div className="flex items-center justify-between space-x-2 bg-background p-3 rounded-lg border shadow-sm col-span-1 sm:col-span-2 lg:col-span-3 mt-2 border-primary/20 bg-primary/5">
            <div className="flex flex-col">
              <Label htmlFor="adv-gerenciar-usuarios" className="text-sm font-bold">
                Gestão de Usuários e Perfis
              </Label>
              <span className="text-xs text-muted-foreground mt-1">
                Permite criar, editar e excluir usuários e matrizes de permissão.
              </span>
            </div>
            <Switch
              id="adv-gerenciar-usuarios"
              checked={value.settings?.gerenciar_usuarios || false}
              onCheckedChange={(v) => {
                onChange({
                  ...value,
                  settings: {
                    ...(value.settings || {}),
                    gerenciar_usuarios: v,
                    gerenciar_perfis: v,
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
