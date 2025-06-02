export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      brand_briefs: {
        Row: {
          analysis_result: Json | null
          content: string
          created_at: string
          id: string
          processed_at: string | null
          recommendations: Json | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_result?: Json | null
          content: string
          created_at?: string
          id?: string
          processed_at?: string | null
          recommendations?: Json | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_result?: Json | null
          content?: string
          created_at?: string
          id?: string
          processed_at?: string | null
          recommendations?: Json | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      brief_analysis_cache: {
        Row: {
          analysis: Json
          brief_hash: string
          brief_text: string
          created_at: string | null
          expires_at: string | null
          id: string
          recommendations: Json
        }
        Insert: {
          analysis: Json
          brief_hash: string
          brief_text: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          recommendations: Json
        }
        Update: {
          analysis?: Json
          brief_hash?: string
          brief_text?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          recommendations?: Json
        }
        Relationships: []
      }
      campaign_analytics: {
        Row: {
          campaign_id: string
          clicks: number | null
          conversions: number | null
          created_at: string
          date: string
          engagement: number | null
          id: string
          impressions: number | null
          reach: number | null
          spend: number | null
        }
        Insert: {
          campaign_id: string
          clicks?: number | null
          conversions?: number | null
          created_at?: string
          date: string
          engagement?: number | null
          id?: string
          impressions?: number | null
          reach?: number | null
          spend?: number | null
        }
        Update: {
          campaign_id?: string
          clicks?: number | null
          conversions?: number | null
          created_at?: string
          date?: string
          engagement?: number | null
          id?: string
          impressions?: number | null
          reach?: number | null
          spend?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_analytics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_creators: {
        Row: {
          agreed_rate: number | null
          campaign_id: string
          contact_method: string | null
          contacted_at: string | null
          contract_signed: boolean | null
          created_at: string
          creator_id: string
          deliverables_count: number | null
          id: string
          negotiation_notes: string | null
          payment_status: string | null
          status: string
          updated_at: string
        }
        Insert: {
          agreed_rate?: number | null
          campaign_id: string
          contact_method?: string | null
          contacted_at?: string | null
          contract_signed?: boolean | null
          created_at?: string
          creator_id: string
          deliverables_count?: number | null
          id?: string
          negotiation_notes?: string | null
          payment_status?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          agreed_rate?: number | null
          campaign_id?: string
          contact_method?: string | null
          contacted_at?: string | null
          contract_signed?: boolean | null
          created_at?: string
          creator_id?: string
          deliverables_count?: number | null
          id?: string
          negotiation_notes?: string | null
          payment_status?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_creators_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_creators_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator database"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "creator_database_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator database"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          budget: number
          created_at: string
          description: string | null
          end_date: string
          id: string
          influencer_count: number
          name: string
          start_date: string
          status: string
          total_engagement: number
          total_impressions: number
          total_reach: number
          total_spend: number
          updated_at: string
          user_id: string
          workflow_step: string
        }
        Insert: {
          budget?: number
          created_at?: string
          description?: string | null
          end_date: string
          id?: string
          influencer_count?: number
          name: string
          start_date: string
          status?: string
          total_engagement?: number
          total_impressions?: number
          total_reach?: number
          total_spend?: number
          updated_at?: string
          user_id: string
          workflow_step?: string
        }
        Update: {
          budget?: number
          created_at?: string
          description?: string | null
          end_date?: string
          id?: string
          influencer_count?: number
          name?: string
          start_date?: string
          status?: string
          total_engagement?: number
          total_impressions?: number
          total_reach?: number
          total_spend?: number
          updated_at?: string
          user_id?: string
          workflow_step?: string
        }
        Relationships: []
      }
      contracts: {
        Row: {
          campaign_creator_id: string
          contract_type: string
          created_at: string
          expiry_date: string | null
          id: string
          signed_at: string | null
          status: string
          terms_content: string | null
          updated_at: string
        }
        Insert: {
          campaign_creator_id: string
          contract_type?: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          signed_at?: string | null
          status?: string
          terms_content?: string | null
          updated_at?: string
        }
        Update: {
          campaign_creator_id?: string
          contract_type?: string
          created_at?: string
          expiry_date?: string | null
          id?: string
          signed_at?: string | null
          status?: string
          terms_content?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_campaign_creator_id_fkey"
            columns: ["campaign_creator_id"]
            isOneToOne: false
            referencedRelation: "campaign_creators"
            referencedColumns: ["id"]
          },
        ]
      }
      "creator database": {
        Row: {
          collab_status: string | null
          contact_number: string | null
          country: string | null
          email: string | null
          engagement_rate: number | null
          followers: number | null
          handle: string | null
          id: string
          last_active: string | null
          name: string | null
          niche: string | null
          platform: string | null
        }
        Insert: {
          collab_status?: string | null
          contact_number?: string | null
          country?: string | null
          email?: string | null
          engagement_rate?: number | null
          followers?: number | null
          handle?: string | null
          id?: string
          last_active?: string | null
          name?: string | null
          niche?: string | null
          platform?: string | null
        }
        Update: {
          collab_status?: string | null
          contact_number?: string | null
          country?: string | null
          email?: string | null
          engagement_rate?: number | null
          followers?: number | null
          handle?: string | null
          id?: string
          last_active?: string | null
          name?: string | null
          niche?: string | null
          platform?: string | null
        }
        Relationships: []
      }
      creator_embeddings: {
        Row: {
          created_at: string | null
          creator_id: string
          embedding: string
          id: string
          profile_text: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          creator_id: string
          embedding: string
          id?: string
          profile_text: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          creator_id?: string
          embedding?: string
          id?: string
          profile_text?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_embeddings_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator database"
            referencedColumns: ["id"]
          },
        ]
      }
      guest_users: {
        Row: {
          created_at: string
          id: string
          last_active: string
          session_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_active?: string
          session_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_active?: string
          session_id?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          campaign_creator_id: string
          created_at: string
          due_date: string
          id: string
          invoice_number: string
          notes: string | null
          paid_at: string | null
          payment_method: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          campaign_creator_id: string
          created_at?: string
          due_date: string
          id?: string
          invoice_number: string
          notes?: string | null
          paid_at?: string | null
          payment_method?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          campaign_creator_id?: string
          created_at?: string
          due_date?: string
          id?: string
          invoice_number?: string
          notes?: string | null
          paid_at?: string | null
          payment_method?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_campaign_creator_id_fkey"
            columns: ["campaign_creator_id"]
            isOneToOne: false
            referencedRelation: "campaign_creators"
            referencedColumns: ["id"]
          },
        ]
      }
      learned_patterns: {
        Row: {
          confidence_score: number | null
          created_at: string
          id: string
          input_text: string | null
          last_used_at: string | null
          output_structure: Json | null
          pattern_type: string
          usage_count: number | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          id?: string
          input_text?: string | null
          last_used_at?: string | null
          output_structure?: Json | null
          pattern_type: string
          usage_count?: number | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          id?: string
          input_text?: string | null
          last_used_at?: string | null
          output_structure?: Json | null
          pattern_type?: string
          usage_count?: number | null
        }
        Relationships: []
      }
      negotiations: {
        Row: {
          availability_window: string | null
          campaign_creator_id: string
          created_at: string
          deliverables_count: number
          final_rate: number | null
          id: string
          initial_rate: number | null
          negotiation_notes: string | null
          proposed_rate: number | null
          terms_agreed: boolean | null
          updated_at: string
        }
        Insert: {
          availability_window?: string | null
          campaign_creator_id: string
          created_at?: string
          deliverables_count?: number
          final_rate?: number | null
          id?: string
          initial_rate?: number | null
          negotiation_notes?: string | null
          proposed_rate?: number | null
          terms_agreed?: boolean | null
          updated_at?: string
        }
        Update: {
          availability_window?: string | null
          campaign_creator_id?: string
          created_at?: string
          deliverables_count?: number
          final_rate?: number | null
          id?: string
          initial_rate?: number | null
          negotiation_notes?: string | null
          proposed_rate?: number | null
          terms_agreed?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "negotiations_campaign_creator_id_fkey"
            columns: ["campaign_creator_id"]
            isOneToOne: false
            referencedRelation: "campaign_creators"
            referencedColumns: ["id"]
          },
        ]
      }
      outreach_sessions: {
        Row: {
          campaign_creator_id: string
          created_at: string
          follow_up_scheduled: boolean | null
          id: string
          message_content: string | null
          outreach_type: string
          response_content: string | null
          status: string
          updated_at: string
        }
        Insert: {
          campaign_creator_id: string
          created_at?: string
          follow_up_scheduled?: boolean | null
          id?: string
          message_content?: string | null
          outreach_type: string
          response_content?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          campaign_creator_id?: string
          created_at?: string
          follow_up_scheduled?: boolean | null
          id?: string
          message_content?: string | null
          outreach_type?: string
          response_content?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "outreach_sessions_campaign_creator_id_fkey"
            columns: ["campaign_creator_id"]
            isOneToOne: false
            referencedRelation: "campaign_creators"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company: string | null
          created_at: string
          email: string | null
          id: string
          industry: string | null
          name: string
          updated_at: string
          user_type: string
        }
        Insert: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id: string
          industry?: string | null
          name: string
          updated_at?: string
          user_type: string
        }
        Update: {
          avatar_url?: string | null
          company?: string | null
          created_at?: string
          email?: string | null
          id?: string
          industry?: string | null
          name?: string
          updated_at?: string
          user_type?: string
        }
        Relationships: []
      }
      query_embeddings: {
        Row: {
          created_at: string
          embedding: string | null
          id: string
          query_text: string
          search_session_id: string | null
          success_score: number | null
        }
        Insert: {
          created_at?: string
          embedding?: string | null
          id?: string
          query_text: string
          search_session_id?: string | null
          success_score?: number | null
        }
        Update: {
          created_at?: string
          embedding?: string | null
          id?: string
          query_text?: string
          search_session_id?: string | null
          success_score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "query_embeddings_search_session_id_fkey"
            columns: ["search_session_id"]
            isOneToOne: false
            referencedRelation: "search_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      search_interactions: {
        Row: {
          creator_id: string | null
          id: string
          interaction_timestamp: string
          interaction_type: string
          search_session_id: string | null
        }
        Insert: {
          creator_id?: string | null
          id?: string
          interaction_timestamp?: string
          interaction_type: string
          search_session_id?: string | null
        }
        Update: {
          creator_id?: string | null
          id?: string
          interaction_timestamp?: string
          interaction_type?: string
          search_session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "search_interactions_search_session_id_fkey"
            columns: ["search_session_id"]
            isOneToOne: false
            referencedRelation: "search_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      search_sessions: {
        Row: {
          created_at: string
          guest_user_id: string | null
          id: string
          parsed_filters: Json | null
          results_count: number | null
          session_duration_seconds: number | null
          success_score: number | null
          updated_at: string
          user_clicked_results: boolean | null
          user_id: string | null
          user_query: string
          user_refined_search: boolean | null
        }
        Insert: {
          created_at?: string
          guest_user_id?: string | null
          id?: string
          parsed_filters?: Json | null
          results_count?: number | null
          session_duration_seconds?: number | null
          success_score?: number | null
          updated_at?: string
          user_clicked_results?: boolean | null
          user_id?: string | null
          user_query: string
          user_refined_search?: boolean | null
        }
        Update: {
          created_at?: string
          guest_user_id?: string | null
          id?: string
          parsed_filters?: Json | null
          results_count?: number | null
          session_duration_seconds?: number | null
          success_score?: number | null
          updated_at?: string
          user_clicked_results?: boolean | null
          user_id?: string | null
          user_query?: string
          user_refined_search?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "search_sessions_guest_user_id_fkey"
            columns: ["guest_user_id"]
            isOneToOne: false
            referencedRelation: "guest_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "search_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          budget_range_max: number | null
          budget_range_min: number | null
          created_at: string
          id: string
          notification_preferences: Json | null
          preferred_platforms: string[] | null
          target_audience_age_max: number | null
          target_audience_age_min: number | null
          target_audience_interests: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          budget_range_max?: number | null
          budget_range_min?: number | null
          created_at?: string
          id?: string
          notification_preferences?: Json | null
          preferred_platforms?: string[] | null
          target_audience_age_max?: number | null
          target_audience_age_min?: number | null
          target_audience_interests?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          budget_range_max?: number | null
          budget_range_min?: number | null
          created_at?: string
          id?: string
          notification_preferences?: Json | null
          preferred_platforms?: string[] | null
          target_audience_age_max?: number | null
          target_audience_age_min?: number | null
          target_audience_interests?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      cosine_similarity: {
        Args: { vec1: string; vec2: string }
        Returns: number
      }
      find_similar_creators: {
        Args: {
          query_embedding: string
          similarity_threshold?: number
          max_results?: number
        }
        Returns: {
          creator_id: string
          similarity_score: number
          profile_text: string
        }[]
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
