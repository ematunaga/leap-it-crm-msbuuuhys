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
  segment: 'industria' | 'saude' | 'servico' | 'varejo' | 'educacao' | 'outros'
  porte?:
    | '0-10'
    | '11-20'
    | '21-50'
    | '51-100'
    | '101-200'
    | '201-500'
    | '501-1000'
    | '1001-2000'
    | '2001-5000'
    | '5001-10000'
    | '10001+'
  industry?: string
  website?: string
  linkedin?: string
  phone?: string
  email?: string
  status: 'ativa' | 'inativa' | 'prospecto' | 'cliente'
  accountTier?: 'bronze' | 'prata' | 'ouro' | 'platina'
  accountPotential?: number
  relationshipStatus?: 'novo' | 'em_desenvolvimento' | 'estabelecido' | 'em_risco' | 'dormindo'
  accountHealth?: 'saudavel' | 'em_risco' | 'critico' | 'dormindo'
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
  relationshipStatus?: 'novo' | 'ativo' | 'inativo' | 'prospecto' | 'cliente' | 'parceiro'
  preferredChannel?: 'email' | 'telefone' | 'whatsapp' | 'linkedin' | 'reuniao'
  relationshipStrength?: 'fraco' | 'medio' | 'forte'
  communicationStyle?: string
  influenceLevelGlobal?: 'baixo' | 'medio' | 'alto'
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
  opportunityOwnerId: string
  opportunityOwnerEmail?: string
  opportunityOwnerName?: string

  value: number
  currency: 'BRL' | 'USD'
  valueUsd?: number
  dollarRate?: number
  saleType: 'one_shot' | 'recorrente'
  mrrValue?: number
  modality: 'revenda' | 'agenciamento'
  commissionPercent?: number
  partner: 'huawei' | 'huawei_cloud' | 'aws' | 'acronis' | 'fortinet' | 'outro'
  solutionType?: 'infraestrutura' | 'seguranca' | 'cloud' | 'misto'
  stage: 'prospeccao' | 'qualificacao' | 'proposta_enviada' | 'negociacao' | 'ganho' | 'perdido'
  expectedCloseDate?: string
  source?: 'indicacao' | 'site' | 'linkedin' | 'cold_call' | 'evento' | 'campanha' | 'outro'
  priority?: 'baixa' | 'media' | 'alta' | 'critica'

  identifiedPain?: string
  businessImpact?: string
  decisionCriteria?: string
  decisionProcess?: string
  budgetStatus?: 'nao_confirmado' | 'parcialmente_confirmado' | 'confirmado'
  authorityStatus?: 'nao_identificado' | 'identificado' | 'confirmado'
  timingStatus?: 'indefinido' | 'flexivel' | 'urgente' | 'critico'

  championStatus?: 'nao_identificado' | 'identificado' | 'confirmado'
  economicBuyerStatus?: 'nao_identificado' | 'identificado' | 'confirmado'
  decisionMakerStatus?: 'nao_identificado' | 'identificado' | 'confirmado'

  temperature: 'fria' | 'morna' | 'quente'
  winProbability?: number
  riskLevel?: 'baixo' | 'medio' | 'alto' | 'critico'
  nextStep: string
  nextStepDate: string
  lastInteractionAt?: string
  lastInteractionSummary?: string
  daysInStage?: number
  statusFollowUp?: 'em_dia' | 'atrasado' | 'critico'
  isOverdue?: boolean

  mainCompetitorId?: string
  mainCompetitorName?: string
  competitivePosition?: 'liderando' | 'empatado' | 'perdendo'

  clientBudget?: number
  budgetMargin?: number
  totalCost?: number
  fatorLeapit?: number
  productType?: 'hardware' | 'software_servico'
  icmsHardwarePercent?: number
  ipiPercent?: number
  issHardwarePercent?: number
  icmsSoftwarePercent?: number
  pisCofinsPercent?: number
  issSoftwarePercent?: number
  sellerCommissionPercent?: number
  netMarginPercent?: number
  distributor?: 'SND' | 'AGIS' | 'DICOMP' | 'INGRAM' | 'TD Synnex' | 'WDC' | 'ESY' | 'CLM'

  dealRegistration?: boolean
  lossReason?: string
  lossReasonDetail?: string
  forecastCategory?: 'pipeline' | 'best_case' | 'commit' | 'closed'
  createdAt?: string
  updatedAt?: string
  notes?: string
}

export interface Activity {
  id: string
  relatedTo: 'Account' | 'Opportunity' | 'Lead'
  relatedId: string
  type: 'Call' | 'Email' | 'Meeting' | 'Note'
  date: string
  status: 'Pendente' | 'Concluída'
  summary: string
  outcome?: 'Positivo' | 'Neutro' | 'Negativo'
  isOverdue?: boolean
}

export interface Lead {
  id: string
  name: string
  company: string
  status: 'Novo' | 'Contatado' | 'Qualificado' | 'Convertido'
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
  status: 'Ativo' | 'Expirando' | 'Cancelado'
}

export interface Proposal {
  id: string
  oppId: string
  version: number
  value: number
  expiresAt: string
  status: 'Rascunho' | 'Enviada' | 'Aprovada' | 'Rejeitada'
}
