# Sistema de Permissões RBAC - Guia de Uso

## Visão Geral

O sistema RBAC (Role-Based Access Control) agora está implementado com perfis de acesso dinâmicos.

## Perfis Criados

### 1. Administrador
- **Escopo**: Tudo
- **Permissões**: Acesso completo a todos os recursos
- **is_admin**: true

### 2. Gestor Comercial
- **Escopo**: Tudo
- **Recursos com acesso total**:
  - Oportunidades (view, create, edit, delete)
  - Pipeline (view, create, edit, delete)
  - Atividades (view, create, edit, delete)
  - Contas (view, create, edit)
  - Contatos (view, create, edit)
  - Leads (view, edit)
  - Campanhas (view)

### 3. SDR (Sales Development Representative)
- **Escopo**: Próprio
- **Recursos com acesso total**:
  - Leads (view, create, edit, delete)
  - Contas (view, create, edit)
  - Contatos (view, create, edit, delete)
  - Campanhas (view, create, edit)
  - Atividades (view, create, edit)

### 4. Vendedor
- **Escopo**: Próprio
- **Recursos com acesso**:
  - Oportunidades (view, create, edit)
  - Contas (view, create, edit)
  - Contatos (view, create, edit)
  - Leads (view, edit)
  - Atividades (view, create, edit, delete)
  - Pipeline (view)

## Como Usar no Frontend

### 1. Hook useRBAC

```tsx
import { useRBAC } from '@/hooks/use-rbac'

function MeuComponente() {
  const { 
    canView, 
    canCreate, 
    canEdit, 
    canDelete,
    isAdmin,
    getScope,
    profile,
    loading 
  } = useRBAC()

  if (loading) return <div>Carregando...</div>

  // Verificar permissões
  const podeVerOportunidades = canView('oportunidades')
  const podeCriarLeads = canCreate('leads')
  const podeEditarContas = canEdit('contas')
  const podeDeletarAtividades = canDelete('atividades')

  return (
    <div>
      {podeVerOportunidades && <OpportunityList />}
      {podeCriarLeads && <CreateLeadButton />}
    </div>
  )
}
```

### 2. Componente RequirePermission

```tsx
import { RequirePermission } from '@/components/RequirePermission'

function MinhaPágina() {
  return (
    <div>
      {/* Mostrar apenas se tiver permissão de visualizar */}
      <RequirePermission 
        resource="oportunidades" 
        action="view"
        fallback={<p>Sem permissão</p>}
      >
        <OpportunityList />
      </RequirePermission>

      {/* Botão de criar apenas para quem pode criar */}
      <RequirePermission 
        resource="leads" 
        action="create"
      >
        <button>Criar Novo Lead</button>
      </RequirePermission>

      {/* Área de edição */}
      <RequirePermission 
        resource="contas" 
        action="edit"
      >
        <EditAccountForm />
      </RequirePermission>

      {/* Botão de deletar */}
      <RequirePermission 
        resource="atividades" 
        action="delete"
      >
        <button>Deletar Atividade</button>
      </RequirePermission>
    </div>
  )
}
```

### 3. Exemplos de Uso Avançado

```tsx
function DashboardPage() {
  const { isAdmin, getScope, profile } = useRBAC()

  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Mostrar mensagem baseada no perfil */}
      <p>Perfil: {profile?.nome}</p>
      <p>Escopo: {getScope()}</p>
      
      {/* Seção exclusiva para admins */}
      {isAdmin() && (
        <AdminPanel />
      )}

      {/* Cards baseados em permissões */}
      <RequirePermission resource="oportunidades" action="view">
        <OpportunitiesCard />
      </RequirePermission>

      <RequirePermission resource="leads" action="view">
        <LeadsCard />
      </RequirePermission>

      <RequirePermission resource="contas" action="view">
        <AccountsCard />
      </RequirePermission>
    </div>
  )
}
```

### 4. Recursos Disponíveis

Recursos que podem ser verificados:
- `leads`
- `contas`
- `contatos`
- `oportunidades`
- `atividades`
- `pipeline`
- `campanhas`
- `relatorios`
- `configuracoes`

### 5. Ações Disponíveis

- `view`: Visualizar
- `create`: Criar
- `edit`: Editar
- `delete`: Deletar

## Configurar Perfil do Usuário

Para atribuir um perfil a um usuário:

```sql
UPDATE app_users 
SET access_profile_id = '[ID_DO_PERFIL]'
WHERE id = '[ID_DO_USUARIO]';
```

IDs dos perfis:
- Administrador: Consultar na tabela `access_profiles`
- Gestor Comercial: Consultar na tabela `access_profiles`
- SDR: Consultar na tabela `access_profiles`
- Vendedor: Consultar na tabela `access_profiles`

## Próximos Passos

1. Implementar UI de gerenciamento de perfis (apenas para Admin)
2. Permitir Admin criar perfis personalizados
3. Implementar sistema de equipes para escopo "equipe"
4. Adicionar logs de auditoria de permissões
