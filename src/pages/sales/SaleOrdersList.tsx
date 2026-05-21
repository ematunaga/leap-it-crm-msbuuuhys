import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSaleOrdersStore } from '@/stores/useSaleOrdersStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, MoreHorizontal, Search, Trash2, Pencil } from 'lucide-react';

const STATUS_COLORS: Record<string, string> = {
  OK: 'bg-green-100 text-green-800 border-green-200',
  Pendente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Atrasado: 'bg-red-100 text-red-800 border-red-200',
  Cancelado: 'bg-gray-100 text-gray-600 border-gray-200',
};

const CURRENCY_SYMBOL: Record<string, string> = {
  Reais: 'R$', Dolar: 'US$', Euro: 'EUR',
};

function fmt(value: number, currency = 'Reais') {
  const symbol = CURRENCY_SYMBOL[currency] ?? 'R$';
  return `${symbol} ${(value ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtPct(value: number) {
  return `${((value ?? 0) * 100).toFixed(1)}%`;
}

export default function SaleOrdersList() {
  const navigate = useNavigate();
  const { orders, loading, fetchOrders, deleteOrder } = useSaleOrdersStore();
  const [search, setSearch] = useState('');

  useEffect(() => { fetchOrders(); }, []);

  const filtered = orders.filter((o) =>
    [o.order_number, o.account_name, o.product, o.executive_name, o.distributor]
      .some((v) => v?.toLowerCase().includes(search.toLowerCase()))
  );

  const totalVendas = orders.reduce((s, o) => s + (o.sale_value ?? 0), 0);
  const totalMargem = orders.reduce((s, o) => s + (o.final_margin ?? 0), 0);
  const mediaMargemPct = orders.length
    ? orders.reduce((s, o) => s + (o.final_margin_pct ?? 0), 0) / orders.length
    : 0;

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este pedido?')) return;
    await deleteOrder(id);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Controle de Vendas</h1>
          <p className="text-muted-foreground text-sm">Pedidos, margens e comissões</p>
        </div>
        <Button onClick={() => navigate('/sales/new')}>
          <Plus className="w-4 h-4 mr-2" /> Novo Pedido
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total de Vendas', value: fmt(totalVendas), sub: `${orders.length} pedidos` },
          { label: 'Margem Líquida Final', value: fmt(totalMargem), sub: 'soma dos pedidos' },
          { label: 'Margem Média', value: fmtPct(mediaMargemPct), sub: 'média dos pedidos' },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl border bg-card p-4 space-y-1">
            <p className="text-sm text-muted-foreground">{kpi.label}</p>
            <p className="text-2xl font-bold">{kpi.value}</p>
            <p className="text-xs text-muted-foreground">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Busca */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Buscar pedido, cliente, produto..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tabela */}
      <div className="rounded-xl border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N° Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Executivo</TableHead>
              <TableHead>Produto</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Valor Venda</TableHead>
              <TableHead className="text-right">Margem Final</TableHead>
              <TableHead className="text-right">Margem %</TableHead>
              <TableHead>Status NF</TableHead>
              <TableHead>Data Venda</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={11} className="text-center py-8 text-muted-foreground">Carregando...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={11} className="text-center py-8 text-muted-foreground">Nenhum pedido encontrado</TableCell></TableRow>
            ) : (
              filtered.map((order) => (
                <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{order.order_number ?? '—'}</TableCell>
                  <TableCell>{order.account_name}</TableCell>
                  <TableCell>{order.executive_name}</TableCell>
                  <TableCell className="max-w-[160px] truncate">{order.product ?? '—'}</TableCell>
                  <TableCell>{order.sale_type ?? '—'}</TableCell>
                  <TableCell className="text-right">{fmt(order.sale_value, order.currency)}</TableCell>
                  <TableCell className="text-right font-medium">{fmt(order.final_margin, order.currency)}</TableCell>
                  <TableCell className="text-right">
                    <span className={`font-semibold ${
                      (order.final_margin_pct ?? 0) >= 0.2 ? 'text-green-600' :
                      (order.final_margin_pct ?? 0) >= 0.1 ? 'text-yellow-600' : 'text-red-600'
                    }`}>{fmtPct(order.final_margin_pct)}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={STATUS_COLORS[order.receipt_status] ?? ''}>
                      {order.receipt_status}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.sale_date ? new Date(order.sale_date).toLocaleDateString('pt-BR') : '—'}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/sales/${order.id}`)}>
                          <Pencil className="w-4 h-4 mr-2" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(order.id)}>
                          <Trash2 className="w-4 h-4 mr-2" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
