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
import { toCamel, toSnake, uuidv4 } from '@/lib/utils'

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

export function CrmProvider({ children }: { children: ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [contacts, setContacts] = useState<Contact[]>([])
  const [opps, setOpps] = useState<Opportunity[]>([])
  const [stakeholders, setStakeholders] = useState<OpportunityStakeholder[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [competitors, setCompetitors] = useState<Competitor[]>([])
  const [contracts, setContracts] = useState<Contract[]>([])
  const [profiles, setProfiles] = useState<AccessProfile[]>([])
  const [users, setUsers] = useState<AppUser[]>([])

  const [ptaxRate, setPtaxRate] = useState<number>(5.0)
  const [ptaxDate, setPtaxDate] = useState<string>('')
  const [currencyView, setCurrencyView] = useState<'BRL' | 'USD'>('BRL')

  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          { data: accData },
          { data: conData },
          { data: oppData },
          { data: actData },
          { data: stkData },
          { data: prfData },
          { data: usrData },
          { data: ldData },
          { data: cmpData },
          { data: ctrData },
        ] = await Promise.all([
          supabase.from('accounts').select('*').order('created_at', { ascending: false }),
          supabase.from('contacts').select('*').order('created_at', { ascending: false }),
          supabase.from('opportunities').select('*').order('created_at', { ascending: false }),
          supabase.from('activities').select('*').order('created_at', { ascending: false }),
          supabase
            .from('opportunity_stakeholders')
            .select('*')
            .order('created_at', { ascending: false }),
          supabase.from('access_profiles').select('*').order('created_at', { ascending: false }),
          supabase.from('app_users').select('*').order('created_at', { ascending: false }),
          supabase.from('leads').select('*').order('created_at', { ascending: false }),
          supabase.from('competitors').select('*'),
          supabase.from('contracts').select('*'),
        ])

        if (accData) setAccounts(toCamel(accData))
        if (conData) setContacts(toCamel(conData))
        if (oppData) setOpps(toCamel(oppData))
        if (actData) setActivities(toCamel(actData))
        if (stkData) setStakeholders(toCamel(stkData))
        if (prfData) setProfiles(toCamel(prfData))
        if (usrData) setUsers(toCamel(usrData))
        if (ldData) setLeads(toCamel(ldData))
        if (cmpData) setCompetitors(toCamel(cmpData))
        if (ctrData) setContracts(toCamel(ctrData))
      } catch (err) {
        console.error('Error fetching CRM initial data:', err)
      } finally {
        setIsInitialized(true)
      }
    }
    loadData()
  }, [])

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

  const addEntity = <T extends { id: string }>(
    table: string,
    item: Omit<T, 'id'>,
    setFn: React.Dispatch<React.SetStateAction<T[]>>,
  ) => {
    const id = uuidv4()
    const newItem = { ...item, id, createdAt: new Date().toISOString() } as unknown as T
    setFn((prev) => [newItem, ...prev])
    supabase
      .from(table)
      .insert(toSnake(newItem))
      .then(({ error }) => {
        if (error) console.error(`Error inserting into ${table}:`, error)
      })
  }

  const updateEntity = <T extends { id: string }>(
    table: string,
    id: string,
    updates: Partial<T>,
    setFn: React.Dispatch<React.SetStateAction<T[]>>,
  ) => {
    const updatedPayload = { ...updates, updatedAt: new Date().toISOString() }
    setFn((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedPayload } : item)))
    supabase
      .from(table)
      .update(toSnake(updatedPayload))
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.error(`Error updating ${table}:`, error)
      })
  }

  const deleteEntity = <T extends { id: string }>(
    table: string,
    id: string,
    setFn: React.Dispatch<React.SetStateAction<T[]>>,
  ) => {
    setFn((prev) => prev.filter((item) => item.id !== id))
    supabase
      .from(table)
      .delete()
      .eq('id', id)
      .then(({ error }) => {
        if (error) console.error(`Error deleting from ${table}:`, error)
      })
  }

  const addAccount = (acc: Omit<Account, 'id'>) => addEntity('accounts', acc, setAccounts)
  const updateAccount = (id: string, updates: Partial<Account>) =>
    updateEntity('accounts', id, updates, setAccounts)
  const deleteAccount = (id: string) => deleteEntity('accounts', id, setAccounts)

  const addContact = (contact: Omit<Contact, 'id'>) => addEntity('contacts', contact, setContacts)
  const updateContact = (id: string, updates: Partial<Contact>) =>
    updateEntity('contacts', id, updates, setContacts)
  const deleteContact = (id: string) => deleteEntity('contacts', id, setContacts)

  const addOpportunity = (opp: Omit<Opportunity, 'id'>) => {
    const id = uuidv4()
    const newOpp = {
      ...opp,
      id,
      createdAt: new Date().toISOString(),
      stageUpdatedAt: new Date().toISOString(),
      daysInStage: 0,
    } as Opportunity
    setOpps((prev) => [newOpp, ...prev])
    supabase
      .from('opportunities')
      .insert(toSnake(newOpp))
      .then(({ error }) => {
        if (error) console.error('Error inserting opp:', error)
      })
  }

  const updateOpportunity = (id: string, updates: Partial<Opportunity>) =>
    updateEntity('opportunities', id, updates, setOpps)
  const deleteOpportunity = (id: string) => deleteEntity('opportunities', id, setOpps)

  const updateOppStage = (id: string, stage: string) => {
    updateEntity(
      'opportunities',
      id,
      { stage, stageUpdatedAt: new Date().toISOString(), daysInStage: 0 },
      setOpps,
    )
  }

  const addStakeholder = (sh: Omit<OpportunityStakeholder, 'id'>) =>
    addEntity('opportunity_stakeholders', sh, setStakeholders)
  const updateStakeholder = (id: string, updates: Partial<OpportunityStakeholder>) =>
    updateEntity('opportunity_stakeholders', id, updates, setStakeholders)
  const deleteStakeholder = (id: string) =>
    deleteEntity('opportunity_stakeholders', id, setStakeholders)

  const addProfile = (profile: Omit<AccessProfile, 'id'>) =>
    addEntity('access_profiles', profile, setProfiles)
  const updateProfile = (id: string, updates: Partial<AccessProfile>) =>
    updateEntity('access_profiles', id, updates, setProfiles)

  const addUser = (user: Omit<AppUser, 'id'>) => {
    const id = uuidv4()
    const newUser = {
      ...user,
      id,
      createdAt: new Date().toISOString(),
      syncStatus: 'pending',
    } as AppUser
    setUsers((prev) => [newUser, ...prev])
    supabase
      .from('app_users')
      .insert(toSnake(newUser))
      .then(({ error }) => {
        if (error) console.error('Error adding user:', error)
      })
  }

  const updateUser = (id: string, updates: Partial<AppUser>) => {
    updateEntity('app_users', id, { ...updates, syncStatus: 'pending' }, setUsers)
  }

  const deleteUser = (id: string) => deleteEntity('app_users', id, setUsers)

  const addActivity = (act: Omit<Activity, 'id'>) => {
    const id = uuidv4()
    const newAct = { ...act, id, createdAt: new Date().toISOString() } as Activity
    setActivities((prev) => [newAct, ...prev])
    supabase
      .from('activities')
      .insert(toSnake(newAct))
      .then(({ error }) => {
        if (error) console.error('Error adding activity:', error)
      })

    if (act.opportunityId) {
      const opp = opps.find((o) => o.id === act.opportunityId)
      if (opp) {
        let newTemp = opp.temperature
        if (act.outcome === 'positivo') newTemp = 'quente'
        if (act.outcome === 'neutro') newTemp = 'morna'
        if (act.outcome === 'negativo') newTemp = 'fria'

        const isPendingStatus =
          act.status === 'planejada' || act.status === 'em_andamento' || act.status === 'atrasada'
        const updates: Partial<Opportunity> = { temperature: newTemp }
        if (isPendingStatus && act.summary) {
          updates.nextStep = act.summary
          updates.nextStepDate = act.scheduledDate
        }
        updateOpportunity(act.opportunityId, updates)
      }
    }

    if (act.status === 'concluida' && act.accountId) {
      updateAccount(act.accountId, {
        lastInteractionAt: act.interactionAt || new Date().toISOString(),
      })
    }
  }

  const updateActivity = (id: string, updates: Partial<Activity>) =>
    updateEntity('activities', id, updates, setActivities)

  const deleteActivity = (id: string) => deleteEntity('activities', id, setActivities)

  const syncWithPricingApp = async () => {
    const SYNC_API_KEY = 'leap_pzpaeiowz9kom1u4jah7nk'
    try {
      const { data, error } = await supabase.functions.invoke('sync-users', {
        body: { apiKey: SYNC_API_KEY },
      })
      if (error) throw error

      if (data && data.users) {
        const existingEmails = new Set(users.map((u) => u.email))
        const newUsers = data.users
          .filter((u: any) => !existingEmails.has(u.email))
          .map((u: any) => ({
            name: u.name,
            email: u.email,
            role: u.role,
            status: 'ativo',
            origin: u.origin || 'precificacao',
            syncStatus: 'synced',
            lastSyncAt: new Date().toISOString(),
          }))

        newUsers.forEach((u: any) => addUser(u))

        users.forEach((u) => {
          if (u.syncStatus !== 'synced') {
            updateUser(u.id, { syncStatus: 'synced', lastSyncAt: new Date().toISOString() })
          }
        })
      }
    } catch (err) {
      console.error('[Sync] Edge function falhou. Utilizando fallback local.', err)
    }
  }

  const computedActivities = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0]
    return activities.map((a) => {
      const isPending =
        a.status === 'planejada' || a.status === 'em_andamento' || a.status === 'Pendente'
      const dateStr =
        a.scheduledDate?.split('T')[0] || a.date?.split('T')[0] || a.createdAt?.split('T')[0] || ''
      if (isPending && dateStr && dateStr < todayStr) {
        return { ...a, isOverdue: true, status: 'atrasada' }
      }
      return a
    })
  }, [activities])

  const computedOpps = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0]
    return opps.map((o) => {
      const stageDate = new Date(o.stageUpdatedAt || o.createdAt || todayStr)
      const diffTime = Math.abs(new Date().getTime() - stageDate.getTime())
      const daysInStage = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      const isOverdue = !!(o.nextStepDate && o.nextStepDate < todayStr)
      return { ...o, daysInStage, isOverdue }
    })
  }, [opps])

  const value = useMemo(
    () => ({
      accounts,
      contacts,
      opps: computedOpps,
      stakeholders,
      activities: computedActivities,
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
      computedOpps,
      stakeholders,
      computedActivities,
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

  return (
    <CrmContext.Provider value={value}>
      {!isInitialized ? (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-muted/20">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <p className="text-muted-foreground font-medium text-sm">
              Sincronizando banco de dados...
            </p>
          </div>
        </div>
      ) : (
        children
      )}
    </CrmContext.Provider>
  )
}

export default function useCrmStore() {
  const context = useContext(CrmContext)
  if (!context) throw new Error('useCrmStore must be used within CrmProvider')
  return context
}
