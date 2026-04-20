import { DashboardKPIs } from '@/components/dashboard/DashboardKPIs'
import { DashboardCharts } from '@/components/dashboard/DashboardCharts'
import { CriticalAlerts } from '@/components/dashboard/CriticalAlerts'
import { SalesFunnelChart } from '@/components/dashboard/SalesFunnelChart'
import { TeamPerformance } from '@/components/dashboard/TeamPerformance'
import { GlobalFilters } from '@/components/dashboard/GlobalFilters'
import { DashboardFilterProvider } from '@/contexts/DashboardFilterContext'

export default function Index() {
  return (
    <DashboardFilterProvider>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Visão Geral</h1>
            <p className="text-muted-foreground mt-1">
              Acompanhe seu pipeline e inteligência competitiva.
            </p>
          </div>
          <GlobalFilters />
        </div>

        <div className="space-y-6">
          <CriticalAlerts />
          <DashboardKPIs />
          <DashboardCharts />
          <div className="grid gap-6 md:grid-cols-2">
            <SalesFunnelChart />
            <TeamPerformance />
          </div>
        </div>
      </div>
    </DashboardFilterProvider>
  )
}
