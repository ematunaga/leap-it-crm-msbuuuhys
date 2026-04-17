import { useState } from 'react'
import { Plus, Search, Filter, UserPlus } from 'lucide-react'
import useCrmStore from '@/stores/useCrmStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Lead } from '@/types'

export default function LeadsList() {
  const { leads, addLead, convertLead } = useCrmStore()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('todos')
  const [tempFilter, setTempFilter] = useState<string>('todos')
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<Partial<Lead>>({
    status: 'novo',
    temperature: 'morna',
  })

  const filtered = leads.filter((l) => {
    const matchSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.company?.toLowerCase().includes(search.toLowerCase()) ||
      l.email?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'todos' || l.status === statusFilter
    const matchTemp = tempFilter === 'todos' || l.temperature === tempFilter
    return matchSearch && matchStatus && matchTemp
  })

  const handleSubmit = async () => {
    if (!formData.name || !formData.company) return
    await addLead(formData as Omit<Lead, 'id'>)
    setOpen(false)
    setFormData({ status: 'novo', temperature: 'morna' })
  }

  const handleConvert = async (id: string) => {
    if (confirm('Converter este lead em Account + Contact + Opportunity?')) {
      await convertLead(id, true)
    }
  }

  const statusColor: Record<string, string> = {
    novo: 'bg-blue-100 text-blue-800',
    contatado: 'bg-purple-100 text-purple-800',
    qualificado: 'bg-green-100 text-green-800',
    nao_qualificado: 'bg-red-100 text-red-800',
    convertido: 'bg-emerald-100 text-emerald-800',
  }

  const tempColor: Record<string, string> = {
    fria: 'bg-gray-100 text-gray-800',
    morna: 'bg-yellow-100 text-yellow-800',
    quente: 'bg-orange-100 text-orange-800',
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Leads</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Novo Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Novo Lead</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nome *</Label>
                  <Input
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Empresa *</Label>
                  <Input
                    value={formData.company || ''}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Telefone</Label>
                  <Input
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Cargo</Label>
                  <Input
                    value={formData.position || ''}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Segmento</Label>
                  <Select
                    value={formData.segment}
                    onValueChange={(v) => setFormData({ ...formData, segment: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="industria">Indústria</SelectItem>
                      <SelectItem value="saude">Saúde</SelectItem>
                      <SelectItem value="servico">Serviço</SelectItem>
                      <SelectItem value="varejo">Varejo</SelectItem>
                      <SelectItem value="educacao">Educação</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Origem</Label>
                  <Select
                    value={formData.source}
                    onValueChange={(v) => setFormData({ ...formData, source: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="indicacao">Indicação</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="site">Site</SelectItem>
                      <SelectItem value="evento">Evento</SelectItem>
                      <SelectItem value="cold_outbound">Cold Outbound</SelectItem>
                      <SelectItem value="parceiro">Parceiro</SelectItem>
                      <SelectItem value="campanha">Campanha</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Temperatura</Label>
                  <Select
                    value={formData.temperature}
                    onValueChange={(v) => setFormData({ ...formData, temperature: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fria">Fria</SelectItem>
                      <SelectItem value="morna">Morna</SelectItem>
                      <SelectItem value="quente">Quente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Valor Estimado</Label>
                <Input
                  type="number"
                  value={formData.estimatedValue || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, estimatedValue: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <Label>Observações</Label>
                <Input
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <Button onClick={handleSubmit} className="w-full">
                Criar Lead
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nome, empresa, email..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos Status</SelectItem>
            <SelectItem value="novo">Novo</SelectItem>
            <SelectItem value="contatado">Contatado</SelectItem>
            <SelectItem value="qualificado">Qualificado</SelectItem>
            <SelectItem value="nao_qualificado">Não Qualificado</SelectItem>
            <SelectItem value="convertido">Convertido</SelectItem>
          </SelectContent>
        </Select>
        <Select value={tempFilter} onValueChange={setTempFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Temperatura" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas Temp.</SelectItem>
            <SelectItem value="fria">Fria</SelectItem>
            <SelectItem value="morna">Morna</SelectItem>
            <SelectItem value="quente">Quente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Empresa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Temp.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Origem</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium">{lead.name}</td>
                <td className="px-6 py-4 text-sm">{lead.company}</td>
                <td className="px-6 py-4 text-sm">{lead.email}</td>
                <td className="px-6 py-4 text-sm">
                  <Badge className={statusColor[lead.status] || 'bg-gray-100'}>
                    {lead.status.replace('_', ' ')}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm">
                  <Badge className={tempColor[lead.temperature || 'morna']}>
                    {lead.temperature || 'morna'}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-sm">{lead.source || '-'}</td>
                <td className="px-6 py-4 text-sm">
                  {lead.status !== 'convertido' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleConvert(lead.id)}
                    >
                      <UserPlus className="h-4 w-4 mr-1" />
                      Converter
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Nenhum lead encontrado
          </div>
        )}
      </div>
    </div>
  )
}
