import { useState } from 'react'
import { Plus, FileText, TrendingUp, DollarSign, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import useCrmStore from '@/stores/useCrmStore'
import { useRBAC } from '@/hooks/use-rbac'
import { formatMoney } from '@/lib/utils'
import type { Contract } from '@/types'

const statusConfig = {
  ativo: { label: 'Ativo', icon: CheckCircle, color: 'bg-green-500/10 text-green-400 border-green-500/20' },
  expirado: { label: 'Expirado', icon: AlertCircle, color: 'bg-red-500/10 text-red-400 border-red-500/20' },
  cancelado: { label: 'Cancelado', icon: XCircle, color: 'bg-gray-500/10 text-gray-400 border-gray-500/20' },
  pendente: { label: 'Pendente', icon: Clock, color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
  renovacao: { label: 'Em Renovacao', icon: TrendingUp, color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
}

const emptyForm: Partial<Contract> = {
  title: '', accountId: '', type: 'mensal', status: 'ativo', mrr: 0, arr: 0, totalValue: 0, currency: 'BRL', notes: '',
}

export default function ContractsList() {
  const { contracts, addContract, accounts } = useCrmStore()
  const { can } = useRBAC()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<Partial<Contract>>(emptyForm)

  const canCreate = can('contracts', 'create')

  const filtered = (contracts ?? []).filter(c => {
    const matchSearch = !search ||
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.accountName?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || c.status === statusFilter
    return matchSearch && matchStatus
  })

  const activeContracts = (contracts ?? []).filter(c => c.status === 'ativo')
  const totalMRR = activeContracts.reduce((sum, c) => sum + (c.mrr ?? 0), 0)
  const totalARR = totalMRR * 12
  const renewalCount = (contracts ?? []).filter(c => c.status === 'renovacao').length
  const expiredCount = (contracts ?? []).filter(c => c.status === 'expirado').length

  const handleSubmit = async () => {
    if (!form.title || !form.accountId) return
    await addContract({ ...form, id: crypto.randomUUID(), createdAt: new Date().toISOString() } as Contract)
    setForm(emptyForm)
    setOpen(false)
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Contratos</h1>
          <p className="text-muted-foreground">Gestao de contratos e MRR tracking</p>
        </div>
        {canCreate && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" />Novo Contrato</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>Novo Contrato</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Titulo *</Label><Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Ex: Contrato de Suporte Anual" /></div>
                <div><Label>Account *</Label>
                  <Select value={form.accountId} onValueChange={v => setForm(f => ({ ...f, accountId: v }))}>
                    <SelectTrigger><SelectValue placeholder="Selecionar account" /></SelectTrigger>
                    <SelectContent>{(accounts ?? []).map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Tipo</Label>
                    <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mensal">Mensal</SelectItem>
                        <SelectItem value="anual">Anual</SelectItem>
                        <SelectItem value="pontual">Pontual</SelectItem>
                        <SelectItem value="projeto">Projeto</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Status</Label>
                    <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{Object.entries(statusConfig).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div><Label>MRR (R$)</Label><Input type="number" value={form.mrr ?? 0} onChange={e => setForm(f => ({ ...f, mrr: Number(e.target.value), arr: Number(e.target.value) * 12 }))} /></div>
                  <div><Label>ARR (R$)</Label><Input type="number" value={form.arr ?? 0} readOnly className="opacity-60" /></div>
                  <div><Label>Valor Total (R$)</Label><Input type="number" value={form.totalValue ?? 0} onChange={e => setForm(f => ({ ...f, totalValue: Number(e.target.value) }))} /></div>
                </div>
                <div><Label>Notas</Label><Textarea value={form.notes ?? ''} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} /></div>
                <Button onClick={handleSubmit} className="w-full">Salvar Contrato</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border bg-card"><CardContent className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1"><DollarSign className="h-4 w-4 text-green-400" />MRR Total</div>
          <div className="text-2xl font-bold text-white">{formatMoney(totalMRR)}</div>
          <div className="text-xs text-muted-foreground">{activeContracts.length} contratos ativos</div>
        </CardContent></Card>
        <Card className="border-border bg-card"><CardContent className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1"><TrendingUp className="h-4 w-4 text-blue-400" />ARR Projetado</div>
          <div className="text-2xl font-bold text-white">{formatMoney(totalARR)}</div>
          <div className="text-xs text-muted-foreground">MRR x 12</div>
        </CardContent></Card>
        <Card className="border-border bg-card"><CardContent className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1"><Clock className="h-4 w-4 text-yellow-400" />Para Renovar</div>
          <div className="text-2xl font-bold text-white">{renewalCount}</div>
          <div className="text-xs text-muted-foreground">contratos em renovacao</div>
        </CardContent></Card>
        <Card className="border-border bg-card"><CardContent className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1"><AlertCircle className="h-4 w-4 text-red-400" />Expirados</div>
          <div className="text-2xl font-bold text-white">{expiredCount}</div>
          <div className="text-xs text-muted-foreground">requer atencao</div>
        </CardContent></Card>
      </div>

      <div className="flex gap-4 flex-wrap">
        <Input placeholder="Buscar por titulo ou account..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs" />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Filtrar status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            {Object.entries(statusConfig).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <Card className="border-border bg-card">
        <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Contratos ({filtered.length})</CardTitle></CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>Nenhum contrato encontrado.</p>
              {canCreate && <p className="text-sm mt-1">Clique em "Novo Contrato" para adicionar.</p>}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(contract => {
                const cfg = statusConfig[contract.status as keyof typeof statusConfig] ?? statusConfig.pendente
                const StatusIcon = cfg.icon
                return (
                  <div key={contract.id} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                        <FileText className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium text-white">{contract.title}</div>
                        <div className="text-sm text-muted-foreground">{contract.accountName ?? contract.accountId}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden md:block">
                        <div className="text-sm font-medium text-white">MRR: {formatMoney(contract.mrr ?? 0)}</div>
                        <div className="text-xs text-muted-foreground">ARR: {formatMoney((contract.mrr ?? 0) * 12)}</div>
                      </div>
                      <div className="text-xs text-muted-foreground hidden md:block">{contract.type ?? 'N/A'}</div>
                      <Badge className={cfg.color}><StatusIcon className="h-3 w-3 mr-1" />{cfg.label}</Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
