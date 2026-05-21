import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export interface SaleOrder {
  id: string;
  order_number: string | null;
  account_id: string | null;
  executive_id: string | null;
  distributor: string | null;
  product: string | null;
  sale_type: 'Oneshot' | 'Recorrente' | 'Servico' | null;
  sale_value: number;
  cost: number;
  direct_sale: boolean;
  currency: 'Dolar' | 'Reais' | 'Euro';
  sale_date: string | null;
  invoice_date: string | null;
  due_date: string | null;
  receipt_date: string | null;
  invoice_value: number | null;
  ptax: number | null;
  receipt_status: 'OK' | 'Pendente' | 'Atrasado' | 'Cancelado';
  icms_pct: number;
  ipi_pct: number;
  pis_pct: number;
  cofins_pct: number;
  iss_pct: number;
  icms_value: number;
  ipi_value: number;
  pis_value: number;
  cofins_value: number;
  iss_value: number;
  total_taxes: number;
  gross_margin: number;
  gross_margin_pct: number;
  nf_cost: number;
  pre_commission_margin: number;
  seller_commission_pct: number;
  seller_commission_date: string | null;
  sdr_commission_pct: number;
  sdr_commission_date: string | null;
  final_margin: number;
  final_margin_pct: number;
  notes: string | null;
  created_at: string;
  account_name?: string;
  executive_name?: string;
}

export type SaleOrderInput = Omit<
  SaleOrder,
  | 'id' | 'created_at'
  | 'icms_value' | 'ipi_value' | 'pis_value' | 'cofins_value' | 'iss_value'
  | 'total_taxes' | 'gross_margin' | 'gross_margin_pct'
  | 'pre_commission_margin' | 'final_margin' | 'final_margin_pct'
  | 'account_name' | 'executive_name'
>;

interface SaleOrdersState {
  orders: SaleOrder[];
  loading: boolean;
  fetchOrders: () => Promise<void>;
  createOrder: (data: SaleOrderInput) => Promise<void>;
  updateOrder: (id: string, data: Partial<SaleOrderInput>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
}

export const useSaleOrdersStore = create<SaleOrdersState>((set, get) => ({
  orders: [],
  loading: false,

  fetchOrders: async () => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('sale_orders')
      .select('*, accounts(name), app_users(name)')
      .order('sale_date', { ascending: false });
    if (error) { console.error(error); set({ loading: false }); return; }
    const orders = (data ?? []).map((o: any) => ({
      ...o,
      account_name: o.accounts?.name ?? '—',
      executive_name: o.app_users?.name ?? '—',
    }));
    set({ orders, loading: false });
  },

  createOrder: async (data) => {
    const { error } = await supabase.from('sale_orders').insert(data);
    if (error) throw error;
    await get().fetchOrders();
  },

  updateOrder: async (id, data) => {
    const { error } = await supabase.from('sale_orders').update(data).eq('id', id);
    if (error) throw error;
    await get().fetchOrders();
  },

  deleteOrder: async (id) => {
    const { error } = await supabase.from('sale_orders').delete().eq('id', id);
    if (error) throw error;
    set((s) => ({ orders: s.orders.filter((o) => o.id !== id) }));
  },
}));
