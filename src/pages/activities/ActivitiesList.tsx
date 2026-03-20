import { useState } from 'react'
import { GenericDataTable } from '../shared/GenericDataTable'
import useCrmStore from '@/stores/useCrmStore'
import { Activity } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ActivityForm } from '@/components/activities/ActivityForm'
import { Plus, Edit } from 'lucide-react'

export default function ActivitiesList() {
  const { activities, opps, accounts } = useCrmStore()
  const [open, setOpen] = useState(false)
  const [editData, setEditData] = useState<Activity | null>(null)

  const handleEdit = (act: Activity) => {
    setEditData(act)
    setOpen(true)
  }

  const columns = [
    {
      key: 'summary',
      label: 'Resumo da Atividade',
      render: (val: string, a: Activity) => (
        <div>
          <p className="font-medium">{val}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{a.type}</p>
        </div>
      ),
    },
    {
      key: 'relatedTo',
      label: 'Relacionado',
      render: (_: any, a: Activity) => {
        let name = '-'
        if (a.relatedTo === 'Opportunity')
          name = opps.find((o) => o.id === a.relatedId)?.title || ''
        if (a.relatedTo === 'Account')
          name = accounts.find((ac) => ac.id === a.relatedId)?.name || ''
        return (
          <span
            className="text-sm truncate max-w-[200px] inline-block"
            title={`${a.relatedTo}: ${name}`}
          >
            <Badge variant="outline" className="mr-1 py-0 text-[10px]">
              {a.relatedTo}
            </Badge>
            {name}
          </span>
        )
      },
    },
    {
      key: 'date',
      label: 'Data',
      render: (val: string) => formatDate(val),
    },
    {
      key: 'status',
      label: 'Status',
      render: (val: string, a: Activity) => (
        <Badge
          variant={val === 'Concluída' ? 'default' : 'secondary'}
          className={a.isOverdue ? 'bg-rose-500 hover:bg-rose-600 text-white' : ''}
        >
          {a.isOverdue ? 'Atrasado' : val}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Ações',
      render: (_: any, a: Activity) => (
        <Button variant="ghost" size="icon" onClick={() => handleEdit(a)}>
          <Edit className="w-4 h-4" />
        </Button>
      ),
    },
  ]

  const actions = (
    <Button
      onClick={() => {
        setEditData(null)
        setOpen(true)
      }}
    >
      <Plus className="mr-2 h-4 w-4" /> Nova Atividade
    </Button>
  )

  return (
    <>
      <GenericDataTable
        title="Central de Atividades"
        subtitle="Histórico de interações e follow-ups pendentes."
        data={activities}
        columns={columns}
        searchKey="summary"
        actions={actions}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editData ? 'Editar Atividade' : 'Registrar Atividade'}</DialogTitle>
          </DialogHeader>
          <div className="pt-2">
            <ActivityForm initialData={editData} onSuccess={() => setOpen(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
