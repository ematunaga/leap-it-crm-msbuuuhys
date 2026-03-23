import { Link, useParams } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import useCrmStore from '@/stores/useCrmStore'
import { formatDate, formatMoney } from '@/lib/utils'
import { ContactForm } from '@/components/contacts/ContactForm'
import { OpportunityForm } from '@/components/opportunities/OpportunityForm'
import { ActivityForm } from '@/components/activities/ActivityForm'
import { AccountForm } from '@/components/accounts/AccountForm'
import NotFound from '../NotFound'
import { Plus, Edit } from 'lucide-react'
import { useState } from 'react'
import { useRbac } from '@/hooks/use-rbac'
import { AccessDenied } from '@/components/AccessDenied'
import { RequirePermission } from '@/components/RequirePermission'

export default function AccountDetail() {
  const { id } = useParams()
  const { accounts, contacts, activities, opps } = useCrmStore()
  const [openEdit, setOpenEdit] = useState(false)
  const [openOpp, setOpenOpp] = useState(false)
  const [openContact, setOpenContact] = useState(false)
  const [openActivity, setOpenActivity] = useState(false)

  const { can } = useRbac()

  if (!can('accounts', 'visualizar')) return <AccessDenied />

  const account = accounts.find((a) => a.id === id)
  if (!account) return <NotFound />

  const accContacts = contacts.filter((c) => c.accountId === id)
  const accActivities = activities.filter((a) => a.relatedTo === 'Account' && a.relatedId === id)
  const accOpps = opps.filter((o) => o.accountId === id)

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex items-start justify-between border-b pb-6">
        <div className="flex items-center gap-4">
          <img
            src={account.logo || 'https://img.usecurling.com/i?q=company&shape=fill&color=gray'}
            alt={account.name}
            className="w-16 h-16 rounded-xl border bg-white p-2 object-contain shadow-sm"
          />
          <div>
            <h1 className="text-3xl font-bold">{account.name}</h1>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="outline" className="capitalize">
                {account.segment || 'Sem Segmento'}
              </Badge>
              <Badge variant="secondary" className="capitalize">
                Tier {account.accountTier || 'N/A'}
              </Badge>
              <Badge variant="outline" className="capitalize bg-muted">
                {account.status}
              </Badge>
              {account.cnpj && (
                <Badge variant="outline" className="font-mono">
                  {account.cnpj}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <RequirePermission module="accounts" action="editar">
          <Dialog open={openEdit} onOpenChange={setOpenEdit}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" /> Editar Conta
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Editar Conta</DialogTitle>
              </DialogHeader>
              <div className="pt-2">
                <AccountForm initialData={account} onSuccess={() => setOpenEdit(false)} />
              </div>
            </DialogContent>
          </Dialog>
        </RequirePermission>
      </div>

      <Tabs defaultValue="360" className="w-full">
        <TabsList className="bg-muted flex flex-wrap h-auto w-full justify-start gap-1 p-1">
          <TabsTrigger value="360">Visão 360º</TabsTrigger>
          <TabsTrigger value="branches">Filiais ({account.branches?.length || 0})</TabsTrigger>
          {can('opportunities', 'visualizar') && (
            <TabsTrigger value="opportunities">Oportunidades ({accOpps.length})</TabsTrigger>
          )}
          {can('contacts', 'visualizar') && (
            <TabsTrigger value="contacts">Contatos ({accContacts.length})</TabsTrigger>
          )}
          {can('activities', 'visualizar') && (
            <TabsTrigger value="timeline">Atividades ({accActivities.length})</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="360" className="mt-4 space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="shadow-subtle">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Cadastro & Identificação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-x-2 gap-y-3">
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                      Razão Social
                    </p>
                    <p className="font-medium">{account.name}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                      Nome Fantasia
                    </p>
                    <p className="font-medium">{account.tradingName || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                      CNPJ
                    </p>
                    <p className="font-medium font-mono">{account.cnpj || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                      Insc. Estadual
                    </p>
                    <p className="font-medium font-mono">{account.stateRegistration || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                      Segmento
                    </p>
                    <p className="font-medium capitalize">{account.segment || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                      Porte
                    </p>
                    <p className="font-medium">{account.porte || '-'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-subtle">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Contato Principal & Sede</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-x-2 gap-y-3">
                  <div>
                    <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                      E-mail
                    </p>
                    <p className="font-medium">{account.email || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                      Telefone
                    </p>
                    <p className="font-medium">{account.phone || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                      Website
                    </p>
                    <p className="font-medium">{account.website || '-'}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                      LinkedIn
                    </p>
                    <p className="font-medium">{account.linkedin || '-'}</p>
                  </div>
                  <div className="col-span-2 pt-1 border-t">
                    <p className="text-muted-foreground text-[11px] uppercase font-semibold mb-1">
                      Endereço (Sede)
                    </p>
                    <p className="font-medium">
                      {account.headquartersAddress ? (
                        <>
                          {account.headquartersAddress} <br /> {account.headquartersCity}/
                          {account.headquartersState} - CEP {account.headquartersZip}
                        </>
                      ) : (
                        '-'
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-subtle md:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Relacionamento & Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-muted/30 p-3 rounded-lg border">
                    <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                      Saúde da Conta
                    </p>
                    <p className="font-semibold text-base mt-1 capitalize">
                      {account.accountHealth?.replace('_', ' ') || '-'}
                    </p>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg border">
                    <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                      Status Relac.
                    </p>
                    <p className="font-semibold text-base mt-1 capitalize">
                      {account.relationshipStatus?.replace('_', ' ') || '-'}
                    </p>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg border">
                    <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                      Tier
                    </p>
                    <p className="font-semibold text-base mt-1 capitalize">
                      {account.accountTier || '-'}
                    </p>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-lg border">
                    <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                      Potencial
                    </p>
                    <p className="font-semibold text-base mt-1 font-mono">
                      {account.accountPotential ? formatMoney(account.accountPotential) : '-'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-subtle md:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Análise Estratégica</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="flex flex-col gap-2">
                  <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                    Dor Principal
                  </p>
                  <div className="bg-muted/30 p-3 rounded border h-full">
                    {account.mainPain || (
                      <span className="text-muted-foreground italic">Não identificada</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                    Stack / Ambiente
                  </p>
                  <div className="bg-muted/30 p-3 rounded border h-full">
                    {account.currentEnvironment || (
                      <span className="text-muted-foreground italic">Não informado</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-muted-foreground text-[11px] uppercase font-semibold">
                    White Space (Expansão)
                  </p>
                  <div className="bg-muted/30 p-3 rounded border h-full">
                    {account.whiteSpaceNotes || (
                      <span className="text-muted-foreground italic">Sem anotações</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="branches" className="mt-4">
          {account.branches && account.branches.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {account.branches.map((b, i) => (
                <Card key={i} className="shadow-subtle relative">
                  <CardContent className="pt-6 space-y-2">
                    <Badge variant="secondary" className="absolute top-4 right-4">
                      Filial {i + 1}
                    </Badge>
                    <div>
                      <p className="font-bold text-base">
                        {b.name || 'Razão Social não informada'}
                      </p>
                      <p className="text-sm text-muted-foreground mb-3">{b.tradingName || '-'}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <p className="text-[10px] uppercase font-semibold text-muted-foreground">
                          CNPJ
                        </p>
                        <p className="text-sm font-mono">{b.cnpj || '-'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-semibold text-muted-foreground">
                          Insc. Estadual
                        </p>
                        <p className="text-sm font-mono">{b.ie || '-'}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t">
                      <p className="text-[10px] uppercase font-semibold text-muted-foreground mb-1">
                        Endereço Completo
                      </p>
                      <p className="text-sm font-medium">{b.address || 'Sem logradouro'}</p>
                      <p className="text-sm text-muted-foreground">
                        {b.neighborhood && `${b.neighborhood}, `}
                        {b.city} {b.state ? `- ${b.state}` : ''} {b.zip ? `| CEP: ${b.zip}` : ''}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center border rounded-xl bg-card text-muted-foreground shadow-subtle">
              Nenhuma filial cadastrada.
            </div>
          )}
        </TabsContent>

        {can('opportunities', 'visualizar') && (
          <TabsContent value="opportunities" className="mt-4 space-y-4">
            <div className="flex justify-between items-center px-1">
              <h3 className="font-semibold text-lg">Oportunidades em Andamento</h3>
              <RequirePermission module="opportunities" action="criar">
                <Dialog open={openOpp} onOpenChange={setOpenOpp}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-1" /> Nova
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                      <DialogTitle>Nova Oportunidade</DialogTitle>
                    </DialogHeader>
                    <div className="pt-2">
                      <OpportunityForm
                        onSuccess={() => setOpenOpp(false)}
                        defaultAccountId={account.id}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </RequirePermission>
            </div>
            {accOpps.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {accOpps.map((o) => (
                  <Card
                    key={o.id}
                    className="shadow-subtle flex flex-col justify-between p-5 hover:border-primary/50 transition-colors"
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <Link
                          to={`/oportunidades/${o.id}`}
                          className="font-bold text-lg hover:text-primary hover:underline line-clamp-1"
                        >
                          {o.title}
                        </Link>
                        <Badge
                          className={
                            o.temperature === 'quente'
                              ? 'bg-rose-500'
                              : o.temperature === 'morna'
                                ? 'bg-amber-500'
                                : 'bg-blue-500'
                          }
                        >
                          {o.temperature}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground capitalize">
                        Fase: {o.stage.replace('_', ' ')}
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t flex justify-between items-end">
                      <p className="text-xs text-muted-foreground">
                        Fechamento: {formatDate(o.expectedCloseDate || o.nextStepDate)}
                      </p>
                      <p className="font-bold text-lg font-mono">{formatMoney(o.value)}</p>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center border rounded-xl bg-card text-muted-foreground shadow-subtle">
                Nenhuma oportunidade em andamento ou ganha.
              </div>
            )}
          </TabsContent>
        )}

        {can('contacts', 'visualizar') && (
          <TabsContent value="contacts" className="mt-4 space-y-4">
            <div className="flex justify-between items-center px-1">
              <h3 className="font-semibold text-lg">Diretório de Contatos</h3>
              <RequirePermission module="contacts" action="criar">
                <Dialog open={openContact} onOpenChange={setOpenContact}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-1" /> Novo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>Novo Contato</DialogTitle>
                    </DialogHeader>
                    <div className="pt-2">
                      <ContactForm
                        onSuccess={() => setOpenContact(false)}
                        defaultAccountId={account.id}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </RequirePermission>
            </div>
            {accContacts.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {accContacts.map((c) => (
                  <Card
                    key={c.id}
                    className="shadow-subtle flex items-center p-4 gap-4 hover:border-primary/50 transition-colors"
                  >
                    <img
                      src={c.avatarUrl || 'https://img.usecurling.com/ppl/medium'}
                      className="w-12 h-12 rounded-full bg-muted object-cover border"
                      alt={c.name}
                    />
                    <div>
                      <Link
                        to={`/contatos/${c.id}`}
                        className="font-bold hover:underline hover:text-primary"
                      >
                        {c.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">{c.position || 'Sem cargo'}</p>
                      <div className="flex gap-1 mt-1">
                        <Badge variant="outline" className="text-[10px] capitalize py-0">
                          Inf: {c.influenceLevelGlobal || '?'}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px] capitalize py-0">
                          Rel: {c.relationshipStrength || '?'}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center border rounded-xl bg-card text-muted-foreground shadow-subtle">
                Nenhum contato vinculado à conta.
              </div>
            )}
          </TabsContent>
        )}

        {can('activities', 'visualizar') && (
          <TabsContent value="timeline" className="mt-4 space-y-4">
            <div className="flex justify-between items-center px-1">
              <h3 className="font-semibold text-lg">Histórico de Atividades</h3>
              <RequirePermission module="activities" action="criar">
                <Dialog open={openActivity} onOpenChange={setOpenActivity}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-1" /> Registrar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Registrar Atividade</DialogTitle>
                    </DialogHeader>
                    <div className="pt-2">
                      <ActivityForm
                        onSuccess={() => setOpenActivity(false)}
                        defaultRelatedTo="Account"
                        defaultRelatedId={account.id}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </RequirePermission>
            </div>
            <Card className="shadow-subtle">
              <CardContent className="pt-6">
                {accActivities.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    Nenhuma atividade registrada.
                  </p>
                ) : (
                  <div className="space-y-6">
                    {accActivities.map((a) => (
                      <div key={a.id} className="flex gap-4">
                        <div className="w-24 text-sm text-muted-foreground shrink-0">
                          {formatDate(a.date)}
                        </div>
                        <div className="flex flex-col gap-1 pb-6 border-l pl-4 relative before:absolute before:left-[-5px] before:top-1 before:w-2 before:h-2 before:bg-primary before:rounded-full">
                          <span className="font-medium">{a.type}</span>
                          <span className="text-sm">{a.summary}</span>
                          {a.outcome && (
                            <Badge variant="outline" className="w-fit mt-1">
                              {a.outcome}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
