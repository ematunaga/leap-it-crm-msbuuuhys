import { useParams } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import useCrmStore from '@/stores/useCrmStore'
import { formatDate } from '@/lib/utils'
import NotFound from '../NotFound'

export default function AccountDetail() {
  const { id } = useParams()
  const { accounts, contacts, activities } = useCrmStore()

  const account = accounts.find((a) => a.id === id)
  if (!account) return <NotFound />

  const accContacts = contacts.filter((c) => c.accountId === id)
  const accActivities = activities.filter((a) => a.relatedTo === 'Account' && a.relatedId === id)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 border-b pb-6">
        <img
          src={account.logo}
          alt={account.name}
          className="w-16 h-16 rounded-xl border bg-white p-2 object-contain shadow-sm"
        />
        <div>
          <h1 className="text-3xl font-bold">{account.name}</h1>
          <div className="flex gap-2 mt-2">
            <Badge variant="outline">{account.segment}</Badge>
            <Badge variant="secondary">Tier {account.tier}</Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="bg-muted">
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="contacts">Contatos ({accContacts.length})</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="whitespace">White Space</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="mt-4">
          <Card className="shadow-subtle">
            <CardHeader>
              <CardTitle>Dados Básicos</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium">{account.status}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Última Interação</p>
                <p className="font-medium">{formatDate(account.lastInteractionAt)}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            {accContacts.map((c) => (
              <Card key={c.id} className="shadow-subtle flex items-center p-4 gap-4">
                <img src={c.avatar} className="w-12 h-12 rounded-full bg-muted" alt={c.name} />
                <div>
                  <p className="font-bold">{c.name}</p>
                  <p className="text-sm text-muted-foreground">{c.role}</p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {c.influence}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="mt-4">
          <Card className="shadow-subtle">
            <CardContent className="pt-6">
              {accActivities.length === 0 ? (
                <p className="text-muted-foreground">Nenhuma atividade.</p>
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

        <TabsContent value="whitespace" className="mt-4">
          <Card className="shadow-subtle">
            <CardHeader>
              <CardTitle>Análise de Expansão (White Space)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                defaultValue={account.whiteSpace}
                rows={6}
                className="bg-muted/50"
                placeholder="Anotações estratégicas sobre potencial da conta..."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
