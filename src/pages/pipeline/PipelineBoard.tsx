import { useState } from 'react'
import useCrmStore from '@/stores/useCrmStore'
import { KanbanCard } from './KanbanCard'
import { Opportunity } from '@/types'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { OpportunityForm } from '@/components/opportunities/OpportunityForm'
import { convertCurrency } from '@/lib/utils'
import { Plus } from 'lucide-react'

const STAGES: string[] = [
  'prospeccao',
  'qualificacao',
  'proposta_enviada',
  'negociacao',
  'ganho',
  'perdido',
]

const stageLabels: Record<string, string> = {
  prospeccao: 'Prospecção',
  qualificacao: 'Qualificação',
  proposta_enviada: 'Proposta Enviada',
  negociacao: 'Negociação',
  ganho: 'Fechado Ganho',
  perdido: 'Fechado Perdido',
}

export default function PipelineBoard() {
  const { opps, updateOppStage, currencyView, setCurrencyView } = useCrmStore()
  const [openOpp, setOpenOpp] = useState(false)

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pipeline Kanban</h1>
          <p className="text-muted-foreground mt-1">
            Arraste e solte para atualizar os estágios (Fria = Azul, Morna = Amarela, Quente =
            Vermelha).
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg border">
            <Button
              variant={currencyView === 'BRL' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 text-xs px-3"
              onClick={() => setCurrencyView('BRL')}
            >
              BRL
            </Button>
            <Button
              variant={currencyView === 'USD' ? 'secondary' : 'ghost'}
              size="sm"
              className="h-8 text-xs px-3"
              onClick={() => setCurrencyView('USD')}
            >
              USD
            </Button>
          </div>
          <Dialog open={openOpp} onOpenChange={setOpenOpp}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Nova Oportunidade
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Nova Oportunidade</DialogTitle>
              </DialogHeader>
              <div className="pt-2">
                <OpportunityForm onSuccess={() => setOpenOpp(false)} />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 flex-1 min-h-[500px]">
        {STAGES.map((stage) => (
          <KanbanColumn
            key={stage}
            stage={stage}
            label={stageLabels[stage]}
            items={opps.filter((o) => o.stage === stage)}
            onDrop={(id) => updateOppStage(id, stage)}
          />
        ))}
      </div>
    </div>
  )
}

function KanbanColumn({
  stage,
  label,
  items,
  onDrop,
}: {
  stage: string
  label: string
  items: any[]
  onDrop: (id: string) => void
}) {
  const [isOver, setIsOver] = useState(false)
  const { currencyView, ptaxRate } = useCrmStore()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsOver(true)
  }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsOver(false)
    const id = e.dataTransfer.getData('oppId')
    if (id) onDrop(id)
  }

  const totalValue = items.reduce(
    (sum, o) => sum + convertCurrency(o.value, o.currency || 'BRL', currencyView, ptaxRate),
    0,
  )

  return (
    <div
      className={`flex flex-col w-80 shrink-0 rounded-xl bg-muted/50 border transition-colors ${isOver ? 'border-primary bg-primary/5' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={() => setIsOver(false)}
      onDrop={handleDrop}
    >
      <div className="p-3 font-semibold border-b bg-muted/80 rounded-t-xl flex justify-between items-center">
        <span>{label}</span>
        <span className="text-xs font-mono bg-background px-2 py-0.5 rounded-full border">
          {items.length}
        </span>
      </div>
      <div className="p-3 text-sm text-muted-foreground border-b bg-background/50">
        {currencyView === 'USD' ? 'US$' : 'R$'} {(totalValue / 1000).toFixed(0)}k
      </div>
      <div className="flex-1 p-3 overflow-y-auto space-y-3">
        {items.map((opp) => (
          <KanbanCard key={opp.id} opp={opp} />
        ))}
      </div>
    </div>
  )
}
