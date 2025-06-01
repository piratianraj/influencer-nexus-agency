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
      "creator database": {
        Row: {
          collab_status: string | null
          contact_number: string | null
          country: string | null
          email: string | null
          engagement_rate: number | null
          followers: number | null
          handle: string | null
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
          last_active?: string | null
          name?: string | null
          niche?: string | null
          platform?: string | null
        }
        Relationships: []
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
          id: string
          parsed_filters: Json | null
          results_count: number | null
          session_duration_seconds: number | null
          success_score: number | null
          updated_at: string
          user_clicked_results: boolean | null
          user_query: string
          user_refined_search: boolean | null
        }
        Insert: {
          created_at?: string
          id?: string
          parsed_filters?: Json | null
          results_count?: number | null
          session_duration_seconds?: number | null
          success_score?: number | null
          updated_at?: string
          user_clicked_results?: boolean | null
          user_query: string
          user_refined_search?: boolean | null
        }
        Update: {
          created_at?: string
          id?: string
          parsed_filters?: Json | null
          results_count?: number | null
          session_duration_seconds?: number | null
          success_score?: number | null
          updated_at?: string
          user_clicked_results?: boolean | null
          user_query?: string
          user_refined_search?: boolean | null
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
