export interface Account {
  id: string
  name: string
  tradingName?: string
  cnpj?: string
  stateRegistration?: string
  headquartersAddress?: string
  headquartersCity?: string
  headquartersState?: string
  headquartersZip?: string
  branches?: {
    cnpj: string
    ie: string
    address: string
    city: string
    state: string
    zip: string
  }[]
  segment: 'industria' | 'saude' | 'servico' | 'varejo' | 'educacao' | 'outros' | string
  porte?: string
  industry?: string
  website?: string
  linkedin?: string
  phone?: string
  email?: string
  status: 'ativa' | 'inativa' | 'prospecto' | 'cliente' | string
  accountTier?: 'bronze' | 'prata' | 'ouro' | 'platina' | string
  accountPotential?: number
  relationshipStatus?:
    | 'novo'
    | 'em_desenvolvimento'
    | 'estabelecido'
    | 'em_risco'
    | 'dormindo'
    | string
  accountHealth?: 'saudavel' | 'em_risco' | 'critico' | 'dormindo' | string
  currentEnvironment?: string
  currentVendors?: string[]
  mainPain?: string
  strategicNotes?: string
  lastInteractionAt?: string
  nextActionDate?: string
  whiteSpaceNotes?: string
  accountOwnerId?: string
  accountOwnerEmail?: string
  accountOwnerName?: string
  createdAt?: string
  updatedAt?: string
  notes?: string
  logo?: string
}

export interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  mobile?: string
  position?: string
  linkedin?: string
  avatarUrl?: string
  birthday?: string
  importantDates?: { description: string; date: string }[]
  accountId: string
  accountName?: string
  address?: string
  city?: string
  state?: string
  country?: string
  zipCode?: string
  relationshipStatus?: string
  preferredChannel?: string
  relationshipStrength?: string
  communicationStyle?: string
  influenceLevelGlobal?: string
  tags?: string[]
  accountOwnerId?: string
  accountOwnerEmail?: string
  accountOwnerName?: string
  createdAt?: string
  updatedAt?: string
  notes?: string
}

export interface Opportunity {
  id: string
  title: string
  accountId: string
  accountName?: string
  primaryContactId?: string
  primaryContactName?: string
  opportunityOwnerId?: string

  value: number
  currency: string
  valueUsd?: number
  dollarRate?: number
  saleType: string
  mrrValue?: number
  modality: string
  commissionPercent?: number
  partner: string
  solutionType?: string
  stage: string
  expectedCloseDate?: string
  source?: string
  priority?: string

  identifiedPain?: string
  businessImpact?: string
  decisionCriteria?: string
  decisionProcess?: string
  budgetStatus?: string
  authorityStatus?: string
  timingStatus?: string

  championStatus?: string
  championContactId?: string
  economicBuyerStatus?: string
  economicBuyerContactId?: string
  decisionMakerStatus?: string
  decisionMakerContactId?: string

  temperature: string
  winProbability?: number
  riskLevel?: string
  nextStep: string
  nextStepDate: string
  lastInteractionAt?: string
  lastInteractionSummary?: string
  daysInStage?: number
  stageUpdatedAt?: string
  statusFollowUp?: string
  isOverdue?: boolean

  mainCompetitorId?: string
  mainCompetitorName?: string
  competitivePosition?: string

  clientBudget?: number
  budgetMargin?: number
  totalCost?: number
  fatorLeapit?: number
  productType?: string
  icmsHardwarePercent?: number
  ipiPercent?: number
  issHardwarePercent?: number
  icmsSoftwarePercent?: number
  pisCofinsPercent?: number
  issSoftwarePercent?: number
  sellerCommissionPercent?: number
  netMarginPercent?: number
  distributor?: string

  dealRegistration?: boolean
  lossReason?: string
  lossReasonDetail?: string
  forecastCategory?: string
  createdAt?: string
  updatedAt?: string
  notes?: string
}

export interface Activity {
  id: string
  ownerId?: string
  ownerEmail?: string
  ownerName?: string

  accountId?: string
  accountName?: string
  contactId?: string
  contactName?: string
  opportunityId?: string
  opportunityTitle?: string
  leadId?: string

  type:
    | 'call'
    | 'email'
    | 'whatsapp'
    | 'meeting'
    | 'follow_up'
    | 'proposal_sent'
    | 'proposal_review'
    | 'visit'
    | 'task'
    | 'note'
    | string
  channel:
    | 'telefone'
    | 'email'
    | 'whatsapp'
    | 'linkedin'
    | 'reuniao_online'
    | 'reuniao_presencial'
    | 'interno'
    | 'outro'
    | string

  subject: string
  summary: string
  details?: string

  outcome?:
    | 'positivo'
    | 'neutro'
    | 'negativo'
    | 'sem_resposta'
    | 'reagendado'
    | 'cancelado'
    | 'concluido'
    | string
  engagementLevel?: 'baixo' | 'medio' | 'alto' | string

  interactionAt?: string
  scheduledDate?: string
  nextStepDate?: string

  status: 'planejada' | 'em_andamento' | 'concluida' | 'cancelada' | 'atrasada' | string
  priority?: 'baixa' | 'media' | 'alta' | 'critica' | string
  completed?: boolean
  completedAt?: string
  isOverdue?: boolean

  durationMinutes?: number
  location?: string
  attendees?: string[]

  objections?: string
  customerSignals?: string

  nextStep?: string

  sourceEntity?:
    | 'lead'
    | 'contact'
    | 'company'
    | 'opportunity'
    | 'proposal'
    | 'ticket'
    | 'manual'
    | string
  attachments?: { name: string; url: string }[]

  createdAt?: string
  updatedAt?: string
  notes?: string

  // Legacy fields mapped dynamically or kept for backwards compatibility where necessary
  relatedTo?: string
  relatedId?: string
  date?: string
}

export interface Lead {
  id: string
  name: string
  company: string
  status: string
  source: string
  createdAt: string
}

export interface Competitor {
  id: string
  name: string
  strength: string
  weakness: string
  winRate: string
}

export interface Contract {
  id: string
  accountId: string
  mrr: number
  startDate: string
  endDate: string
  status: string
}

export interface Proposal {
  id: string
  oppId: string
  version: number
  value: number
  expiresAt: string
  status: string
}
