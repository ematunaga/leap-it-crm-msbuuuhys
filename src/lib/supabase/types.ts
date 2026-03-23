// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      access_profiles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          permissions: Json | null
          status: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          permissions?: Json | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          permissions?: Json | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      accounts: {
        Row: {
          account_health: string | null
          account_owner_email: string | null
          account_owner_id: string | null
          account_owner_name: string | null
          account_potential: number | null
          account_tier: string | null
          branches: Json | null
          cnpj: string | null
          created_at: string | null
          current_environment: string | null
          current_vendors: Json | null
          email: string | null
          headquarters_address: string | null
          headquarters_city: string | null
          headquarters_state: string | null
          headquarters_zip: string | null
          id: string
          industry: string | null
          last_interaction_at: string | null
          linkedin: string | null
          logo: string | null
          main_pain: string | null
          name: string
          next_action_date: string | null
          notes: string | null
          phone: string | null
          porte: string | null
          relationship_status: string | null
          segment: string | null
          state_registration: string | null
          status: string | null
          strategic_notes: string | null
          trading_name: string | null
          updated_at: string | null
          website: string | null
          white_space_notes: string | null
        }
        Insert: {
          account_health?: string | null
          account_owner_email?: string | null
          account_owner_id?: string | null
          account_owner_name?: string | null
          account_potential?: number | null
          account_tier?: string | null
          branches?: Json | null
          cnpj?: string | null
          created_at?: string | null
          current_environment?: string | null
          current_vendors?: Json | null
          email?: string | null
          headquarters_address?: string | null
          headquarters_city?: string | null
          headquarters_state?: string | null
          headquarters_zip?: string | null
          id?: string
          industry?: string | null
          last_interaction_at?: string | null
          linkedin?: string | null
          logo?: string | null
          main_pain?: string | null
          name: string
          next_action_date?: string | null
          notes?: string | null
          phone?: string | null
          porte?: string | null
          relationship_status?: string | null
          segment?: string | null
          state_registration?: string | null
          status?: string | null
          strategic_notes?: string | null
          trading_name?: string | null
          updated_at?: string | null
          website?: string | null
          white_space_notes?: string | null
        }
        Update: {
          account_health?: string | null
          account_owner_email?: string | null
          account_owner_id?: string | null
          account_owner_name?: string | null
          account_potential?: number | null
          account_tier?: string | null
          branches?: Json | null
          cnpj?: string | null
          created_at?: string | null
          current_environment?: string | null
          current_vendors?: Json | null
          email?: string | null
          headquarters_address?: string | null
          headquarters_city?: string | null
          headquarters_state?: string | null
          headquarters_zip?: string | null
          id?: string
          industry?: string | null
          last_interaction_at?: string | null
          linkedin?: string | null
          logo?: string | null
          main_pain?: string | null
          name?: string
          next_action_date?: string | null
          notes?: string | null
          phone?: string | null
          porte?: string | null
          relationship_status?: string | null
          segment?: string | null
          state_registration?: string | null
          status?: string | null
          strategic_notes?: string | null
          trading_name?: string | null
          updated_at?: string | null
          website?: string | null
          white_space_notes?: string | null
        }
        Relationships: []
      }
      activities: {
        Row: {
          account_id: string | null
          account_name: string | null
          attachments: Json | null
          attendees: Json | null
          channel: string | null
          completed: boolean | null
          completed_at: string | null
          contact_id: string | null
          contact_name: string | null
          created_at: string | null
          customer_signals: string | null
          date: string | null
          details: string | null
          duration_minutes: number | null
          engagement_level: string | null
          id: string
          interaction_at: string | null
          is_overdue: boolean | null
          lead_id: string | null
          location: string | null
          next_step: string | null
          next_step_date: string | null
          notes: string | null
          objections: string | null
          opportunity_id: string | null
          opportunity_title: string | null
          outcome: string | null
          owner_email: string | null
          owner_id: string | null
          owner_name: string | null
          priority: string | null
          related_id: string | null
          related_to: string | null
          scheduled_date: string | null
          source_entity: string | null
          status: string | null
          subject: string
          summary: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          account_id?: string | null
          account_name?: string | null
          attachments?: Json | null
          attendees?: Json | null
          channel?: string | null
          completed?: boolean | null
          completed_at?: string | null
          contact_id?: string | null
          contact_name?: string | null
          created_at?: string | null
          customer_signals?: string | null
          date?: string | null
          details?: string | null
          duration_minutes?: number | null
          engagement_level?: string | null
          id?: string
          interaction_at?: string | null
          is_overdue?: boolean | null
          lead_id?: string | null
          location?: string | null
          next_step?: string | null
          next_step_date?: string | null
          notes?: string | null
          objections?: string | null
          opportunity_id?: string | null
          opportunity_title?: string | null
          outcome?: string | null
          owner_email?: string | null
          owner_id?: string | null
          owner_name?: string | null
          priority?: string | null
          related_id?: string | null
          related_to?: string | null
          scheduled_date?: string | null
          source_entity?: string | null
          status?: string | null
          subject: string
          summary?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          account_id?: string | null
          account_name?: string | null
          attachments?: Json | null
          attendees?: Json | null
          channel?: string | null
          completed?: boolean | null
          completed_at?: string | null
          contact_id?: string | null
          contact_name?: string | null
          created_at?: string | null
          customer_signals?: string | null
          date?: string | null
          details?: string | null
          duration_minutes?: number | null
          engagement_level?: string | null
          id?: string
          interaction_at?: string | null
          is_overdue?: boolean | null
          lead_id?: string | null
          location?: string | null
          next_step?: string | null
          next_step_date?: string | null
          notes?: string | null
          objections?: string | null
          opportunity_id?: string | null
          opportunity_title?: string | null
          outcome?: string | null
          owner_email?: string | null
          owner_id?: string | null
          owner_name?: string | null
          priority?: string | null
          related_id?: string | null
          related_to?: string | null
          scheduled_date?: string | null
          source_entity?: string | null
          status?: string | null
          subject?: string
          summary?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_contact_id_fkey"
            columns: ["contact_id"]
            isOneToOne: false
            referencedRelation: "contacts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      app_users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          id: string
          last_sync_at: string | null
          name: string
          origin: string | null
          profile_id: string | null
          role: string | null
          status: string | null
          sync_status: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_sync_at?: string | null
          name: string
          origin?: string | null
          profile_id?: string | null
          role?: string | null
          status?: string | null
          sync_status?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_sync_at?: string | null
          name?: string
          origin?: string | null
          profile_id?: string | null
          role?: string | null
          status?: string | null
          sync_status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_users_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "access_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      competitors: {
        Row: {
          id: string
          name: string
          strength: string | null
          weakness: string | null
          win_rate: string | null
        }
        Insert: {
          id?: string
          name: string
          strength?: string | null
          weakness?: string | null
          win_rate?: string | null
        }
        Update: {
          id?: string
          name?: string
          strength?: string | null
          weakness?: string | null
          win_rate?: string | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          account_id: string | null
          account_name: string | null
          account_owner_email: string | null
          account_owner_id: string | null
          account_owner_name: string | null
          address: string | null
          avatar_url: string | null
          birthday: string | null
          city: string | null
          communication_style: string | null
          country: string | null
          created_at: string | null
          email: string | null
          id: string
          important_dates: Json | null
          influence_level_global: string | null
          linkedin: string | null
          mobile: string | null
          name: string
          notes: string | null
          phone: string | null
          position: string | null
          preferred_channel: string | null
          relationship_status: string | null
          relationship_strength: string | null
          state: string | null
          tags: Json | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          account_id?: string | null
          account_name?: string | null
          account_owner_email?: string | null
          account_owner_id?: string | null
          account_owner_name?: string | null
          address?: string | null
          avatar_url?: string | null
          birthday?: string | null
          city?: string | null
          communication_style?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          important_dates?: Json | null
          influence_level_global?: string | null
          linkedin?: string | null
          mobile?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          position?: string | null
          preferred_channel?: string | null
          relationship_status?: string | null
          relationship_strength?: string | null
          state?: string | null
          tags?: Json | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          account_id?: string | null
          account_name?: string | null
          account_owner_email?: string | null
          account_owner_id?: string | null
          account_owner_name?: string | null
          address?: string | null
          avatar_url?: string | null
          birthday?: string | null
          city?: string | null
          communication_style?: string | null
          country?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          important_dates?: Json | null
          influence_level_global?: string | null
          linkedin?: string | null
          mobile?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          position?: string | null
          preferred_channel?: string | null
          relationship_status?: string | null
          relationship_strength?: string | null
          state?: string | null
          tags?: Json | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contacts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          account_id: string | null
          end_date: string | null
          id: string
          mrr: number | null
          start_date: string | null
          status: string | null
        }
        Insert: {
          account_id?: string | null
          end_date?: string | null
          id?: string
          mrr?: number | null
          start_date?: string | null
          status?: string | null
        }
        Update: {
          account_id?: string | null
          end_date?: string | null
          id?: string
          mrr?: number | null
          start_date?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          company: string | null
          created_at: string | null
          id: string
          name: string
          source: string | null
          status: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          id?: string
          name: string
          source?: string | null
          status?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          id?: string
          name?: string
          source?: string | null
          status?: string | null
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          account_id: string | null
          account_name: string | null
          authority_status: string | null
          budget_margin: number | null
          budget_status: string | null
          business_impact: string | null
          champion_contact_id: string | null
          champion_status: string | null
          client_budget: number | null
          commission_percent: number | null
          competitive_position: string | null
          created_at: string | null
          currency: string | null
          days_in_stage: number | null
          deal_registration: boolean | null
          decision_criteria: string | null
          decision_maker_contact_id: string | null
          decision_maker_status: string | null
          decision_process: string | null
          distributor: string | null
          dollar_rate: number | null
          economic_buyer_contact_id: string | null
          economic_buyer_status: string | null
          expected_close_date: string | null
          fator_leapit: number | null
          forecast_category: string | null
          icms_hardware_percent: number | null
          icms_software_percent: number | null
          id: string
          identified_pain: string | null
          ipi_percent: number | null
          is_overdue: boolean | null
          iss_hardware_percent: number | null
          iss_software_percent: number | null
          last_interaction_at: string | null
          last_interaction_summary: string | null
          loss_reason: string | null
          loss_reason_detail: string | null
          main_competitor_id: string | null
          main_competitor_name: string | null
          modality: string | null
          mrr_value: number | null
          net_margin_percent: number | null
          next_step: string | null
          next_step_date: string | null
          notes: string | null
          opportunity_owner_id: string | null
          partner: string | null
          pis_cofins_percent: number | null
          primary_contact_id: string | null
          primary_contact_name: string | null
          priority: string | null
          product_type: string | null
          risk_level: string | null
          sale_type: string | null
          seller_commission_percent: number | null
          solution_type: string | null
          source: string | null
          stage: string | null
          stage_updated_at: string | null
          status_follow_up: string | null
          temperature: string | null
          timing_status: string | null
          title: string
          total_cost: number | null
          updated_at: string | null
          value: number | null
          value_usd: number | null
          win_probability: number | null
        }
        Insert: {
          account_id?: string | null
          account_name?: string | null
          authority_status?: string | null
          budget_margin?: number | null
          budget_status?: string | null
          business_impact?: string | null
          champion_contact_id?: string | null
          champion_status?: string | null
          client_budget?: number | null
          commission_percent?: number | null
          competitive_position?: string | null
          created_at?: string | null
          currency?: string | null
          days_in_stage?: number | null
          deal_registration?: boolean | null
          decision_criteria?: string | null
          decision_maker_contact_id?: string | null
          decision_maker_status?: string | null
          decision_process?: string | null
          distributor?: string | null
          dollar_rate?: number | null
          economic_buyer_contact_id?: string | null
          economic_buyer_status?: string | null
          expected_close_date?: string | null
          fator_leapit?: number | null
          forecast_category?: string | null
          icms_hardware_percent?: number | null
          icms_software_percent?: number | null
          id?: string
          identified_pain?: string | null
          ipi_percent?: number | null
          is_overdue?: boolean | null
          iss_hardware_percent?: number | null
          iss_software_percent?: number | null
          last_interaction_at?: string | null
          last_interaction_summary?: string | null
          loss_reason?: string | null
          loss_reason_detail?: string | null
          main_competitor_id?: string | null
          main_competitor_name?: string | null
          modality?: string | null
          mrr_value?: number | null
          net_margin_percent?: number | null
          next_step?: string | null
          next_step_date?: string | null
          notes?: string | null
          opportunity_owner_id?: string | null
          partner?: string | null
          pis_cofins_percent?: number | null
          primary_contact_id?: string | null
          primary_contact_name?: string | null
          priority?: string | null
          product_type?: string | null
          risk_level?: string | null
          sale_type?: string | null
          seller_commission_percent?: number | null
          solution_type?: string | null
          source?: string | null
          stage?: string | null
          stage_updated_at?: string | null
          status_follow_up?: string | null
          temperature?: string | null
          timing_status?: string | null
          title: string
          total_cost?: number | null
          updated_at?: string | null
          value?: number | null
          value_usd?: number | null
          win_probability?: number | null
        }
        Update: {
          account_id?: string | null
          account_name?: string | null
          authority_status?: string | null
          budget_margin?: number | null
          budget_status?: string | null
          business_impact?: string | null
          champion_contact_id?: string | null
          champion_status?: string | null
          client_budget?: number | null
          commission_percent?: number | null
          competitive_position?: string | null
          created_at?: string | null
          currency?: string | null
          days_in_stage?: number | null
          deal_registration?: boolean | null
          decision_criteria?: string | null
          decision_maker_contact_id?: string | null
          decision_maker_status?: string | null
          decision_process?: string | null
          distributor?: string | null
          dollar_rate?: number | null
          economic_buyer_contact_id?: string | null
          economic_buyer_status?: string | null
          expected_close_date?: string | null
          fator_leapit?: number | null
          forecast_category?: string | null
          icms_hardware_percent?: number | null
          icms_software_percent?: number | null
          id?: string
          identified_pain?: string | null
          ipi_percent?: number | null
          is_overdue?: boolean | null
          iss_hardware_percent?: number | null
          iss_software_percent?: number | null
          last_interaction_at?: string | null
          last_interaction_summary?: string | null
          loss_reason?: string | null
          loss_reason_detail?: string | null
          main_competitor_id?: string | null
          main_competitor_name?: string | null
          modality?: string | null
          mrr_value?: number | null
          net_margin_percent?: number | null
          next_step?: string | null
          next_step_date?: string | null
          notes?: string | null
          opportunity_owner_id?: string | null
          partner?: string | null
          pis_cofins_percent?: number | null
          primary_contact_id?: string | null
          primary_contact_name?: string | null
          priority?: string | null
          product_type?: string | null
          risk_level?: string | null
          sale_type?: string | null
          seller_commission_percent?: number | null
          solution_type?: string | null
          source?: string | null
          stage?: string | null
          stage_updated_at?: string | null
          status_follow_up?: string | null
          temperature?: string | null
          timing_status?: string | null
          title?: string
          total_cost?: number | null
          updated_at?: string | null
          value?: number | null
          value_usd?: number | null
          win_probability?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_stakeholders: {
        Row: {
          access_level: string | null
          account_id: string
          contact_id: string
          contact_name: string | null
          created_at: string | null
          id: string
          influence_level: string | null
          is_champion: boolean | null
          is_decision_maker: boolean | null
          is_economic_buyer: boolean | null
          notes: string | null
          opportunity_id: string
          role: string
          seniority_level: string | null
          stance: string | null
          updated_at: string | null
        }
        Insert: {
          access_level?: string | null
          account_id: string
          contact_id: string
          contact_name?: string | null
          created_at?: string | null
          id?: string
          influence_level?: string | null
          is_champion?: boolean | null
          is_decision_maker?: boolean | null
          is_economic_buyer?: boolean | null
          notes?: string | null
          opportunity_id: string
          role: string
          seniority_level?: string | null
          stance?: string | null
          updated_at?: string | null
        }
        Update: {
          access_level?: string | null
          account_id?: string
          contact_id?: string
          contact_name?: string | null
          created_at?: string | null
          id?: string
          influence_level?: string | null
          is_champion?: boolean | null
          is_decision_maker?: boolean | null
          is_economic_buyer?: boolean | null
          notes?: string | null
          opportunity_id?: string
          role?: string
          seniority_level?: string | null
          stance?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const


// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: access_profiles
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   description: text (nullable)
//   type: text (nullable)
//   status: text (nullable)
//   permissions: jsonb (nullable, default: '{}'::jsonb)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: accounts
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   trading_name: text (nullable)
//   cnpj: text (nullable)
//   state_registration: text (nullable)
//   headquarters_address: text (nullable)
//   headquarters_city: text (nullable)
//   headquarters_state: text (nullable)
//   headquarters_zip: text (nullable)
//   branches: jsonb (nullable, default: '[]'::jsonb)
//   segment: text (nullable)
//   porte: text (nullable)
//   industry: text (nullable)
//   website: text (nullable)
//   linkedin: text (nullable)
//   phone: text (nullable)
//   email: text (nullable)
//   status: text (nullable)
//   account_tier: text (nullable)
//   account_potential: numeric (nullable)
//   relationship_status: text (nullable)
//   account_health: text (nullable)
//   current_environment: text (nullable)
//   current_vendors: jsonb (nullable, default: '[]'::jsonb)
//   main_pain: text (nullable)
//   strategic_notes: text (nullable)
//   last_interaction_at: timestamp with time zone (nullable)
//   next_action_date: timestamp with time zone (nullable)
//   white_space_notes: text (nullable)
//   account_owner_id: uuid (nullable)
//   account_owner_email: text (nullable)
//   account_owner_name: text (nullable)
//   notes: text (nullable)
//   logo: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: activities
//   id: uuid (not null, default: gen_random_uuid())
//   owner_id: text (nullable)
//   owner_email: text (nullable)
//   owner_name: text (nullable)
//   account_id: uuid (nullable)
//   account_name: text (nullable)
//   contact_id: uuid (nullable)
//   contact_name: text (nullable)
//   opportunity_id: uuid (nullable)
//   opportunity_title: text (nullable)
//   lead_id: text (nullable)
//   type: text (nullable)
//   channel: text (nullable)
//   subject: text (not null)
//   summary: text (nullable)
//   details: text (nullable)
//   outcome: text (nullable)
//   engagement_level: text (nullable)
//   interaction_at: timestamp with time zone (nullable)
//   scheduled_date: timestamp with time zone (nullable)
//   next_step_date: timestamp with time zone (nullable)
//   status: text (nullable)
//   priority: text (nullable)
//   completed: boolean (nullable, default: false)
//   completed_at: timestamp with time zone (nullable)
//   is_overdue: boolean (nullable, default: false)
//   duration_minutes: numeric (nullable)
//   location: text (nullable)
//   attendees: jsonb (nullable, default: '[]'::jsonb)
//   objections: text (nullable)
//   customer_signals: text (nullable)
//   next_step: text (nullable)
//   source_entity: text (nullable)
//   attachments: jsonb (nullable, default: '[]'::jsonb)
//   notes: text (nullable)
//   related_to: text (nullable)
//   related_id: text (nullable)
//   date: timestamp with time zone (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: app_users
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   email: text (nullable)
//   role: text (nullable)
//   profile_id: uuid (nullable)
//   avatar_url: text (nullable)
//   status: text (nullable)
//   origin: text (nullable)
//   sync_status: text (nullable)
//   last_sync_at: timestamp with time zone (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: competitors
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   strength: text (nullable)
//   weakness: text (nullable)
//   win_rate: text (nullable)
// Table: contacts
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   email: text (nullable)
//   phone: text (nullable)
//   mobile: text (nullable)
//   position: text (nullable)
//   linkedin: text (nullable)
//   avatar_url: text (nullable)
//   birthday: text (nullable)
//   important_dates: jsonb (nullable, default: '[]'::jsonb)
//   account_id: uuid (nullable)
//   account_name: text (nullable)
//   address: text (nullable)
//   city: text (nullable)
//   state: text (nullable)
//   country: text (nullable)
//   zip_code: text (nullable)
//   relationship_status: text (nullable)
//   preferred_channel: text (nullable)
//   relationship_strength: text (nullable)
//   communication_style: text (nullable)
//   influence_level_global: text (nullable)
//   tags: jsonb (nullable, default: '[]'::jsonb)
//   account_owner_id: uuid (nullable)
//   account_owner_email: text (nullable)
//   account_owner_name: text (nullable)
//   notes: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: contracts
//   id: uuid (not null, default: gen_random_uuid())
//   account_id: uuid (nullable)
//   mrr: numeric (nullable)
//   start_date: timestamp with time zone (nullable)
//   end_date: timestamp with time zone (nullable)
//   status: text (nullable)
// Table: leads
//   id: uuid (not null, default: gen_random_uuid())
//   name: text (not null)
//   company: text (nullable)
//   status: text (nullable)
//   source: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
// Table: opportunities
//   id: uuid (not null, default: gen_random_uuid())
//   title: text (not null)
//   account_id: uuid (nullable)
//   account_name: text (nullable)
//   primary_contact_id: uuid (nullable)
//   primary_contact_name: text (nullable)
//   opportunity_owner_id: text (nullable)
//   value: numeric (nullable, default: 0)
//   currency: text (nullable, default: 'BRL'::text)
//   value_usd: numeric (nullable)
//   dollar_rate: numeric (nullable)
//   sale_type: text (nullable)
//   mrr_value: numeric (nullable)
//   modality: text (nullable)
//   commission_percent: numeric (nullable)
//   partner: text (nullable)
//   solution_type: text (nullable)
//   stage: text (nullable)
//   expected_close_date: timestamp with time zone (nullable)
//   source: text (nullable)
//   priority: text (nullable)
//   identified_pain: text (nullable)
//   business_impact: text (nullable)
//   decision_criteria: text (nullable)
//   decision_process: text (nullable)
//   budget_status: text (nullable)
//   authority_status: text (nullable)
//   timing_status: text (nullable)
//   champion_status: text (nullable)
//   champion_contact_id: uuid (nullable)
//   economic_buyer_status: text (nullable)
//   economic_buyer_contact_id: uuid (nullable)
//   decision_maker_status: text (nullable)
//   decision_maker_contact_id: uuid (nullable)
//   temperature: text (nullable)
//   win_probability: numeric (nullable)
//   risk_level: text (nullable)
//   next_step: text (nullable)
//   next_step_date: timestamp with time zone (nullable)
//   last_interaction_at: timestamp with time zone (nullable)
//   last_interaction_summary: text (nullable)
//   days_in_stage: numeric (nullable)
//   stage_updated_at: timestamp with time zone (nullable)
//   status_follow_up: text (nullable)
//   is_overdue: boolean (nullable, default: false)
//   main_competitor_id: text (nullable)
//   main_competitor_name: text (nullable)
//   competitive_position: text (nullable)
//   client_budget: numeric (nullable)
//   budget_margin: numeric (nullable)
//   total_cost: numeric (nullable)
//   fator_leapit: numeric (nullable)
//   product_type: text (nullable)
//   icms_hardware_percent: numeric (nullable)
//   ipi_percent: numeric (nullable)
//   iss_hardware_percent: numeric (nullable)
//   icms_software_percent: numeric (nullable)
//   pis_cofins_percent: numeric (nullable)
//   iss_software_percent: numeric (nullable)
//   seller_commission_percent: numeric (nullable)
//   net_margin_percent: numeric (nullable)
//   distributor: text (nullable)
//   deal_registration: boolean (nullable, default: false)
//   loss_reason: text (nullable)
//   loss_reason_detail: text (nullable)
//   forecast_category: text (nullable)
//   notes: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: opportunity_stakeholders
//   id: uuid (not null, default: gen_random_uuid())
//   opportunity_id: uuid (not null)
//   account_id: uuid (not null)
//   contact_id: uuid (not null)
//   contact_name: text (nullable)
//   role: text (not null)
//   influence_level: text (nullable)
//   seniority_level: text (nullable)
//   stance: text (nullable)
//   access_level: text (nullable)
//   is_champion: boolean (nullable, default: false)
//   is_economic_buyer: boolean (nullable, default: false)
//   is_decision_maker: boolean (nullable, default: false)
//   notes: text (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())

// --- CONSTRAINTS ---
// Table: access_profiles
//   PRIMARY KEY access_profiles_pkey: PRIMARY KEY (id)
// Table: accounts
//   PRIMARY KEY accounts_pkey: PRIMARY KEY (id)
// Table: activities
//   FOREIGN KEY activities_account_id_fkey: FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
//   FOREIGN KEY activities_contact_id_fkey: FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE
//   FOREIGN KEY activities_opportunity_id_fkey: FOREIGN KEY (opportunity_id) REFERENCES opportunities(id) ON DELETE CASCADE
//   PRIMARY KEY activities_pkey: PRIMARY KEY (id)
// Table: app_users
//   PRIMARY KEY app_users_pkey: PRIMARY KEY (id)
//   FOREIGN KEY app_users_profile_id_fkey: FOREIGN KEY (profile_id) REFERENCES access_profiles(id) ON DELETE SET NULL
// Table: competitors
//   PRIMARY KEY competitors_pkey: PRIMARY KEY (id)
// Table: contacts
//   FOREIGN KEY contacts_account_id_fkey: FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
//   PRIMARY KEY contacts_pkey: PRIMARY KEY (id)
// Table: contracts
//   FOREIGN KEY contracts_account_id_fkey: FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
//   PRIMARY KEY contracts_pkey: PRIMARY KEY (id)
// Table: leads
//   PRIMARY KEY leads_pkey: PRIMARY KEY (id)
// Table: opportunities
//   FOREIGN KEY opportunities_account_id_fkey: FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
//   PRIMARY KEY opportunities_pkey: PRIMARY KEY (id)
// Table: opportunity_stakeholders
//   PRIMARY KEY opportunity_stakeholders_pkey: PRIMARY KEY (id)

// --- ROW LEVEL SECURITY POLICIES ---
// Table: access_profiles
//   Policy "authenticated_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: accounts
//   Policy "authenticated_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: activities
//   Policy "authenticated_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: app_users
//   Policy "authenticated_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: competitors
//   Policy "authenticated_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: contacts
//   Policy "authenticated_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: contracts
//   Policy "authenticated_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: leads
//   Policy "authenticated_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: opportunities
//   Policy "authenticated_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true
// Table: opportunity_stakeholders
//   Policy "authenticated_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: true
//     WITH CHECK: true

// --- DATABASE FUNCTIONS ---
// FUNCTION handle_new_user()
//   CREATE OR REPLACE FUNCTION public.handle_new_user()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   DECLARE
//     v_profile_id uuid;
//   BEGIN
//     IF NEW.email ILIKE 'enio.matunaga@leapit.com.br' OR NEW.email ILIKE 'ematunaga@gmail.com' THEN
//       SELECT id INTO v_profile_id FROM public.access_profiles WHERE type = 'sistema' LIMIT 1;
//     END IF;
//   
//     INSERT INTO public.app_users (id, name, email, role, profile_id, status, origin)
//     VALUES (
//       NEW.id,
//       COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
//       NEW.email,
//       CASE WHEN v_profile_id IS NOT NULL THEN 'Administrador' ELSE 'Usuário' END,
//       v_profile_id,
//       'ativo',
//       'CRM'
//     )
//     ON CONFLICT (id) DO NOTHING;
//     
//     RETURN NEW;
//   END;
//   $function$
//   

