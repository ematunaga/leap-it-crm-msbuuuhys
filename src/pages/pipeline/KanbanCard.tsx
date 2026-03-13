import { Link } from 'react-router-dom'
import { Opportunity } from '@/types'
import { Badge } from '@/components/ui/badge'
import { formatMoney, formatDate } from '@/lib/utils'
import { Clock, AlertCircle } from 'lucide-react'

export function KanbanCard({ opp }: { opp: Opportunity }) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('oppId', opp.id)
  }

  const bgColors = {
    fria: 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800',
    morna: 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800',
    quente: 'bg-rose-50 border-rose-200 dark:bg-rose-950/30 dark:border-rose-800',
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`p-4 mb-3 rounded-xl border cursor-grab active:cursor-grabbing shadow-subtle hover:shadow-elevation transition-all ${bgColors[opp.temperature] || 'bg-background'}`}
    >
      <Link
        to={`/oportunidades/${opp.id}`}
        className="block font-semibold mb-1 hover:underline truncate"
      >
        {opp.title}
      </Link>
      <div className="font-mono font-medium text-sm mb-3">{formatMoney(opp.value)}</div>

      <div className="text-xs text-muted-foreground space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> Próx. Passo:
          </span>
          <span className="font-medium text-foreground truncate max-w-[100px]">{opp.nextStep}</span>
        </div>
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-black/5 dark:border-white/5">
          <span>{formatDate(opp.nextStepDate)}</span>
          {opp.isOverdue && (
            <Badge variant="destructive" className="px-1 py-0 h-4 text-[10px]">
              <AlertCircle className="w-3 h-3 mr-1" /> Atrasado
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}
