import { DashboardKPIs } from '@/components/dashboard/DashboardKPIs'
import { DashboardCharts } from '@/components/dashboard/DashboardCharts'
import { CriticalAlerts } from '@/components/dashboard/CriticalAlerts'
import { InactivityAlerts } from '@/components/intelligence/InactivityAlerts'
import { WhiteSpaceAnalysis } from '@/components/intelligence/WhiteSpaceAnalysis'
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
      <CriticalAlerts />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InactivityAlerts />
        <WhiteSpaceAnalysis />
      </div>
    </div>
  )
}
