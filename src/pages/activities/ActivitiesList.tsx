import { useState } from 'react'
import { GenericDataTable } from '../shared/GenericDataTable'
import useCrmStore from '@/stores/useCrmStore'
import { Activity } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ActivityForm } from '@/components/activities/ActivityForm'
import { Plus, Edit, Calendar, Eye, LayoutList, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'

export default function ActivitiesList() {
  const { activities } = useCrmStore()
  const [open, setOpen] = useState(false)
  const [editData, setEditData] = useState<Activity | null>(null)
  const [viewMode, setViewMode] = useState('timeline')

  const handleEdit = (act: Activity) => {
    setEditData(act)
    setOpen(true)
  }

  const columns = [
    {
      key: 'subject',
      label: 'Assunto',
      render: (val: string, a: Activity) => (
        <div>
          <p className="font-medium">{val}</p>
          <p className="text-xs text-muted-foreground mt-0.5 capitalize">
            {a.type?.replace(/_/g, ' ')} • {a.channel?.replace(/_/g, ' ')}
          </p>
        </div>
      ),
    },
    {
      key: 'relatedTo',
      label: 'Relacionamento',
      render: (_: any, a: Activity) => (
        <span className="text-sm truncate max-w-[200px] inline-block">
          {a.accountName ? (
            <Badge variant="outline" className="mr-1 py-0 text-[10px]">
              Conta
            </Badge>
          ) : null}
          {a.accountName || a.opportunityTitle || '-'}
        </span>
      ),
    },
    {
      key: 'scheduledDate',
      label: 'Data',
      render: (val: string) => formatDate(val),
    },
    {
      key: 'status',
      label: 'Status',
      render: (val: string, a: Activity) => (
        <Badge
          variant={val === 'concluida' ? 'default' : a.isOverdue ? 'destructive' : 'secondary'}
          className="capitalize"
        >
          {a.isOverdue ? 'atrasada' : val?.replace(/_/g, ' ')}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (_: any, a: Activity) => (
        <div className="flex gap-1">
          <Link to={`/atividades/${a.id}`}>
            <Button variant="ghost" size="icon">
              <Eye className="w-4 h-4 text-muted-foreground" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => handleEdit(a)}>
            <Edit className="w-4 h-4 text-muted-foreground" />
          </Button>
        </div>
      ),
    },
  ]

  const actions = (
    <div className="flex items-center gap-2">
      <Tabs value={viewMode} onValueChange={setViewMode} className="h-10">
        <TabsList className="h-10 hidden sm:flex">
          <TabsTrigger value="timeline" className="flex gap-2">
            <Clock className="w-4 h-4" /> Timeline
          </TabsTrigger>
          <TabsTrigger value="list" className="flex gap-2">
            <LayoutList className="w-4 h-4" /> Lista
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <Button
        onClick={() => {
          setEditData(null)
          setOpen(true)
        }}
      >
        <Plus className="mr-2 h-4 w-4" /> Nova Atividade
      </Button>
    </div>
  )

  const sortedActivities = [...activities].sort((a, b) => {
    const d1 = new Date(a.scheduledDate || a.createdAt || 0).getTime()
    const d2 = new Date(b.scheduledDate || b.createdAt || 0).getTime()
    return d2 - d1
  })

  return (
    <div className="space-y-6">
      <div className="sm:hidden mb-4">
        <Tabs value={viewMode} onValueChange={setViewMode} className="w-full h-10">
          <TabsList className="w-full h-10 grid grid-cols-2">
            <TabsTrigger value="timeline">
              <Clock className="w-4 h-4 mr-2" /> Timeline
            </TabsTrigger>
            <TabsTrigger value="list">
              <LayoutList className="w-4 h-4 mr-2" /> Lista
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {viewMode === 'list' ? (
        <GenericDataTable
          title="Central de Atividades"
          subtitle="Acompanhe interações e ações da equipe."
          data={sortedActivities}
          columns={columns}
          searchKey="subject"
          actions={actions}
        />
      ) : (
        <div className="space-y-8 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Timeline de Relacionamento</h1>
              <p className="text-muted-foreground mt-1">
                Histórico cronológico de todas as interações e follow-ups.
              </p>
            </div>
            <div className="hidden sm:block">{actions}</div>
          </div>

          <div className="space-y-0 px-2 sm:px-0 max-w-4xl">
            {sortedActivities.map((act, index) => (
              <div key={act.id} className="relative flex gap-4 sm:gap-6">
                <div className="flex flex-col items-center w-6 shrink-0">
                  <div className="h-4 w-4 rounded-full border-2 border-background bg-primary z-10 mt-5 ring-4 ring-background" />
                  {index !== sortedActivities.length - 1 && (
                    <div className="w-0.5 bg-border h-full -mt-2" />
                  )}
                </div>

                <div className="flex-1 pb-8">
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="uppercase text-[10px] tracking-wider">
                            {act.type?.replace(/_/g, ' ')}
                          </Badge>
                          <h3 className="font-semibold text-base sm:text-lg">{act.subject}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
                          <Calendar className="w-4 h-4" />
                          {formatDate(act.scheduledDate || act.createdAt || '')}
                        </div>
                      </div>

                      <p className="text-sm text-foreground/90 mb-4">{act.summary}</p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground bg-muted/30 p-2 rounded-md">
                        {act.accountName && (
                          <div className="flex items-center gap-1">
                            <span className="font-semibold">Conta:</span> {act.accountName}
                          </div>
                        )}
                        {act.opportunityTitle && (
                          <div className="flex items-center gap-1">
                            <span className="font-semibold">Opp:</span> {act.opportunityTitle}
                          </div>
                        )}
                        <div className="flex items-center gap-1 ml-auto">
                          <span className="font-semibold">Status:</span>
                          <span
                            className={`capitalize ${act.isOverdue ? 'text-destructive font-bold' : ''}`}
                          >
                            {act.isOverdue ? 'atrasada' : act.status?.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <Link
                          to={`/atividades/${act.id}`}
                          className="text-primary hover:underline ml-2"
                        >
                          Ver detalhes &rarr;
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
            {sortedActivities.length === 0 && (
              <div className="text-center py-10 text-muted-foreground border border-dashed rounded-xl">
                Nenhuma atividade registrada na timeline.
              </div>
            )}
          </div>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[700px] h-[90vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>{editData ? 'Editar Atividade' : 'Registrar Interação'}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <ActivityForm initialData={editData} onSuccess={() => setOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
