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
      chats: {
        Row: {
          archived: boolean | null
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          archived?: boolean | null
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          archived?: boolean | null
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      crawled_pages: {
        Row: {
          content: string | null
          created_at: string
          id: string
          metadata: Json | null
          title: string | null
          updated_at: string
          url: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          title?: string | null
          updated_at?: string
          url: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          title?: string | null
          updated_at?: string
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      creator_profiles: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          id_card_number: string | null
          last_name: string | null
          paypal_address: string | null
          snapchat: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          id_card_number?: string | null
          last_name?: string | null
          paypal_address?: string | null
          snapchat?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          id_card_number?: string | null
          last_name?: string | null
          paypal_address?: string | null
          snapchat?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      creator_rewards: {
        Row: {
          amount_earned: number
          created_at: string
          creator_id: string
          diamonds_count: number
          id: string
          payment_status: string
          updated_at: string
        }
        Insert: {
          amount_earned?: number
          created_at?: string
          creator_id: string
          diamonds_count?: number
          id?: string
          payment_status?: string
          updated_at?: string
        }
        Update: {
          amount_earned?: number
          created_at?: string
          creator_id?: string
          diamonds_count?: number
          id?: string
          payment_status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_creator_rewards_profiles"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["username"]
          },
        ]
      }
      creator_rules: {
        Row: {
          created_at: string | null
          description: string
          id: string
          rule_type: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          rule_type: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          rule_type?: string
          title?: string
        }
        Relationships: []
      }
      identity_documents: {
        Row: {
          document_back: string | null
          document_front: string | null
          id: string
          uploaded_at: string | null
          user_id: string
          verified: boolean | null
        }
        Insert: {
          document_back?: string | null
          document_front?: string | null
          id?: string
          uploaded_at?: string | null
          user_id: string
          verified?: boolean | null
        }
        Update: {
          document_back?: string | null
          document_front?: string | null
          id?: string
          uploaded_at?: string | null
          user_id?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      live_schedules: {
        Row: {
          created_at: string
          creator_id: string
          days: number | null
          hours: number | null
          id: string
          is_active: boolean | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          creator_id: string
          days?: number | null
          hours?: number | null
          id?: string
          is_active?: boolean | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          creator_id?: string
          days?: number | null
          hours?: number | null
          id?: string
          is_active?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "live_schedules_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          sent_at: string
          target: string
          title: string
          user_group: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          sent_at?: string
          target: string
          title: string
          user_group: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          sent_at?: string
          target?: string
          title?: string
          user_group?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      penalties: {
        Row: {
          active: boolean | null
          created_at: string | null
          created_by: string
          duration_days: number | null
          id: string
          reason: string
          user_id: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          created_by: string
          duration_days?: number | null
          id?: string
          reason: string
          user_id: string
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          created_by?: string
          duration_days?: number | null
          id?: string
          reason?: string
          user_id?: string
        }
        Relationships: []
      }
      platform_settings: {
        Row: {
          created_at: string
          diamond_value: number
          id: string
          minimum_payout: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          diamond_value?: number
          id?: string
          minimum_payout?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          diamond_value?: number
          id?: string
          minimum_payout?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          days_streamed: number | null
          id: string
          manager_id: string | null
          role: Database["public"]["Enums"]["user_role"]
          total_diamonds: number | null
          total_live_hours: number | null
          total_viewing_time: number | null
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          days_streamed?: number | null
          id: string
          manager_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          total_diamonds?: number | null
          total_live_hours?: number | null
          total_viewing_time?: number | null
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          days_streamed?: number | null
          id?: string
          manager_id?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          total_diamonds?: number | null
          total_live_hours?: number | null
          total_viewing_time?: number | null
          updated_at?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_user_account_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "user_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      sponsorships: {
        Row: {
          agent_name: string
          created_at: string
          creator_id: string
          creator_tiktok: string
          id: string
          invitation_code: string
          sponsor_tiktok: string
          status: string | null
          updated_at: string
        }
        Insert: {
          agent_name: string
          created_at?: string
          creator_id: string
          creator_tiktok: string
          id?: string
          invitation_code: string
          sponsor_tiktok: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          agent_name?: string
          created_at?: string
          creator_id?: string
          creator_tiktok?: string
          id?: string
          invitation_code?: string
          sponsor_tiktok?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      trainings: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          order_index: number | null
          title: string
          type: string
          updated_at: string | null
          video_url: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          order_index?: number | null
          title: string
          type: string
          updated_at?: string | null
          video_url: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          order_index?: number | null
          title?: string
          type?: string
          updated_at?: string | null
          video_url?: string
        }
        Relationships: []
      }
      transfer_requests: {
        Row: {
          created_at: string | null
          creator_id: string
          current_agent_id: string
          id: string
          reason: string | null
          rejection_reason: string | null
          requested_agent_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          creator_id: string
          current_agent_id: string
          id?: string
          reason?: string | null
          rejection_reason?: string | null
          requested_agent_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          creator_id?: string
          current_agent_id?: string
          id?: string
          reason?: string | null
          rejection_reason?: string | null
          requested_agent_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      upcoming_matches: {
        Row: {
          created_at: string
          creator_id: string
          id: string
          match_date: string
          match_image: string | null
          opponent_id: string
          platform: string
          points: number | null
          source: string | null
          status: string
          updated_at: string
          winner_id: string | null
        }
        Insert: {
          created_at?: string
          creator_id: string
          id?: string
          match_date: string
          match_image?: string | null
          opponent_id: string
          platform?: string
          points?: number | null
          source?: string | null
          status?: string
          updated_at?: string
          winner_id?: string | null
        }
        Update: {
          created_at?: string
          creator_id?: string
          id?: string
          match_date?: string
          match_image?: string | null
          opponent_id?: string
          platform?: string
          points?: number | null
          source?: string | null
          status?: string
          updated_at?: string
          winner_id?: string | null
        }
        Relationships: []
      }
      user_accounts: {
        Row: {
          agent_id: string | null
          created_at: string
          email: string | null
          id: string
          last_active: string | null
          password: string
          role: string
          status_color: string | null
          username: string
          warnings: number | null
        }
        Insert: {
          agent_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          last_active?: string | null
          password: string
          role: string
          status_color?: string | null
          username: string
          warnings?: number | null
        }
        Update: {
          agent_id?: string | null
          created_at?: string
          email?: string | null
          id?: string
          last_active?: string | null
          password?: string
          role?: string
          status_color?: string | null
          username?: string
          warnings?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_or_update_profile: {
        Args: {
          user_id: string
          user_username: string
          diamonds_value: number
        }
        Returns: boolean
      }
      create_transfer_request: {
        Args: {
          creator_id_param: string
          requested_agent_id_param: string
          current_agent_id_param: string
          reason_param: string
        }
        Returns: string
      }
    }
    Enums: {
      user_role: "creator" | "manager" | "founder"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
