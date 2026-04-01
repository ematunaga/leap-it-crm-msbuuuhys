import { useParams, Link } from 'react-router-dom'
import useCrmStore from '@/stores/useCrmStore'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Edit,
  ArrowLeft,
  Calendar,
  User,
  Building,
  Briefcase,
  MessageSquare,
  Clock,
  AlignLeft,
  CheckCircle2,
} from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ActivityForm } from '@/components/activities/ActivityForm'
import { useRbac } from '@/hooks/use-rbac'
import { AccessDenied } from '@/components/AccessDenied'
import { RequirePermission } from '@/components/RequirePermission'

export default function ActivityDetail() {
  const { id } = useParams()
  const { activities } = useCrmStore()
  const activity = activities.find((a) => a.id === id)
  const [editOpen, setEditOpen] = useState(false)
  const { can } = useRbac()

  if (!can('activities', 'visualizar')) return <AccessDenied />

  if (!activity)
    return <div className="p-8 text-center text-muted-foreground">Atividade não encontrada.</div>

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link to="/atividades">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <Badge variant="outline" className="uppercase tracking-wider text-[10px]">
              {activity.type?.replace(/_/g, ' ')}
            </Badge>
            <Badge
              variant={
                activity.status === 'concluida'
                  ? 'default'
                  : activity.isOverdue
                    ? 'destructive'
                    : 'secondary'
              }
              className="capitalize"
            >
              {activity.isOverdue ? 'atrasada' : activity.status?.replace(/_/g, ' ')}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{activity.subject}</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Calendar className="w-4 h-4" /> Agendado para{' '}
            {formatDate(activity.scheduledDate || activity.createdAt || '')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <RequirePermission module="activities" action="editar">
            <Button variant="outline" onClick={() => setEditOpen(true)}>
              <Edit className="w-4 h-4 mr-2" /> Editar Atividade
            </Button>
          </RequirePermission>
        </div>
      </div>

      {/* 360 View Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content Column */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlignLeft className="w-5 h-5 text-primary" /> Detalhes e Conteúdo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resumo Objetivo</p>
                <p className="mt-1 text-base">{activity.summary || '-'}</p>
              </div>
              {activity.details && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Detalhamento Completo</p>
                  <div className="mt-2 p-4 bg-muted/30 rounded-lg text-sm whitespace-pre-wrap leading-relaxed">
                    {activity.details}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="w-5 h-5 text-primary" /> Qualidade da Conversa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Objeções Levantadas</p>
                  <p className="mt-1 text-sm">
                    {activity.objections || 'Nenhuma objeção registrada.'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Sinais Percebidos (Urgência/Interesse)
                  </p>
                  <p className="mt-1 text-sm">
                    {activity.customerSignals || 'Nenhum sinal registrado.'}
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-muted-foreground">Próximo Passo Combinado</p>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 gap-2 bg-muted/20 p-3 rounded-md">
                  <p className="text-sm font-medium">
                    {activity.nextStep || 'Nenhum próximo passo definido.'}
                  </p>
                  {activity.nextStepDate && (
                    <Badge variant="outline" className="w-fit flex items-center bg-background">
                      <Calendar className="w-3 h-3 mr-1" /> {formatDate(activity.nextStepDate)}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Relacionamentos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {activity.accountName && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <Building className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Conta Relacionada</p>
                    <Link
                      to={`/contas/${activity.accountId}`}
                      className="font-medium text-sm hover:underline"
                    >
                      {activity.accountName}
                    </Link>
                  </div>
                </div>
              )}
              {activity.contactName && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Contato</p>
                    <Link
                      to={`/contatos/${activity.contactId}`}
                      className="font-medium text-sm hover:underline"
                    >
                      {activity.contactName}
                    </Link>
                  </div>
                </div>
              )}
              {activity.opportunityTitle && (
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-full text-primary">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Oportunidade</p>
                    <Link
                      to={`/oportunidades/${activity.opportunityId}`}
                      className="font-medium text-sm hover:underline"
                    >
                      {activity.opportunityTitle}
                    </Link>
                  </div>
                </div>
              )}
              {!activity.accountName && !activity.opportunityTitle && !activity.contactName && (
                <p className="text-sm text-muted-foreground">Nenhum relacionamento vinculado.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Execução e Engajamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Canal</p>
                  <Badge variant="secondary" className="capitalize">
                    {activity.channel?.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Prioridade</p>
                  <Badge variant="outline" className="capitalize">
                    {activity.priority}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Resultado</p>
                  <span className="text-sm font-medium capitalize">
                    {activity.outcome?.replace(/_/g, ' ') || '-'}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Engajamento</p>
                  <span className="text-sm font-medium capitalize">
                    {activity.engagementLevel || '-'}
                  </span>
                </div>
                {activity.durationMinutes && (
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground mb-1">Duração da Interação</p>
                    <span className="text-sm font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3 text-muted-foreground" /> {activity.durationMinutes}{' '}
                      minutos
                    </span>
                  </div>
                )}
                {activity.completedAt && (
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground mb-1">Concluída em</p>
                    <span className="text-sm font-medium flex items-center gap-1 text-emerald-600">
                      <CheckCircle2 className="w-3 h-3" /> {formatDate(activity.completedAt)}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[700px] h-[90vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>Editar Atividade</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <ActivityForm initialData={activity} onSuccess={() => setEditOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
