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
import NotFound from '../NotFound'
import { Mail, Phone, MapPin, Briefcase, Edit } from 'lucide-react'
import { useState } from 'react'
import { useRbac } from '@/hooks/use-rbac'
import { AccessDenied } from '@/components/AccessDenied'
import { RequirePermission } from '@/components/RequirePermission'

export default function ContactDetail() {
  const { id } = useParams()
  const { contacts, accounts, activities, opps } = useCrmStore()
  const [openEdit, setOpenEdit] = useState(false)
  const { can } = useRbac()

  if (!can('contacts', 'visualizar')) return <AccessDenied />

  const contact = contacts.find((c) => c.id === id)
  if (!contact) return <NotFound />

  const account = accounts.find((a) => a.id === contact.accountId)
  const contactActivities = activities.filter(
    (a) => a.relatedTo === 'Account' && a.relatedId === account?.id,
  )
  const contactOpps = opps.filter((o) => o.accountId === contact.accountId)

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex items-start justify-between border-b pb-6">
        <div className="flex items-center gap-6">
          <img
            src={contact.avatarUrl || 'https://img.usecurling.com/ppl/large'}
            alt={contact.name}
            className="w-24 h-24 rounded-full border bg-muted object-cover shadow-sm"
          />
          <div>
            <h1 className="text-3xl font-bold">{contact.name}</h1>
            <p className="text-lg text-muted-foreground flex items-center gap-2 mt-1">
              <Briefcase className="w-4 h-4" />
              {contact.position || 'Sem cargo'}
              {account && (
                <>
                  {' '}
                  em{' '}
                  <Link to={`/contas/${account.id}`} className="text-primary hover:underline">
                    {account.name}
                  </Link>
                </>
              )}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="outline" className="capitalize">
                Inf: {contact.influenceLevelGlobal || 'Desconhecida'}
              </Badge>
              <Badge variant="secondary" className="capitalize">
                Relac: {contact.relationshipStrength || 'Desconhecido'}
              </Badge>
              <Badge variant="outline" className="capitalize bg-muted">
                {contact.relationshipStatus || 'Ativo'}
              </Badge>
            </div>
          </div>
        </div>
        <RequirePermission module="contacts" action="editar">
          <Dialog open={openEdit} onOpenChange={setOpenEdit}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" /> Editar Contato
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Editar Contato</DialogTitle>
              </DialogHeader>
              <div className="pt-2">
                <ContactForm initialData={contact} onSuccess={() => setOpenEdit(false)} />
              </div>
            </DialogContent>
          </Dialog>
        </RequirePermission>
      </div>

      <Tabs defaultValue="360" className="w-full">
        <TabsList className="bg-muted">
          <TabsTrigger value="360">Visão 360º</TabsTrigger>
          {can('opportunities', 'visualizar') && (
            <TabsTrigger value="opportunities">Oportunidades Relacionadas</TabsTrigger>
          )}
          {can('activities', 'visualizar') && <TabsTrigger value="timeline">Timeline</TabsTrigger>}
        </TabsList>

        <TabsContent value="360" className="mt-4 space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="shadow-subtle">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Informações de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase font-semibold">
                      E-mail
                    </p>
                    <p className="font-medium">{contact.email || '-'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase font-semibold">
                      Telefone / Celular
                    </p>
                    <p className="font-medium">
                      {contact.phone || '-'} {contact.mobile ? ` / ${contact.mobile}` : ''}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase font-semibold">
                      Endereço
                    </p>
                    <p className="font-medium">
                      {contact.address ? (
                        <>
                          {contact.address} <br /> {contact.city}/{contact.state} - CEP{' '}
                          {contact.zipCode}
                        </>
                      ) : (
                        '-'
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-subtle">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Perfil Estratégico</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-y-4">
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase font-semibold">
                      Nível de Influência
                    </p>
                    <p className="font-medium capitalize">
                      {contact.influenceLevelGlobal || 'Desconhecido'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase font-semibold">
                      Força Relacionamento
                    </p>
                    <p className="font-medium capitalize">
                      {contact.relationshipStrength || 'Desconhecido'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase font-semibold">
                      Canal Preferido
                    </p>
                    <p className="font-medium capitalize">
                      {contact.preferredChannel || 'Não informado'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground uppercase font-semibold">
                      LinkedIn
                    </p>
                    <p className="font-medium truncate">
                      {contact.linkedin ? (
                        <a
                          href={contact.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline"
                        >
                          Ver Perfil
                        </a>
                      ) : (
                        '-'
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {can('opportunities', 'visualizar') && (
          <TabsContent value="opportunities" className="mt-4">
            {contactOpps.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {contactOpps.map((o) => (
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
                        <Badge variant="outline" className="capitalize">
                          {o.stage.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="font-bold text-lg font-mono">{formatMoney(o.value)}</p>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center border rounded-xl bg-card text-muted-foreground shadow-subtle">
                Nenhuma oportunidade vinculada à conta deste contato.
              </div>
            )}
          </TabsContent>
        )}

        {can('activities', 'visualizar') && (
          <TabsContent value="timeline" className="mt-4">
            <Card className="shadow-subtle">
              <CardContent className="pt-6">
                {contactActivities.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    Nenhuma atividade registrada na conta.
                  </p>
                ) : (
                  <div className="space-y-6">
                    {contactActivities.map((a) => (
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
