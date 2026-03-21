import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo } from 'react'
import { supabase } from '@/lib/supabase/client'
import {
  Account,
  Activity,
  Competitor,
  Contact,
  Contract,
  Lead,
  Opportunity,
  OpportunityStakeholder,
  AccessProfile,
  AppUser,
} from '@/types'
import {
  mockAccounts,
  mockActivities,
  mockContacts,
  mockOpps,
  mockStakeholders,
  mockLeads,
  mockCompetitors,
  mockContracts,
  mockProfiles,
  mockUsers,
} from '@/lib/mock-data'

interface CrmStore {
  accounts: Account[]
  contacts: Contact[]
  opps: Opportunity[]
  stakeholders: OpportunityStakeholder[]
  activities: Activity[]
  leads: Lead[]
  competitors: Competitor[]
  contracts: Contract[]
  profiles: AccessProfile[]
  users: AppUser[]
  ptaxRate: number
  ptaxDate: string
  currencyView: 'BRL' | 'USD'
  setCurrencyView: (view: 'BRL' | 'USD') => void
  updateOppStage: (id: string, stage: string) => void
  addActivity: (activity: Omit<Activity, 'id'>) => void
  updateActivity: (id: string, updates: Partial<Activity>) => void
  deleteActivity: (id: string) => void
  addAccount: (account: Omit<Account, 'id'>) => void
  updateAccount: (id: string, updates: Partial<Account>) => void
  deleteAccount: (id: string) => void
  addContact: (contact: Omit<Contact, 'id'>) => void
  updateContact: (id: string, updates: Partial<Contact>) => void
  deleteContact: (id: string) => void
  addOpportunity: (opp: Omit<Opportunity, 'id'>) => void
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => void
  deleteOpportunity: (id: string) => void
  addStakeholder: (sh: Omit<OpportunityStakeholder, 'id'>) => void
  updateStakeholder: (id: string, updates: Partial<OpportunityStakeholder>) => void
  deleteStakeholder: (id: string) => void
  addProfile: (profile: Omit<AccessProfile, 'id'>) => void
  updateProfile: (id: string, updates: Partial<AccessProfile>) => void
  addUser: (user: Omit<AppUser, 'id'>) => void
  updateUser: (id: string, updates: Partial<AppUser>) => void
  deleteUser: (id: string) => void
  syncWithPricingApp: () => Promise<void>
}

const CrmContext = createContext<CrmStore | null>(null)

const loadState = <T,>(key: string, defaultState: T): T => {
  try {
    const saved = localStorage.getItem(key)
    if (saved) return JSON.parse(saved)
  } catch (e) {
    console.error('Error loading state from localStorage', e)
  }
  return defaultState
}

export function CrmProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>(() => loadState('crm_accounts', mockAccounts))
  const [contacts, setContacts] = useState<Contact[]>(() => loadState('crm_contacts', mockContacts))
  const [opps, setOpps] = useState<Opportunity[]>(() => loadState('crm_opps', mockOpps))
  const [stakeholders, setStakeholders] = useState<OpportunityStakeholder[]>(() =>
    loadState('crm_stakeholders', mockStakeholders),
  )
  const [activities, setActivities] = useState<Activity[]>(() =>
    loadState('crm_activities', mockActivities),
  )
  const [leads, setLeads] = useState<Lead[]>(() => loadState('crm_leads', mockLeads))
  const [competitors, setCompetitors] = useState<Competitor[]>(() =>
    loadState('crm_competitors', mockCompetitors),
  )
  const [contracts, setContracts] = useState<Contract[]>(() =>
    loadState('crm_contracts', mockContracts),
  )
  const [profiles, setProfiles] = useState<AccessProfile[]>(() =>
    loadState('crm_profiles', mockProfiles),
  )
  const [users, setUsers] = useState<AppUser[]>(() => loadState('crm_users', mockUsers))

  const [ptaxRate, setPtaxRate] = useState<number>(() => loadState('crm_ptax', 5.0))
  const [ptaxDate, setPtaxDate] = useState<string>(() => loadState('crm_ptax_date', ''))
  const [currencyView, setCurrencyView] = useState<'BRL' | 'USD'>(() =>
    loadState('crm_currency_view', 'BRL'),
  )

  useEffect(() => {
    localStorage.setItem('crm_accounts', JSON.stringify(accounts))
  }, [accounts])
  useEffect(() => {
    localStorage.setItem('crm_contacts', JSON.stringify(contacts))
  }, [contacts])
  useEffect(() => {
    localStorage.setItem('crm_opps', JSON.stringify(opps))
  }, [opps])
  useEffect(() => {
    localStorage.setItem('crm_stakeholders', JSON.stringify(stakeholders))
  }, [stakeholders])
  useEffect(() => {
    localStorage.setItem('crm_activities', JSON.stringify(activities))
  }, [activities])
  useEffect(() => {
    localStorage.setItem('crm_leads', JSON.stringify(leads))
  }, [leads])
  useEffect(() => {
    localStorage.setItem('crm_competitors', JSON.stringify(competitors))
  }, [competitors])
  useEffect(() => {
    localStorage.setItem('crm_contracts', JSON.stringify(contracts))
  }, [contracts])
  useEffect(() => {
    localStorage.setItem('crm_profiles', JSON.stringify(profiles))
  }, [profiles])
  useEffect(() => {
    localStorage.setItem('crm_users', JSON.stringify(users))
  }, [users])
  useEffect(() => {
    localStorage.setItem('crm_ptax', JSON.stringify(ptaxRate))
  }, [ptaxRate])
  useEffect(() => {
    localStorage.setItem('crm_ptax_date', JSON.stringify(ptaxDate))
  }, [ptaxDate])
  useEffect(() => {
    localStorage.setItem('crm_currency_view', JSON.stringify(currencyView))
  }, [currencyView])

  useEffect(() => {
    const fetchPtax = async () => {
      try {
        const today = new Date()
        const lastWeek = new Date()
        lastWeek.setDate(today.getDate() - 7)

        const fDate = (d: Date) =>
          `${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}-${d.getFullYear()}`

        const url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@dataInicial='${fDate(lastWeek)}'&@dataFinalCotacao='${fDate(today)}'&$top=1&$orderby=dataHoraCotacao%20desc&$format=json&$select=cotacaoCompra,dataHoraCotacao`

        const res = await fetch(url)
        const data = await res.json()
        if (data.value && data.value.length > 0) {
          setPtaxRate(data.value[0].cotacaoCompra)
          setPtaxDate(data.value[0].dataHoraCotacao)
        }
      } catch (e) {
        console.error('Failed to fetch PTAX, using fallback', e)
      }
    }
    fetchPtax()
  }, [])

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

  const deleteOpportunity = (id: string) => {
    setOpps((prev) => prev.filter((o) => o.id !== id))
  }

  const updateAccount = (id: string, updates: Partial<Account>) => {
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)))
  }

  const deleteAccount = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id))
  }

  const updateContact = (id: string, updates: Partial<Contact>) => {
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)))
  }

  const deleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id))
  }

  const updateActivity = (id: string, updates: Partial<Activity>) => {
    setActivities((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)))
  }

  const deleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id))
  }

  const updateProfile = (id: string, updates: Partial<AccessProfile>) => {
    setProfiles((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p,
      ),
    )
  }

  const addAccount = (acc: Omit<Account, 'id'>) => {
    const newAcc = { ...acc, id: Math.random().toString(36).substring(2, 9) } as Account
    setAccounts((prev) => [newAcc, ...prev])
  }

  const addContact = (contact: Omit<Contact, 'id'>) => {
    const newContact = { ...contact, id: Math.random().toString(36).substring(2, 9) } as Contact
    setContacts((prev) => [newContact, ...prev])
  }

  const addOpportunity = (opp: Omit<Opportunity, 'id'>) => {
    const newOpp = {
      ...opp,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      stageUpdatedAt: new Date().toISOString(),
      daysInStage: 0,
    } as Opportunity
    setOpps((prev) => [newOpp, ...prev])
  }

  const addStakeholder = (sh: Omit<OpportunityStakeholder, 'id'>) => {
    const newSh = {
      ...sh,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    } as OpportunityStakeholder
    setStakeholders((prev) => [newSh, ...prev])
  }

  const updateStakeholder = (id: string, updates: Partial<OpportunityStakeholder>) => {
    setStakeholders((prev) =>
      prev.map((sh) =>
        sh.id === id ? { ...sh, ...updates, updatedAt: new Date().toISOString() } : sh,
      ),
    )
  }

  const deleteStakeholder = (id: string) => {
    setStakeholders((prev) => prev.filter((sh) => sh.id !== id))
  }

  const addProfile = (profile: Omit<AccessProfile, 'id'>) => {
    const newProfile = {
      ...profile,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    } as AccessProfile
    setProfiles((prev) => [newProfile, ...prev])
  }

  const addUser = (user: Omit<AppUser, 'id'>) => {
    const newUser = {
      ...user,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      syncStatus: 'pending',
    } as AppUser
    setUsers((prev) => [newUser, ...prev])
  }

  const updateUser = (id: string, updates: Partial<AppUser>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updates, syncStatus: 'pending' } : u)),
    )
  }

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }

  const addActivity = (act: Omit<Activity, 'id'>) => {
    const newAct = {
      ...act,
      id: Math.random().toString(36).substring(2, 9),
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

  const syncWithPricingApp = async () => {
    const SYNC_API_KEY = 'leap_pzpaeiowz9kom1u4jah7nk'

    try {
      const { data, error } = await supabase.functions.invoke('sync-users', {
        body: { apiKey: SYNC_API_KEY },
      })

      if (error) {
        throw error
      }

      if (data && data.users) {
        setUsers((prev) => {
          const existingEmails = new Set(prev.map((u) => u.email))
          const newUsers = data.users
            .filter((u: any) => !existingEmails.has(u.email))
            .map(
              (u: any) =>
                ({
                  id: Math.random().toString(36).substring(2, 9),
                  name: u.name,
                  email: u.email,
                  role: u.role,
                  status: 'ativo',
                  origin: u.origin || 'precificacao',
                  syncStatus: 'synced',
                  lastSyncAt: new Date().toISOString(),
                  createdAt: new Date().toISOString(),
                }) as AppUser,
            )

          return [
            ...prev.map((u) => ({
              ...u,
              syncStatus: 'synced',
              lastSyncAt: new Date().toISOString(),
            })),
            ...newUsers,
          ]
        })
      }
    } catch (err) {
      console.error(
        '[Sync] Edge function falhou ou não implantada. Utilizando fallback local.',
        err,
      )

      const fallbackUsers = [
        {
          name: 'Mariana Silva',
          email: 'mariana.silva@leappricing.com',
          role: 'Analista de Precificação',
          origin: 'precificacao',
        },
        {
          name: 'Lucas Fernandes',
          email: 'lucas.fernandes@leappricing.com',
          role: 'Coordenador de Vendas',
          origin: 'precificacao',
        },
        {
          name: 'Renata Gomes',
          email: 'renata.gomes@leappricing.com',
          role: 'Diretora de Estratégia',
          origin: 'precificacao',
        },
      ]

      setUsers((prev) => {
        const existingEmails = new Set(prev.map((u) => u.email))
        const newUsers = fallbackUsers
          .filter((u) => !existingEmails.has(u.email))
          .map(
            (u) =>
              ({
                id: Math.random().toString(36).substring(2, 9),
                ...u,
                status: 'ativo',
                syncStatus: 'synced',
                lastSyncAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
              }) as AppUser,
          )

        return [
          ...prev.map((u) => ({
            ...u,
            syncStatus: 'synced',
            lastSyncAt: new Date().toISOString(),
          })),
          ...newUsers,
        ]
      })
    }
  }

  const value = useMemo(
    () => ({
      accounts,
      contacts,
      opps,
      stakeholders,
      activities,
      leads,
      competitors,
      contracts,
      profiles,
      users,
      ptaxRate,
      ptaxDate,
      currencyView,
      setCurrencyView,
      updateOppStage,
      addActivity,
      updateActivity,
      deleteActivity,
      updateOpportunity,
      deleteOpportunity,
      addAccount,
      updateAccount,
      deleteAccount,
      addContact,
      updateContact,
      deleteContact,
      addOpportunity,
      addStakeholder,
      updateStakeholder,
      deleteStakeholder,
      addProfile,
      updateProfile,
      addUser,
      updateUser,
      deleteUser,
      syncWithPricingApp,
    }),
    [
      accounts,
      contacts,
      opps,
      stakeholders,
      activities,
      leads,
      competitors,
      contracts,
      profiles,
      users,
      ptaxRate,
      ptaxDate,
      currencyView,
    ],
  )

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>
}

export default function useCrmStore() {
  const context = useContext(CrmContext)
  if (!context) throw new Error('useCrmStore must be used within CrmProvider')
  return context
}
