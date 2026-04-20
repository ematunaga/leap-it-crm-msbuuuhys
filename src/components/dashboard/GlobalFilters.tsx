import { Card } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, RotateCcw, Filter, Loader2 } from 'lucide-react'
import { useDashboardFilters, DateRangePreset } from '@/contexts/DashboardFilterContext'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const PRESET_LABELS: Record<DateRangePreset, string> = {
  mes: 'Este Mês',
  trimestre: 'Este Trimestre',
  ano: 'Este Ano',
  ultimo_trimestre: 'Último Trimestre',
  ultimos_6_meses: 'Últimos 6 Meses',
  custom: 'Personalizado',
}

export function GlobalFilters() {
  const { filters, setDatePreset, resetFilters, isLoading } = useDashboardFilters()

  const handlePresetChange = (value: string) => {
    setDatePreset(value as DateRangePreset)
  }

  const formatDateRange = () => {
    if (filters.preset === 'custom') {
      return `${format(filters.dateRange.startDate, 'dd/MM/yy', { locale: ptBR })} - ${format(filters.dateRange.endDate, 'dd/MM/yy', { locale: ptBR })}`
    }
    return PRESET_LABELS[filters.preset]
  }

  return (
    <Card className="p-4 mb-6 shadow-subtle animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-sm font-semibold">Filtros Globais</h3>
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Select value={filters.preset} onValueChange={handlePresetChange}>
              <SelectTrigger className="w-[200px] bg-background">
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mes">Este Mês</SelectItem>
                <SelectItem value="trimestre">Este Trimestre</SelectItem>
                <SelectItem value="ano">Este Ano</SelectItem>
                <SelectItem value="ultimo_trimestre">Último Trimestre</SelectItem>
                <SelectItem value="ultimos_6_meses">Últimos 6 Meses</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Badge variant="secondary" className="text-xs px-3 py-1">
            {formatDateRange()}
          </Badge>

          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="gap-2"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Limpar
          </Button>
        </div>
      </div>

      {(filters.ownerFilter || filters.stageFilter) && (
        <div className="flex gap-2 mt-3 pt-3 border-t">
          <span className="text-xs text-muted-foreground">Filtros ativos:</span>
          {filters.ownerFilter && (
            <Badge variant="default" className="text-xs">
              Responsável: {filters.ownerFilter}
            </Badge>
          )}
          {filters.stageFilter && (
            <Badge variant="default" className="text-xs">
              Estágio: {filters.stageFilter}
            </Badge>
          )}
        </div>
      )}
    </Card>
  )
}
