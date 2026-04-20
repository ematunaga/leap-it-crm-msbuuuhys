import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react'
import { startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear, subMonths } from 'date-fns'

export type DateRangePreset = 'mes' | 'trimestre' | 'ano' | 'ultimo_trimestre' | 'ultimos_6_meses' | 'custom'

export interface DateRange {
  startDate: Date
  endDate: Date
}

export interface DashboardFilters {
  dateRange: DateRange
  preset: DateRangePreset
  ownerFilter: string | null
  stageFilter: string | null
}

interface DashboardFilterContextType {
  filters: DashboardFilters
  setDatePreset: (preset: DateRangePreset) => void
  setCustomDateRange: (startDate: Date, endDate: Date) => void
  setOwnerFilter: (ownerId: string | null) => void
  setStageFilter: (stage: string | null) => void
  resetFilters: () => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
}

const DashboardFilterContext = createContext<DashboardFilterContextType | undefined>(undefined)

const getDateRangeForPreset = (preset: DateRangePreset): DateRange => {
  const now = new Date()
  
  switch (preset) {
    case 'mes':
      return {
        startDate: startOfMonth(now),
        endDate: endOfMonth(now),
      }
    case 'trimestre':
      return {
        startDate: startOfQuarter(now),
        endDate: endOfQuarter(now),
      }
    case 'ano':
      return {
        startDate: startOfYear(now),
        endDate: endOfYear(now),
      }
    case 'ultimo_trimestre':
      const lastQuarter = subMonths(now, 3)
      return {
        startDate: startOfQuarter(lastQuarter),
        endDate: endOfQuarter(lastQuarter),
      }
    case 'ultimos_6_meses':
      return {
        startDate: subMonths(now, 6),
        endDate: now,
      }
    default:
      return {
        startDate: startOfMonth(now),
        endDate: endOfMonth(now),
      }
  }
}

export function DashboardFilterProvider({ children }: { children: ReactNode }) {
  const [preset, setPreset] = useState<DateRangePreset>('mes')
  const [customRange, setCustomRange] = useState<DateRange | null>(null)
  const [ownerFilter, setOwnerFilter] = useState<string | null>(null)
  const [stageFilter, setStageFilter] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const dateRange = useMemo(() => {
    return customRange || getDateRangeForPreset(preset)
  }, [preset, customRange])

  const setDatePreset = (newPreset: DateRangePreset) => {
    setPreset(newPreset)
    setCustomRange(null)
  }

  const setCustomDateRange = (startDate: Date, endDate: Date) => {
    setCustomRange({ startDate, endDate })
    setPreset('custom')
  }

  const resetFilters = () => {
    setPreset('mes')
    setCustomRange(null)
    setOwnerFilter(null)
    setStageFilter(null)
  }

  const filters: DashboardFilters = {
    dateRange,
    preset,
    ownerFilter,
    stageFilter,
  }

  return (
    <DashboardFilterContext.Provider
      value={{
        filters,
        setDatePreset,
        setCustomDateRange,
        setOwnerFilter,
        setStageFilter,
        resetFilters,
        isLoading,
        setIsLoading,
      }}
    >
      {children}
    </DashboardFilterContext.Provider>
  )
}

export function useDashboardFilters() {
  const context = useContext(DashboardFilterContext)
  if (context === undefined) {
    throw new Error('useDashboardFilters must be used within a DashboardFilterProvider')
  }
  return context
}
