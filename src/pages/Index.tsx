import { DashboardKPIs } from '@/components/dashboard/DashboardKPIs'
import { DashboardCharts } from '@/components/dashboard/DashboardCharts'
import { CriticalAlerts } from '@/components/dashboard/CriticalAlerts'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function Index() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Visão Geral</h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe seu pipeline e inteligência competitiva.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="mes">
            <SelectTrigger className="w-[140px] bg-background">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mes">Este Mês</SelectItem>
              <SelectItem value="trimestre">Este Trimestre</SelectItem>
              <SelectItem value="ano">Este Ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DashboardKPIs />
      <DashboardCharts />

      <div className="grid gap-6 md:grid-cols-3">
        <CriticalAlerts />
        <div
          className="md:col-span-2 bg-card rounded-xl border p-6 shadow-subtle flex flex-col justify-center items-center animate-fade-in-up"
          style={{ animationDelay: '700ms' }}
        >
          <h3 className="font-semibold text-lg mb-2">Espaço para Widgets Customizados</h3>
          <p className="text-sm text-muted-foreground text-center">
            Configure mais visões do MEDDIC ou Campanhas aqui através das configurações do painel.
          </p>
        </div>
      </div>
    </div>
  )
}
