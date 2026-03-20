import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react'
import { Account, Activity, Competitor, Contact, Contract, Lead, Opportunity } from '@/types'
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
  updateOppStage: (id: string, stage: string) => void
  addActivity: (activity: Omit<Activity, 'id'>) => void
  updateActivity: (id: string, updates: Partial<Activity>) => void
  addAccount: (account: Omit<Account, 'id'>) => void
  updateAccount: (id: string, updates: Partial<Account>) => void
  addContact: (contact: Omit<Contact, 'id'>) => void
  updateContact: (id: string, updates: Partial<Contact>) => void
  addOpportunity: (opp: Omit<Opportunity, 'id'>) => void
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => void
}

const CrmContext = createContext<CrmStore | null>(null)

export function CrmProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts)
  const [contacts, setContacts] = useState<Contact[]>(mockContacts)
  const [opps, setOpps] = useState<Opportunity[]>(mockOpps)
  const [activities, setActivities] = useState<Activity[]>(mockActivities)
  const [leads, setLeads] = useState<Lead[]>(mockLeads)
  const [competitors, setCompetitors] = useState<Competitor[]>(mockCompetitors)
  const [contracts, setContracts] = useState<Contract[]>(mockContracts)

  useEffect(() => {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]

    setActivities((prev) =>
      prev.map((a) => {
        const isPending =
          a.status === 'planejada' || a.status === 'em_andamento' || a.status === 'Pendente'
        const dateStr =
          a.scheduledDate?.split('T')[0] ||
          a.date?.split('T')[0] ||
          a.createdAt?.split('T')[0] ||
          todayStr
        if (isPending && dateStr < todayStr) {
          return { ...a, isOverdue: true, status: 'atrasada' }
        }
        return a
      }),
    )

    setOpps((prev) =>
      prev.map((o) => {
        const stageDate = new Date(o.stageUpdatedAt || o.createdAt || todayStr)
        const diffTime = Math.abs(today.getTime() - stageDate.getTime())
        const daysInStage = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        const isOverdue = !!(o.nextStepDate && o.nextStepDate < todayStr)
        return { ...o, daysInStage, isOverdue }
      }),
    )
  }, [])

  const updateOppStage = (id: string, stage: string) => {
    setOpps((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, stage, stageUpdatedAt: new Date().toISOString(), daysInStage: 0 } : o,
      ),
    )
  }

  const updateOpportunity = (id: string, updates: Partial<Opportunity>) => {
    setOpps((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)))
  }

  const updateAccount = (id: string, updates: Partial<Account>) => {
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)))
  }

  const updateContact = (id: string, updates: Partial<Contact>) => {
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)))
  }

  const updateActivity = (id: string, updates: Partial<Activity>) => {
    setActivities((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)))
  }

  const addAccount = (acc: Omit<Account, 'id'>) => {
    const newAcc = { ...acc, id: Math.random().toString(36).substr(2, 9) } as Account
    setAccounts((prev) => [newAcc, ...prev])
  }

  const addContact = (contact: Omit<Contact, 'id'>) => {
    const newContact = { ...contact, id: Math.random().toString(36).substr(2, 9) } as Contact
    setContacts((prev) => [newContact, ...prev])
  }

  const addOpportunity = (opp: Omit<Opportunity, 'id'>) => {
    const newOpp = {
      ...opp,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      stageUpdatedAt: new Date().toISOString(),
      daysInStage: 0,
    } as Opportunity
    setOpps((prev) => [newOpp, ...prev])
  }

  const addActivity = (act: Omit<Activity, 'id'>) => {
    const newAct = {
      ...act,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    } as Activity
    setActivities((prev) => [newAct, ...prev])

    if (act.opportunityId) {
      setOpps((prev) =>
        prev.map((o) => {
          if (o.id === act.opportunityId) {
            let newTemp = o.temperature
            if (act.outcome === 'positivo') newTemp = 'quente'
            if (act.outcome === 'neutro') newTemp = 'morna'
            if (act.outcome === 'negativo') newTemp = 'fria'

            const isPendingStatus =
              act.status === 'planejada' ||
              act.status === 'em_andamento' ||
              act.status === 'atrasada'

            return {
              ...o,
              temperature: newTemp,
              ...(isPendingStatus && act.summary
                ? { nextStep: act.summary, nextStepDate: act.scheduledDate }
                : {}),
            }
          }
          return o
        }),
      )
    }

    if (act.status === 'concluida' && act.accountId) {
      setAccounts((prev) =>
        prev.map((a) =>
          a.id === act.accountId
            ? { ...a, lastInteractionAt: act.interactionAt || new Date().toISOString() }
            : a,
        ),
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
      updateActivity,
      updateOpportunity,
      addAccount,
      updateAccount,
      addContact,
      updateContact,
      addOpportunity,
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
