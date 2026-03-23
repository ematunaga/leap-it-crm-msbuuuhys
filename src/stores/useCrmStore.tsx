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
import { useToast } from '@/hooks/use-toast'

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
  updateOppStage: (id: string, stage: string) => Promise<void>
  addActivity: (activity: Omit<Activity, 'id'>) => Promise<void>
  updateActivity: (id: string, updates: Partial<Activity>) => Promise<void>
  deleteActivity: (id: string) => Promise<void>
  addAccount: (account: Omit<Account, 'id'>) => Promise<void>
  bulkAddAccounts: (accounts: Omit<Account, 'id'>[]) => Promise<void>
  updateAccount: (id: string, updates: Partial<Account>) => Promise<void>
  deleteAccount: (id: string) => Promise<void>
  addContact: (contact: Omit<Contact, 'id'>) => Promise<void>
  bulkAddContacts: (contacts: Omit<Contact, 'id'>[]) => Promise<void>
  updateContact: (id: string, updates: Partial<Contact>) => Promise<void>
  deleteContact: (id: string) => Promise<void>
  addOpportunity: (opp: Omit<Opportunity, 'id'>) => Promise<void>
  updateOpportunity: (id: string, updates: Partial<Opportunity>) => Promise<void>
  deleteOpportunity: (id: string) => Promise<void>
  addStakeholder: (sh: Omit<OpportunityStakeholder, 'id'>) => Promise<void>
  updateStakeholder: (id: string, updates: Partial<OpportunityStakeholder>) => Promise<void>
  deleteStakeholder: (id: string) => Promise<void>
  addProfile: (profile: Omit<AccessProfile, 'id'>) => Promise<void>
  updateProfile: (id: string, updates: Partial<AccessProfile>) => Promise<void>
  addUser: (user: Omit<AppUser, 'id'> & { id?: string }) => Promise<void>
  updateUser: (id: string, updates: Partial<AppUser>) => Promise<void>
  deleteUser: (id: string) => Promise<void>
  syncWithPricingApp: () => Promise<void>
  restoreBackup: (backupData: any) => Promise<void>
  localSnapshots: { id: string; timestamp: string }[]
  restoreLocalSnapshot: (id: string) => Promise<void>
}

const CrmContext = createContext<CrmStore | null>(null)

export function CrmProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast()
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
  const [localSnapshots, setLocalSnapshots] = useState<{ id: string; timestamp: string }[]>([])

  useEffect(() => {
    const snaps = localStorage.getItem('leapit_snapshots')
    if (snaps) {
      try {
        setLocalSnapshots(JSON.parse(snaps))
      } catch (e) {
        console.warn('Failed to parse local snapshots', e)
      }
    }
  }, [])

  const saveLocalSnapshot = (data: any) => {
    try {
      const snapsStr = localStorage.getItem('leapit_snapshots')
      let snaps = snapsStr ? JSON.parse(snapsStr) : []
      const id = Date.now().toString()
      const payload = JSON.stringify(data)
      localStorage.setItem(`leapit_snap_${id}`, payload)
      snaps.push({ id, timestamp: new Date().toISOString() })
      if (snaps.length > 5) {
        const oldest = snaps.shift()
        localStorage.removeItem(`leapit_snap_${oldest.id}`)
      }
      localStorage.setItem('leapit_snapshots', JSON.stringify(snaps))
      setLocalSnapshots(snaps)
    } catch (e) {
      console.warn('Failed to save local snapshot', e)
    }
  }

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

        if (accData && oppData && (accData.length > 0 || oppData.length > 0)) {
          const snapsStr = localStorage.getItem('leapit_snapshots')
          let shouldSave = true
          if (snapsStr) {
            try {
              const snaps = JSON.parse(snapsStr)
              if (snaps.length > 0) {
                const last = snaps[snaps.length - 1]
                const hours =
                  (new Date().getTime() - new Date(last.timestamp).getTime()) / (1000 * 60 * 60)
                if (hours < 1) shouldSave = false
              }
            } catch (e) {
              console.warn('Failed to parse local snapshots for auto-save', e)
            }
          }
          if (shouldSave) {
            saveLocalSnapshot({
              accounts: toCamel(accData),
              contacts: toCamel(conData),
              opportunities: toCamel(oppData),
              activities: toCamel(actData),
              stakeholders: toCamel(stkData),
            })
          }
        }
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
        console.warn('Failed to fetch PTAX, using fallback', e)
      }
    }
    fetchPtax()
  }, [])

  const addEntity = async <T extends { id: string }>(
    table: string,
    item: Omit<T, 'id'>,
    setFn: React.Dispatch<React.SetStateAction<T[]>>,
  ) => {
    const id = uuidv4()
    const newItem = { ...item, id, createdAt: new Date().toISOString() } as unknown as T
    setFn((prev) => [newItem, ...prev])

    const { error } = await supabase.from(table).insert(toSnake(newItem))
    if (error) {
      console.error(`Error inserting into ${table}:`, error)
      toast({
        title: 'Falha na Sincronização',
        description: `Os dados não puderam ser salvos no banco. Verifique as informações. Detalhe: ${error.message}`,
        variant: 'destructive',
      })
      setFn((prev) => prev.filter((i) => i.id !== id))
      throw error
    }
  }

  const updateEntity = async <T extends { id: string }>(
    table: string,
    id: string,
    updates: Partial<T>,
    setFn: React.Dispatch<React.SetStateAction<T[]>>,
  ) => {
    const updatedPayload = { ...updates, updatedAt: new Date().toISOString() }

    let oldItem: T | undefined
    setFn((prev) => {
      const item = prev.find((i) => i.id === id)
      if (item) oldItem = { ...item }
      return prev.map((item) => (item.id === id ? { ...item, ...updatedPayload } : item))
    })

    const { error } = await supabase.from(table).update(toSnake(updatedPayload)).eq('id', id)
    if (error) {
      console.error(`Error updating ${table}:`, error)
      toast({
        title: 'Falha na Atualização',
        description: `As alterações não puderam ser salvas. Detalhe: ${error.message}`,
        variant: 'destructive',
      })
      if (oldItem) {
        setFn((prev) => prev.map((item) => (item.id === id ? oldItem! : item)))
      }
      throw error
    }
  }

  const deleteEntity = async <T extends { id: string }>(
    table: string,
    id: string,
    setFn: React.Dispatch<React.SetStateAction<T[]>>,
  ) => {
    let oldItem: T | undefined
    setFn((prev) => {
      const item = prev.find((i) => i.id === id)
      if (item) oldItem = { ...item }
      return prev.filter((item) => item.id !== id)
    })

    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) {
      console.error(`Error deleting from ${table}:`, error)
      toast({
        title: 'Falha na Exclusão',
        description: `O registro não pôde ser excluído. Detalhe: ${error.message}`,
        variant: 'destructive',
      })
      if (oldItem) {
        setFn((prev) => [oldItem!, ...prev])
      }
      throw error
    }
  }

  const restoreBackup = async (backupData: any) => {
    try {
      const restoreTable = async (table: string, items: any[]) => {
        if (!items || items.length === 0) return
        const payload = items.map(toSnake)
        const { error } = await supabase.from(table).upsert(payload)
        if (error) throw error
      }

      await restoreTable('accounts', backupData.accounts)
      await restoreTable('contacts', backupData.contacts)
      await restoreTable('opportunities', backupData.opportunities || backupData.opps)
      await restoreTable('activities', backupData.activities)
      await restoreTable('opportunity_stakeholders', backupData.stakeholders)

      toast({
        title: 'Restauração concluída!',
        description: 'Os dados foram recuperados com sucesso. Recarregando o sistema...',
      })
      setTimeout(() => window.location.reload(), 2000)
    } catch (e: any) {
      console.error('Restore error:', e)
      toast({
        title: 'Erro na restauração',
        description: e.message || 'Falha ao gravar no banco de dados.',
        variant: 'destructive',
      })
    }
  }

  const restoreLocalSnapshot = async (id: string) => {
    try {
      const dataStr = localStorage.getItem(`leapit_snap_${id}`)
      if (!dataStr) throw new Error('Snapshot não encontrado no armazenamento local.')
      const backupData = JSON.parse(dataStr)
      await restoreBackup(backupData)
    } catch (e: any) {
      toast({
        title: 'Erro ao restaurar snapshot local',
        description: e.message,
        variant: 'destructive',
      })
    }
  }

  const addAccount = async (acc: Omit<Account, 'id'>) => addEntity('accounts', acc, setAccounts)

  const bulkAddAccounts = async (newAccounts: Omit<Account, 'id'>[]) => {
    if (newAccounts.length === 0) return
    const items = newAccounts.map((item) => ({
      ...item,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    })) as Account[]

    setAccounts((prev) => [...items, ...prev])

    const { error } = await supabase.from('accounts').insert(items.map(toSnake))
    if (error) {
      console.error('Error bulk adding accounts:', error)
      toast({
        title: 'Falha na Importação',
        description: `Detalhe: ${error.message}`,
        variant: 'destructive',
      })
      setAccounts((prev) => prev.filter((p) => !items.find((i) => i.id === p.id)))
      throw error
    }
  }

  const updateAccount = async (id: string, updates: Partial<Account>) =>
    updateEntity('accounts', id, updates, setAccounts)
  const deleteAccount = async (id: string) => deleteEntity('accounts', id, setAccounts)

  const addContact = async (contact: Omit<Contact, 'id'>) =>
    addEntity('contacts', contact, setContacts)

  const bulkAddContacts = async (newContacts: Omit<Contact, 'id'>[]) => {
    if (newContacts.length === 0) return
    const items = newContacts.map((item) => ({
      ...item,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    })) as Contact[]

    setContacts((prev) => [...items, ...prev])

    const { error } = await supabase.from('contacts').insert(items.map(toSnake))
    if (error) {
      console.error('Error bulk adding contacts:', error)
      toast({
        title: 'Falha na Importação',
        description: `Detalhe: ${error.message}`,
        variant: 'destructive',
      })
      setContacts((prev) => prev.filter((p) => !items.find((i) => i.id === p.id)))
      throw error
    }
  }

  const updateContact = async (id: string, updates: Partial<Contact>) =>
    updateEntity('contacts', id, updates, setContacts)
  const deleteContact = async (id: string) => deleteEntity('contacts', id, setContacts)

  const addOpportunity = async (opp: Omit<Opportunity, 'id'>) => {
    const id = uuidv4()
    const newOpp = {
      ...opp,
      id,
      createdAt: new Date().toISOString(),
      stageUpdatedAt: new Date().toISOString(),
      daysInStage: 0,
    } as Opportunity

    setOpps((prev) => [newOpp, ...prev])

    const { error } = await supabase.from('opportunities').insert(toSnake(newOpp))
    if (error) {
      console.error('Error inserting opp:', error)
      toast({
        title: 'Falha na Sincronização',
        description: 'Não foi possível salvar a oportunidade. Verifique os campos preenchidos.',
        variant: 'destructive',
      })
      setOpps((prev) => prev.filter((o) => o.id !== id))
      throw error
    }
  }

  const updateOpportunity = async (id: string, updates: Partial<Opportunity>) =>
    updateEntity('opportunities', id, updates, setOpps)
  const deleteOpportunity = async (id: string) => deleteEntity('opportunities', id, setOpps)

  const updateOppStage = async (id: string, stage: string) => {
    await updateEntity(
      'opportunities',
      id,
      { stage, stageUpdatedAt: new Date().toISOString(), daysInStage: 0 },
      setOpps,
    )
  }

  const addStakeholder = async (sh: Omit<OpportunityStakeholder, 'id'>) =>
    addEntity('opportunity_stakeholders', sh, setStakeholders)
  const updateStakeholder = async (id: string, updates: Partial<OpportunityStakeholder>) =>
    updateEntity('opportunity_stakeholders', id, updates, setStakeholders)
  const deleteStakeholder = async (id: string) =>
    deleteEntity('opportunity_stakeholders', id, setStakeholders)

  const addProfile = async (profile: Omit<AccessProfile, 'id'>) =>
    addEntity('access_profiles', profile, setProfiles)
  const updateProfile = async (id: string, updates: Partial<AccessProfile>) =>
    updateEntity('access_profiles', id, updates, setProfiles)

  const addUser = async (user: Omit<AppUser, 'id'> & { id?: string }) => {
    const id = user.id || uuidv4()
    const newUser = {
      ...user,
      id,
      createdAt: new Date().toISOString(),
      syncStatus: 'pending',
    } as AppUser
    setUsers((prev) => [newUser, ...prev])

    const { error } = await supabase.from('app_users').insert(toSnake(newUser))
    if (error) {
      console.error('Error adding user:', error)
      toast({
        title: 'Erro de Sincronização',
        description: 'Não foi possível salvar o usuário.',
        variant: 'destructive',
      })
      setUsers((prev) => prev.filter((u) => u.id !== id))
      throw error
    }
  }

  const updateUser = async (id: string, updates: Partial<AppUser>) => {
    await updateEntity('app_users', id, { ...updates, syncStatus: 'pending' }, setUsers)
  }

  const deleteUser = async (id: string) => deleteEntity('app_users', id, setUsers)

  const addActivity = async (act: Omit<Activity, 'id'>) => {
    const id = uuidv4()
    const newAct = { ...act, id, createdAt: new Date().toISOString() } as Activity
    setActivities((prev) => [newAct, ...prev])

    const { error } = await supabase.from('activities').insert(toSnake(newAct))
    if (error) {
      console.error('Error adding activity:', error)
      toast({
        title: 'Erro de Sincronização',
        description: 'Não foi possível salvar a atividade.',
        variant: 'destructive',
      })
      setActivities((prev) => prev.filter((a) => a.id !== id))
      throw error
    }

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

        updateOpportunity(act.opportunityId, updates).catch((e) =>
          console.error('Failed cascading update to opportunity', e),
        )
      }
    }

    if (act.status === 'concluida' && act.accountId) {
      updateAccount(act.accountId, {
        lastInteractionAt: act.interactionAt || new Date().toISOString(),
      }).catch((e) => console.error('Failed cascading update to account', e))
    }
  }

  const updateActivity = async (id: string, updates: Partial<Activity>) =>
    updateEntity('activities', id, updates, setActivities)

  const deleteActivity = async (id: string) => deleteEntity('activities', id, setActivities)

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
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            status: 'ativo',
            origin: u.origin || 'central_auth',
            syncStatus: 'synced',
            lastSyncAt: new Date().toISOString(),
          }))

        for (const u of newUsers) {
          await addUser(u)
        }

        for (const u of users) {
          if (u.syncStatus !== 'synced') {
            await updateUser(u.id, { syncStatus: 'synced', lastSyncAt: new Date().toISOString() })
          }
        }
      }
    } catch (err) {
      console.error('[Sync] Edge function falhou. Utilizando fallback local.', err)
      toast({
        title: 'Erro de Integração',
        description: 'A sincronização falhou.',
        variant: 'destructive',
      })
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
      bulkAddAccounts,
      updateAccount,
      deleteAccount,
      addContact,
      bulkAddContacts,
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
      restoreBackup,
      localSnapshots,
      restoreLocalSnapshot,
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
      localSnapshots,
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
