// FASE 3: FUNCIONALIDADES ENTERPRISE - Type Definitions

// ============================================
// EMAIL INTEGRATION (Gmail, Outlook)
// ============================================

export interface EmailProvider {
  id: string
  name: 'gmail' | 'outlook'
  email: string
  connected: boolean
  lastSync?: Date
  accessToken?: string
  refreshToken?: string
}

export interface EmailMessage {
  id: string
  provider: 'gmail' | 'outlook'
  threadId?: string
  subject: string
  from: EmailAddress
  to: EmailAddress[]
  cc?: EmailAddress[]
  bcc?: EmailAddress[]
  body: string
  bodyHtml?: string
  date: Date
  isRead: boolean
  hasAttachments: boolean
  attachments?: EmailAttachment[]
  labels?: string[]
  relatedContactId?: string
  relatedAccountId?: string
  relatedOpportunityId?: string
  sentimentScore?: number // IA sentiment analysis
}

export interface EmailAddress {
  email: string
  name?: string
}

export interface EmailAttachment {
  id: string
  filename: string
  mimeType: string
  size: number
  url?: string
}

export interface EmailDraft {
  to: EmailAddress[]
  cc?: EmailAddress[]
  bcc?: EmailAddress[]
  subject: string
  body: string
  attachments?: File[]
  relatedEntityId?: string
  relatedEntityType?: 'contact' | 'account' | 'opportunity'
}

// ============================================
// WHATSAPP BUSINESS API
// ============================================

export interface WhatsAppConfig {
  phoneNumberId: string
  businessAccountId: string
  accessToken: string
  webhookToken: string
  connected: boolean
}

export interface WhatsAppMessage {
  id: string
  from: string
  to: string
  body: string
  timestamp: Date
  type: 'text' | 'image' | 'video' | 'document' | 'audio' | 'template'
  status: 'sent' | 'delivered' | 'read' | 'failed'
  mediaUrl?: string
  relatedContactId?: string
  relatedOpportunityId?: string
}

export interface WhatsAppTemplate {
  id: string
  name: string
  language: string
  category: 'marketing' | 'utility' | 'authentication'
  components: WhatsAppTemplateComponent[]
  status: 'approved' | 'pending' | 'rejected'
}

export interface WhatsAppTemplateComponent {
  type: 'header' | 'body' | 'footer' | 'buttons'
  text?: string
  parameters?: string[]
}

// ============================================
// CALENDAR INTEGRATION
// ============================================

export interface CalendarEvent {
  id: string
  provider: 'google' | 'outlook'
  title: string
  description?: string
  startTime: Date
  endTime: Date
  location?: string
  attendees: CalendarAttendee[]
  organizer: EmailAddress
  meetingLink?: string
  relatedContactId?: string
  relatedOpportunityId?: string
  reminderMinutes?: number
  status: 'confirmed' | 'tentative' | 'cancelled'
}

export interface CalendarAttendee {
  email: string
  name?: string
  responseStatus?: 'accepted' | 'declined' | 'tentative' | 'needsAction'
  optional?: boolean
}

export interface AvailableSlot {
  startTime: Date
  endTime: Date
  duration: number // minutes
}

// ============================================
// NEXT BEST ACTION (IA)
// ============================================

export interface NextBestAction {
  id: string
  type: 'call' | 'email' | 'meeting' | 'task' | 'follow_up' | 'proposal'
  priority: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  reasoning: string // IA explanation
  suggestedDate?: Date
  relatedEntityId: string
  relatedEntityType: 'lead' | 'opportunity' | 'account' | 'contact'
  confidence: number // 0-100
  expectedImpact: 'high' | 'medium' | 'low'
  estimatedValue?: number
  dismissed: boolean
  completed: boolean
}

export interface AIInsight {
  id: string
  category: 'opportunity_risk' | 'churn_risk' | 'upsell_opportunity' | 'engagement_drop' | 'competitive_threat'
  severity: 'critical' | 'high' | 'medium' | 'low'
  title: string
  description: string
  recommendation: string
  dataPoints: string[]
  confidence: number
  createdAt: Date
  relatedEntityId?: string
  relatedEntityType?: string
}

// ============================================
// FORECASTING (ML)
// ============================================

export interface SalesForecast {
  id: string
  period: 'monthly' | 'quarterly' | 'yearly'
  periodStart: Date
  periodEnd: Date
  predictedRevenue: number
  confidenceInterval: [number, number] // [lower, upper]
  confidence: number // 0-100
  actualRevenue?: number
  variance?: number
  factors: ForecastFactor[]
  opportunities: OpportunityForecast[]
  generatedAt: Date
  model: string
}

export interface ForecastFactor {
  name: string
  impact: number // -100 to 100
  description: string
}

export interface OpportunityForecast {
  opportunityId: string
  opportunityName: string
  currentStage: string
  predictedCloseDate: Date
  winProbability: number // 0-100
  predictedValue: number
  confidenceScore: number
  riskFactors: string[]
}

export interface WinProbabilityModel {
  opportunityId: string
  probability: number // 0-100
  factors: {
    historical: number
    engagement: number
    stakeholders: number
    competition: number
    budget: number
    timeline: number
  }
  recommendation: string
}

// ============================================
// PWA / MOBILE
// ============================================

export interface PWAConfig {
  name: string
  shortName: string
  description: string
  themeColor: string
  backgroundColor: string
  icons: PWAIcon[]
  startUrl: string
  display: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser'
}

export interface PWAIcon {
  src: string
  sizes: string
  type: string
  purpose?: string
}

export interface OfflineData {
  lastSync: Date
  entities: {
    opportunities: string[] // IDs
    accounts: string[]
    contacts: string[]
    activities: string[]
  }
  pendingChanges: OfflineChange[]
}

export interface OfflineChange {
  id: string
  entityType: string
  entityId: string
  action: 'create' | 'update' | 'delete'
  data: any
  timestamp: Date
  synced: boolean
}

// ============================================
// NOTIFICATION SYSTEM
// ============================================

export interface PushNotification {
  id: string
  title: string
  body: string
  icon?: string
  badge?: string
  data?: Record<string, any>
  actions?: NotificationAction[]
  timestamp: Date
  read: boolean
}

export interface NotificationAction {
  action: string
  title: string
  icon?: string
}
