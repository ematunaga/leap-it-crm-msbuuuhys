import { useState } from 'react'
import useCrmStore from '@/stores/useCrmStore'
import { KanbanCard } from './KanbanCard'

const STAGES = [
  'Prospecção',
  'Qualificação',
  'Proposta',
  'Negociação',
  'Fechado Ganho',
  'Fechado Perdido',
] as const

export default function PipelineBoard() {
  const { opps, updateOppStage } = useCrmStore()

  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Pipeline Kanban</h1>
        <p className="text-muted-foreground mt-1">
          Arraste e solte para atualizar os estágios (Fria = Azul, Morna = Amarela, Quente =
          Vermelha).
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 flex-1 min-h-[500px]">
        {STAGES.map((stage) => (
          <KanbanColumn
            key={stage}
            stage={stage}
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
  items,
  onDrop,
}: {
  stage: string
  items: any[]
  onDrop: (id: string) => void
}) {
  const [isOver, setIsOver] = useState(false)

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

  const totalValue = items.reduce((sum, o) => sum + o.value, 0)

  return (
    <div
      className={`flex flex-col w-80 shrink-0 rounded-xl bg-muted/50 border transition-colors ${isOver ? 'border-primary bg-primary/5' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={() => setIsOver(false)}
      onDrop={handleDrop}
    >
      <div className="p-3 font-semibold border-b bg-muted/80 rounded-t-xl flex justify-between items-center">
        <span>{stage}</span>
        <span className="text-xs font-mono bg-background px-2 py-0.5 rounded-full border">
          {items.length}
        </span>
      </div>
      <div className="p-3 text-sm text-muted-foreground border-b bg-background/50">
        R$ {(totalValue / 1000).toFixed(0)}k
      </div>
      <div className="flex-1 p-3 overflow-y-auto">
        {items.map((opp) => (
          <KanbanCard key={opp.id} opp={opp} />
        ))}
      </div>
    </div>
  )
}
