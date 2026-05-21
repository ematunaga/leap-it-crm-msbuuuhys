import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSaleOrdersStore } from '@/stores/useSaleOrdersStore';
import { useAccountsStore } from '@/stores/useAccountsStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';

export default function SaleOrderForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, createOrder, updateOrder } = useSaleOrdersStore();
  const { accounts, fetchAccounts } = useAccountsStore();
  const [loading, setLoading] = useState(false);

  const existingOrder = id ? orders.find((o) => o.id === id) : null;

  const [formData, setFormData] = useState({
    order_number: existingOrder?.order_number ?? '',
    account_id: existingOrder?.account_id ?? '',
    product: existingOrder?.product ?? '',
    sale_type: existingOrder?.sale_type ?? 'Oneshot',
    sale_value: existingOrder?.sale_value ?? 0,
    cost: existingOrder?.cost ?? 0,
    currency: existingOrder?.currency ?? 'Reais',
    direct_sale: existingOrder?.direct_sale ?? false,
    sale_date: existingOrder?.sale_date ?? '',
    invoice_date: existingOrder?.invoice_date ?? '',
    due_date: existingOrder?.due_date ?? '',
    receipt_status: existingOrder?.receipt_status ?? 'Pendente',
    icms_pct: existingOrder?.icms_pct ?? 0,
    ipi_pct: existingOrder?.ipi_pct ?? 0,
    pis_pct: existingOrder?.pis_pct ?? 0.0165,
    cofins_pct: existingOrder?.cofins_pct ?? 0.076,
    iss_pct: existingOrder?.iss_pct ?? 0,
    nf_cost: existingOrder?.nf_cost ?? 0,
    seller_commission_pct: existingOrder?.seller_commission_pct ?? 0.05,
    sdr_commission_pct: existingOrder?.sdr_commission_pct ?? 0,
    distributor: existingOrder?.distributor ?? '',
    invoice_value: existingOrder?.invoice_value ?? null,
    ptax: existingOrder?.ptax ?? null,
    receipt_date: existingOrder?.receipt_date ?? null,
    seller_commission_date: existingOrder?.seller_commission_date ?? null,
    sdr_commission_date: existingOrder?.sdr_commission_date ?? null,
    executive_id: existingOrder?.executive_id ?? null,
    notes: existingOrder?.notes ?? '',
  });

  useEffect(() => { fetchAccounts(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await updateOrder(id, formData as any);
      } else {
        await createOrder(formData as any);
      }
      navigate('/sales');
    } catch (err) {
      alert('Erro ao salvar pedido: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/sales')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{id ? 'Editar' : 'Novo'} Pedido de Venda</h1>
          <p className="text-sm text-muted-foreground">Controle de vendas e margens</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
        {/* Identificação */}
        <div className="rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold">Identificação</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>N° do Pedido</Label>
              <Input value={formData.order_number} onChange={(e) => handleChange('order_number', e.target.value)} />
            </div>
            <div>
              <Label>Cliente *</Label>
              <Select value={formData.account_id} onValueChange={(v) => handleChange('account_id', v)}>
                <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {accounts.map((acc) => (
                    <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Produto/Solução *</Label>
              <Input value={formData.product} onChange={(e) => handleChange('product', e.target.value)} required />
            </div>
            <div>
              <Label>Tipo de Venda</Label>
              <Select value={formData.sale_type} onValueChange={(v) => handleChange('sale_type', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Oneshot">Oneshot</SelectItem>
                  <SelectItem value="Recorrente">Recorrente</SelectItem>
                  <SelectItem value="Servico">Serviço</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Distribuidor</Label>
              <Input value={formData.distributor} onChange={(e) => handleChange('distributor', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Financeiro */}
        <div className="rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold">Dados Financeiros</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Valor de Venda *</Label>
              <Input type="number" step="0.01" value={formData.sale_value} onChange={(e) => handleChange('sale_value', parseFloat(e.target.value) || 0)} required />
            </div>
            <div>
              <Label>Custo *</Label>
              <Input type="number" step="0.01" value={formData.cost} onChange={(e) => handleChange('cost', parseFloat(e.target.value) || 0)} required />
            </div>
            <div>
              <Label>Moeda</Label>
              <Select value={formData.currency} onValueChange={(v) => handleChange('currency', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Reais">Reais</SelectItem>
                  <SelectItem value="Dolar">Dólar</SelectItem>
                  <SelectItem value="Euro">Euro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Impostos */}
        <div className="rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold">Impostos (%)</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div><Label>ICMS</Label><Input type="number" step="0.0001" value={formData.icms_pct} onChange={(e) => handleChange('icms_pct', parseFloat(e.target.value) || 0)} /></div>
            <div><Label>IPI</Label><Input type="number" step="0.0001" value={formData.ipi_pct} onChange={(e) => handleChange('ipi_pct', parseFloat(e.target.value) || 0)} /></div>
            <div><Label>PIS</Label><Input type="number" step="0.0001" value={formData.pis_pct} onChange={(e) => handleChange('pis_pct', parseFloat(e.target.value) || 0)} /></div>
            <div><Label>COFINS</Label><Input type="number" step="0.0001" value={formData.cofins_pct} onChange={(e) => handleChange('cofins_pct', parseFloat(e.target.value) || 0)} /></div>
            <div><Label>ISS</Label><Input type="number" step="0.0001" value={formData.iss_pct} onChange={(e) => handleChange('iss_pct', parseFloat(e.target.value) || 0)} /></div>
          </div>
        </div>

        {/* Comissões */}
        <div className="rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold">Comissões (%)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label>Comissão Vendedor</Label><Input type="number" step="0.0001" value={formData.seller_commission_pct} onChange={(e) => handleChange('seller_commission_pct', parseFloat(e.target.value) || 0)} /></div>
            <div><Label>Comissão SDR</Label><Input type="number" step="0.0001" value={formData.sdr_commission_pct} onChange={(e) => handleChange('sdr_commission_pct', parseFloat(e.target.value) || 0)} /></div>
          </div>
        </div>

        {/* Datas */}
        <div className="rounded-xl border p-6 space-y-4">
          <h3 className="font-semibold">Datas</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><Label>Data da Venda</Label><Input type="date" value={formData.sale_date} onChange={(e) => handleChange('sale_date', e.target.value)} /></div>
            <div><Label>Data Faturamento</Label><Input type="date" value={formData.invoice_date} onChange={(e) => handleChange('invoice_date', e.target.value)} /></div>
            <div><Label>Data Vencimento</Label><Input type="date" value={formData.due_date} onChange={(e) => handleChange('due_date', e.target.value)} /></div>
          </div>
        </div>

        {/* Observações */}
        <div className="rounded-xl border p-6 space-y-4">
          <Label>Observações</Label>
          <Textarea value={formData.notes} onChange={(e) => handleChange('notes', e.target.value)} rows={4} />
        </div>

        {/* Ações */}
        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>{loading ? 'Salvando...' : 'Salvar Pedido'}</Button>
          <Button type="button" variant="outline" onClick={() => navigate('/sales')}>Cancelar</Button>
        </div>
      </form>
    </div>
  );
}
