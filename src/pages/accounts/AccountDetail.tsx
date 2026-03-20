import { Link, useParams } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import useCrmStore from '@/stores/useCrmStore'
import { formatDate, formatMoney } from '@/lib/utils'
import NotFound from '../NotFound'

export default function AccountDetail() {
  const { id } = useParams()
  const { accounts, contacts, activities, opps } = useCrmStore()

  const account = accounts.find((a) => a.id === id)
  if (!account) return <NotFound />

  const accContacts = contacts.filter((c) => c.accountId === id)
  const accActivities = activities.filter((a) => a.relatedTo === 'Account' && a.relatedId === id)
  const accOpps = opps.filter((o) => o.accountId === id)

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex items-center gap-4 border-b pb-6">
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

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="bg-muted flex flex-wrap h-auto w-full justify-start gap-1 p-1">
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="branches">Filiais ({account.branches?.length || 0})</TabsTrigger>
          <TabsTrigger value="opportunities">Oportunidades ({accOpps.length})</TabsTrigger>
          <TabsTrigger value="contacts">Contatos ({accContacts.length})</TabsTrigger>
          <TabsTrigger value="timeline">Atividades</TabsTrigger>
          <TabsTrigger value="whitespace">Estratégia</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-4 space-y-4">
          <Card className="shadow-subtle">
            <CardHeader>
              <CardTitle>Dados Básicos & Relacionamento</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Saúde da Conta</p>
                <p className="font-medium capitalize">
                  {account.accountHealth?.replace('_', ' ') || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status de Relacionamento</p>
                <p className="font-medium capitalize">
                  {account.relationshipStatus?.replace('_', ' ') || '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Porte (Funcionários)</p>
                <p className="font-medium capitalize">{account.porte || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Potencial Estimado</p>
                <p className="font-medium font-mono">
                  {account.accountPotential ? formatMoney(account.accountPotential) : '-'}
                </p>
              </div>
              <div className="col-span-2 md:col-span-4 border-t pt-4 mt-2">
                <p className="text-sm text-muted-foreground">Endereço Sede</p>
                <p className="font-medium">
                  {account.headquartersAddress
                    ? `${account.headquartersAddress} - ${account.headquartersCity}/${account.headquartersState} - CEP: ${account.headquartersZip}`
                    : '-'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branches" className="mt-4">
          {account.branches && account.branches.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {account.branches.map((b, i) => (
                <Card key={i} className="shadow-subtle">
                  <CardContent className="pt-6 relative">
                    <Badge variant="secondary" className="absolute top-4 right-4">
                      Filial {i + 1}
                    </Badge>
                    <p className="font-bold text-sm">CNPJ: {b.cnpj || 'Não informado'}</p>
                    <p className="text-sm text-muted-foreground mt-1">IE: {b.ie || '-'}</p>
                    <p className="text-sm text-muted-foreground mt-4 font-medium">
                      {b.address || 'Sem endereço'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {b.city} {b.state ? `- ${b.state}` : ''} {b.zip ? `| CEP: ${b.zip}` : ''}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center border rounded-xl bg-card text-muted-foreground shadow-subtle">
              Nenhuma filial cadastrada para esta conta.
            </div>
          )}
        </TabsContent>

        <TabsContent value="opportunities" className="mt-4">
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

        <TabsContent value="contacts" className="mt-4">
          {accContacts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {accContacts.map((c) => (
                <Card key={c.id} className="shadow-subtle flex items-center p-4 gap-4">
                  <img
                    src={c.avatarUrl}
                    className="w-12 h-12 rounded-full bg-muted object-cover border"
                    alt={c.name}
                  />
                  <div>
                    <p className="font-bold">{c.name}</p>
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

        <TabsContent value="timeline" className="mt-4">
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

        <TabsContent value="whitespace" className="mt-4 space-y-4">
          <Card className="shadow-subtle">
            <CardHeader>
              <CardTitle>Dor Principal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{account.mainPain || 'Não identificada.'}</p>
            </CardContent>
          </Card>
          <Card className="shadow-subtle">
            <CardHeader>
              <CardTitle>Análise de Expansão (White Space)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                readOnly
                defaultValue={account.whiteSpaceNotes}
                rows={4}
                className="bg-muted/50 resize-none"
                placeholder="Sem anotações de expansão..."
              />
            </CardContent>
          </Card>
          <Card className="shadow-subtle">
            <CardHeader>
              <CardTitle>Stack Tecnológico / Ambiente Atual</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                readOnly
                defaultValue={account.currentEnvironment}
                rows={3}
                className="bg-muted/50 resize-none"
                placeholder="Sem informações sobre o ambiente..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
