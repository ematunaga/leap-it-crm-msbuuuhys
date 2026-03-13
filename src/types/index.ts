export interface Account {
  id: string
  name: string
  logo: string
  segment: string
  tier: 'A' | 'B' | 'C'
  status: 'Ativo' | 'Inativo'
  lastInteractionAt: string
  whiteSpace: string
}

export interface Contact {
  id: string
  accountId: string
  name: string
  role: string
  email: string
  phone: string
  avatar: string
  influence: 'Champion' | 'Blocker' | 'Decision Maker' | 'Influencer'
}

export interface Opportunity {
  id: string
  accountId: string
  title: string
  value: number
  stage:
    | 'Prospecção'
    | 'Qualificação'
    | 'Proposta'
    | 'Negociação'
    | 'Fechado Ganho'
    | 'Fechado Perdido'
  temperature: 'Fria' | 'Morna' | 'Quente'
  nextStep: string
  nextStepDate: string
  isOverdue: boolean
  meddic: {
    metrics: string
    economicBuyer: string
    decisionCriteria: string
    decisionProcess: string
    identifyPain: string
    champion: string
  }
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
