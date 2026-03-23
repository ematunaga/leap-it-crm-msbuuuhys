import { useState } from 'react'
import useCrmStore from '@/stores/useCrmStore'
import { KanbanCard } from './KanbanCard'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { OpportunityForm } from '@/components/opportunities/OpportunityForm'
import { convertCurrency, formatDate } from '@/lib/utils'
import { Plus } from 'lucide-react'
import { useRbac } from '@/hooks/use-rbac'
import { AccessDenied } from '@/components/AccessDenied'
import { RequirePermission } from '@/components/RequirePermission'
import { useToast } from '@/hooks/use-toast'

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
  const { opps, updateOppStage, currencyView, setCurrencyView, ptaxRate, ptaxDate } = useCrmStore()
  const [openOpp, setOpenOpp] = useState(false)
  const { can } = useRbac()
  const { toast } = useToast()

  if (!can('opportunities', 'visualizar')) return <AccessDenied />

  const canEdit = can('opportunities', 'editar')

  const handleDropSafe = (id: string, stage: string) => {
    if (!canEdit) {
      toast({
        title: 'Acesso Restrito',
        description: 'Você não tem permissão para mover oportunidades.',
        variant: 'destructive',
      })
      return
    }
    updateOppStage(id, stage)
  }

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
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-3 flex-wrap justify-end">
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
            <RequirePermission module="opportunities" action="criar">
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
            </RequirePermission>
          </div>
          <div className="text-[10px] text-muted-foreground mt-1 mr-1">
            Cotação PTAX: R$ {ptaxRate.toFixed(4)} (Data: {ptaxDate ? formatDate(ptaxDate) : '-'})
          </div>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 flex-1 min-h-[500px]">
        {STAGES.map((stage) => (
          <KanbanColumn
            key={stage}
            stage={stage}
            label={stageLabels[stage]}
            items={opps.filter((o) => o.stage === stage)}
            onDrop={(id) => handleDropSafe(id, stage)}
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
        {currencyView === 'USD' ? 'US
 : 'R


}${val / 1000}k`}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <Tooltip content={<ChartTooltipContent />} cursor={{ fill: 'transparent' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {byPartner.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="shadow-subtle">
          <CardHeader>
            <CardTitle className="text-lg">Projeção por Trimestre</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ value: { label: 'Valor' } }} className="h-[300px]">
              <BarChart data={byQuarterChart}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                  fontSize={12}
                  tickFormatter={(val) => `${currencyView === 'USD' ? 'US


 : 'R


}${val / 1000}k`}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<ChartTooltipContent />} cursor={{ fill: 'transparent' }} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-subtle">
        <CardHeader>
          <CardTitle className="text-lg">Lista de Oportunidades Mapeadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-md">Oportunidade</th>
                  <th className="px-4 py-3">Conta</th>
                  <th className="px-4 py-3">Fabricante</th>
                  <th className="px-4 py-3">Fase</th>
                  <th className="px-4 py-3 text-right">Fechamento</th>
                  <th className="px-4 py-3 text-right">Valor</th>
                  <th className="px-4 py-3 text-right rounded-tr-md"></th>
                </tr>
              </thead>
              <tbody>
                {filteredOpps.length > 0 ? (
                  filteredOpps.map((o) => {
                    const acc = accounts.find((a) => a.id === o.accountId)
                    const convertedVal = convertCurrency(
                      o.value,
                      o.currency || 'BRL',
                      currencyView,
                      ptaxRate,
                    )
                    return (
                      <tr
                        key={o.id}
                        className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium">
                          <Link
                            to={`/oportunidades/${o.id}`}
                            className="hover:underline hover:text-primary"
                          >
                            {o.title}
                          </Link>
                        </td>
                        <td className="px-4 py-3">{acc?.name || '-'}</td>
                        <td className="px-4 py-3 capitalize">{o.partner || '-'}</td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="capitalize">
                            {o.stage.replace('_', ' ')}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right text-muted-foreground">
                          {formatDate(o.expectedCloseDate || o.nextStepDate)}
                        </td>
                        <td className="px-4 py-3 text-right font-mono font-medium">
                          <div>{formatMoney(convertedVal, currencyView)}</div>
                          {o.currency && o.currency !== currencyView && (
                            <div className="text-[10px] text-muted-foreground">
                              ({formatMoney(o.value, o.currency)})
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <RequirePermission module="opportunities" action="editar">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  setEditOpp(o)
                                  setOpenOpp(true)
                                }}
                              >
                                <Edit className="w-4 h-4 text-muted-foreground" />
                              </Button>
                            </RequirePermission>
                            <RequirePermission module="opportunities" action="excluir">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  if (window.confirm('Excluir oportunidade permanentemente?')) {
                                    deleteOpportunity(o.id)
                                    toast({ title: 'Oportunidade excluída.' })
                                  }
                                }}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </RequirePermission>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      Nenhuma oportunidade encontrada com os filtros atuais.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={openOpp} onOpenChange={setOpenOpp}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{editOpp ? 'Editar Oportunidade' : 'Nova Oportunidade'}</DialogTitle>
          </DialogHeader>
          <div className="pt-2">
            <OpportunityForm initialData={editOpp} onSuccess={() => setOpenOpp(false)} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

