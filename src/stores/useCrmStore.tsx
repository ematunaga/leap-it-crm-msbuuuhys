import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react'
import {
  Account,
  Activity,
  Competitor,
  Contact,
  Contract,
  Lead,
  Opportunity,
  Proposal,
} from '@/types'
import {
  mockAccounts,
  mockActivities,
  mockContacts,
  mockOpps,
  mockLeads,
  mockCompetitors,
  mockContracts,
} from '@/lib/mock-data'

interface CrmStore {
  accounts: Account[]
  contacts: Contact[]
  opps: Opportunity[]
  activities: Activity[]
  leads: Lead[]
  competitors: Competitor[]
  contracts: Contract[]
  updateOppStage: (id: string, stage: Opportunity['stage']) => void
  addActivity: (activity: Omit<Activity, 'id'>) => void
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => void
}

const CrmContext = createContext<CrmStore | null>(null)

export function CrmProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts)
  const [contacts, setContacts] = useState<Contact[]>(mockContacts)
  const [opps, setOpps] = useState<Opportunity[]>(mockOpps)
  const [activities, setActivities] = useState<Activity[]>(mockActivities)
  const [leads] = useState<Lead[]>(mockLeads)
  const [competitors] = useState<Competitor[]>(mockCompetitors)
  const [contracts] = useState<Contract[]>(mockContracts)

  // Run core automations on mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0]

    // Automation: Flag overdue activities and opps
    setActivities((prev) =>
      prev.map((a) => (a.status === 'Pendente' && a.date < today ? { ...a, isOverdue: true } : a)),
    )

    setOpps((prev) => prev.map((o) => (o.nextStepDate < today ? { ...o, isOverdue: true } : o)))
  }, [])

  const updateOppStage = (id: string, stage: Opportunity['stage']) => {
    setOpps((prev) => prev.map((o) => (o.id === id ? { ...o, stage } : o)))
  }

  const updateOpportunity = (id: string, updates: Partial<Opportunity>) => {
    setOpps((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)))
  }

  const addActivity = (act: Omit<Activity, 'id'>) => {
    const newAct = { ...act, id: Math.random().toString(36).substr(2, 9) } as Activity
    setActivities((prev) => [newAct, ...prev])

    // Automation: Temperature Logic & Next Step Sync
    if (act.relatedTo === 'Opportunity') {
      setOpps((prev) =>
        prev.map((o) => {
          if (o.id === act.relatedId) {
            let newTemp = o.temperature
            if (act.outcome === 'Positivo') newTemp = 'Quente'
            if (act.outcome === 'Neutro') newTemp = 'Morna'

            return {
              ...o,
              temperature: newTemp,
              // Sync next step if it's a future activity
              ...(act.status === 'Pendente'
                ? { nextStep: act.summary, nextStepDate: act.date }
                : {}),
            }
          }
          return o
        }),
      )
    }

    // Automation: Last Interaction Sync
    if (act.status === 'Concluída' && act.relatedTo === 'Account') {
      setAccounts((prev) =>
        prev.map((a) => (a.id === act.relatedId ? { ...a, lastInteractionAt: act.date } : a)),
      )
    }
  }

  const value = useMemo(
    () => ({
      accounts,
      contacts,
      opps,
      activities,
      leads,
      competitors,
      contracts,
      updateOppStage,
      addActivity,
      updateOpportunity,
    }),
    [accounts, contacts, opps, activities, leads, competitors, contracts],
  )

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>
}

export default function useCrmStore() {
  const context = useContext(CrmContext)
  if (!context) throw new Error('useCrmStore must be used within CrmProvider')
  return context
}
