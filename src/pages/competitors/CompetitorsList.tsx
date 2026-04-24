import { useState } from 'react'
import { Plus, Shield, TrendingUp, TrendingDown, Target, Search, ExternalLink } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import useCrmStore from '@/stores/useCrmStore'
import { useRBAC } from '@/hooks/use-rbac'
import type { Competitor } from '@/types'

const priceLevelConfig = {
  baixo: { label: 'Preco Baixo', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
  medio: { label: 'Preco Medio', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  alto: { label: 'Preco Alto', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
}

const emptyForm: Partial<Competitor> = {
  name: '', website: '', segment: '', mainProducts: '', strengths: '', weaknesses: '',
  winRate: 0, lossRate: 0, positioning: '', priceLevel: 'medio', notes: '',
}

export default function CompetitorsList() {
  const { competitors, addCompetitor } = useCrmStore()
  const { can } = useRBAC()
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Partial<Competitor>>(emptyForm)
  const [selected, setSelected] = useState<Competitor | null>(null)

  const canCreate = can('competitors', 'create')

  const filtered = (competitors ?? []).filter(c =>
    !search ||
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.segment?.toLowerCase().includes(search.toLowerCase())
  )

  const avgWinRate = filtered.length > 0
    ? filtered.reduce((sum, c) => sum + (c.winRate ?? 0), 0) / filtered.length
    : 0

  const handleSubmit = async () => {
    if (!form.name) return
    await addCompetitor({ ...form, id: crypto.randomUUID(), createdAt: new Date().toISOString() } as Competitor)
    setForm(emptyForm)
    setOpen(false)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Inteligencia Competitiva</h1>
          <p className="text-muted-foreground">Analise e monitoramento de concorrentes</p>
        </div>
        {canCreate && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" />Novo Concorrente</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Novo Concorrente</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Nome *</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex: Empresa Concorrente SA" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Website</Label><Input value={form.website ?? ''} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="https://" /></div>
                  <div><Label>Segmento</Label><Input value={form.segment ?? ''} onChange={e => setForm(f => ({ ...f, segment: e.target.value }))} /></div>
                </div>
                <div><Label>Principais Produtos/Servicos</Label><Textarea value={form.mainProducts ?? ''} onChange={e => setForm(f => ({ ...f, mainProducts: e.target.value }))} rows={2} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Pontos Fortes</Label><Textarea value={form.strengths ?? ''} onChange={e => setForm(f => ({ ...f, strengths: e.target.value }))} rows={3} /></div>
                  <div><Label>Pontos Fracos</Label><Textarea value={form.weaknesses ?? ''} onChange={e => setForm(f => ({ ...f, weaknesses: e.target.value }))} rows={3} /></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div><Label>Win Rate (%)</Label><Input type="number" min={0} max={100} value={form.winRate ?? 0} onChange={e => setForm(f => ({ ...f, winRate: Number(e.target.value) }))} /></div>
                  <div><Label>Loss Rate (%)</Label><Input type="number" min={0} max={100} value={form.lossRate ?? 0} onChange={e => setForm(f => ({ ...f, lossRate: Number(e.target.value) }))} /></div>
                  <div><Label>Nivel de Preco</Label>
                    <Select value={form.priceLevel ?? 'medio'} onValueChange={v => setForm(f => ({ ...f, priceLevel: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baixo">Baixo</SelectItem>
                        <SelectItem value="medio">Medio</SelectItem>
                        <SelectItem value="alto">Alto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div><Label>Posicionamento</Label><Textarea value={form.positioning ?? ''} onChange={e => setForm(f => ({ ...f, positioning: e.target.value }))} rows={2} /></div>
                <div><Label>Notas Internas</Label><Textarea value={form.notes ?? ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} /></div>
                <Button onClick={handleSubmit} className="w-full">Salvar Concorrente</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* KPI summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-border bg-card"><CardContent className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1"><Target className="h-4 w-4 text-blue-400" />Concorrentes Mapeados</div>
          <div className="text-2xl font-bold text-white">{(competitors ?? []).length}</div>
        </CardContent></Card>
        <Card className="border-border bg-card"><CardContent className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1"><TrendingUp className="h-4 w-4 text-green-400" />Win Rate Medio vs Concorrentes</div>
          <div className="text-2xl font-bold text-white">{avgWinRate.toFixed(0)}%</div>
        </CardContent></Card>
        <Card className="border-border bg-card"><CardContent className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1"><Shield className="h-4 w-4 text-purple-400" />Segmentos Cobertos</div>
          <div className="text-2xl font-bold text-white">{new Set((competitors ?? []).map(c => c.segment).filter(Boolean)).size}</div>
        </CardContent></Card>
      </div>

      <Input placeholder="Buscar concorrente ou segmento..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Nenhum concorrente mapeado.</p>
            {canCreate && <p className="text-sm mt-1">Clique em "Novo Concorrente" para adicionar.</p>}
          </div>
        ) : (
          filtered.map(c => {
            const priceCfg = priceLevelConfig[c.priceLevel as keyof typeof priceLevelConfig] ?? priceLevelConfig.medio
            return (
              <Card key={c.id} className="border-border bg-card hover:bg-card/80 transition-colors cursor-pointer" onClick={() => setSelected(c)}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base text-white">{c.name}</CardTitle>
                    <Badge className={priceCfg.color}>{priceCfg.label}</Badge>
                  </div>
                  {c.website && (
                    <a href={c.website} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-400 hover:underline"
                      onClick={e => e.stopPropagation()}>
                      <ExternalLink className="h-3 w-3" />{c.website}
                    </a>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  {c.segment && <div className="text-xs text-muted-foreground">Segmento: <span className="text-white">{c.segment}</span></div>}
                  {c.mainProducts && <div className="text-xs text-muted-foreground line-clamp-2">{c.mainProducts}</div>}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="flex items-center gap-1 text-green-400"><TrendingUp className="h-3 w-3" />Win Rate</span>
                      <span className="text-white">{c.winRate ?? 0}%</span>
                    </div>
                    <Progress value={c.winRate ?? 0} className="h-1.5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="flex items-center gap-1 text-red-400"><TrendingDown className="h-3 w-3" />Loss Rate</span>
                      <span className="text-white">{c.lossRate ?? 0}%</span>
                    </div>
                    <Progress value={c.lossRate ?? 0} className="h-1.5 [&>div]:bg-red-500" />
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Detail Dialog */}
      {selected && (
        <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{selected.name}</DialogTitle></DialogHeader>
            <div className="space-y-4 text-sm">
              {selected.positioning && <div><span className="text-muted-foreground">Posicionamento: </span>{selected.positioning}</div>}
              {selected.strengths && <div><span className="font-medium text-green-400">Pontos Fortes:</span><p className="mt-1 text-muted-foreground">{selected.strengths}</p></div>}
              {selected.weaknesses && <div><span className="font-medium text-red-400">Pontos Fracos:</span><p className="mt-1 text-muted-foreground">{selected.weaknesses}</p></div>}
              {selected.notes && <div><span className="font-medium text-white">Notas Internas:</span><p className="mt-1 text-muted-foreground">{selected.notes}</p></div>}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
