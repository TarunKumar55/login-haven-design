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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      pg_images: {
        Row: {
          created_at: string | null
          id: string
          image_order: number
          image_url: string
          pg_listing_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_order?: number
          image_url: string
          pg_listing_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_order?: number
          image_url?: string
          pg_listing_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pg_images_pg_listing_id_fkey"
            columns: ["pg_listing_id"]
            isOneToOne: false
            referencedRelation: "pg_listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pg_images_pg_listing_id_fkey"
            columns: ["pg_listing_id"]
            isOneToOne: false
            referencedRelation: "pg_listings_public"
            referencedColumns: ["id"]
          },
        ]
      }
      pg_listings: {
        Row: {
          address: string
          approved_at: string | null
          approved_by: string | null
          city: string
          created_at: string | null
          description: string | null
          food_type: string | null
          has_ac: boolean
          has_washing_machine: boolean
          has_wifi: boolean
          id: string
          is_active: boolean
          latitude: number | null
          longitude: number | null
          num_beds: number
          owner_address: string | null
          owner_email: string | null
          owner_id: string
          owner_name: string | null
          owner_phone: string | null
          pincode: string
          rent_per_month: number
          security_deposit: number | null
          state: string
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          address: string
          approved_at?: string | null
          approved_by?: string | null
          city: string
          created_at?: string | null
          description?: string | null
          food_type?: string | null
          has_ac?: boolean
          has_washing_machine?: boolean
          has_wifi?: boolean
          id?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          num_beds: number
          owner_address?: string | null
          owner_email?: string | null
          owner_id: string
          owner_name?: string | null
          owner_phone?: string | null
          pincode: string
          rent_per_month: number
          security_deposit?: number | null
          state: string
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          approved_at?: string | null
          approved_by?: string | null
          city?: string
          created_at?: string | null
          description?: string | null
          food_type?: string | null
          has_ac?: boolean
          has_washing_machine?: boolean
          has_wifi?: boolean
          id?: string
          is_active?: boolean
          latitude?: number | null
          longitude?: number | null
          num_beds?: number
          owner_address?: string | null
          owner_email?: string | null
          owner_id?: string
          owner_name?: string | null
          owner_phone?: string | null
          pincode?: string
          rent_per_month?: number
          security_deposit?: number | null
          state?: string
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pg_listings_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pg_listings_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          organization_name: string | null
          phone: string | null
          property_count: number | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          organization_name?: string | null
          phone?: string | null
          property_count?: number | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          organization_name?: string | null
          phone?: string | null
          property_count?: number | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      pg_listings_public: {
        Row: {
          address: string | null
          approved_at: string | null
          city: string | null
          created_at: string | null
          description: string | null
          food_type: string | null
          has_ac: boolean | null
          has_washing_machine: boolean | null
          has_wifi: boolean | null
          id: string | null
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          num_beds: number | null
          pincode: string | null
          rent_per_month: number | null
          security_deposit: number | null
          state: string | null
          status: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          approved_at?: string | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          food_type?: string | null
          has_ac?: boolean | null
          has_washing_machine?: boolean | null
          has_wifi?: boolean | null
          id?: string | null
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          num_beds?: number | null
          pincode?: string | null
          rent_per_month?: number | null
          security_deposit?: number | null
          state?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          approved_at?: string | null
          city?: string | null
          created_at?: string | null
          description?: string | null
          food_type?: string | null
          has_ac?: boolean | null
          has_washing_machine?: boolean | null
          has_wifi?: boolean | null
          id?: string | null
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          num_beds?: number | null
          pincode?: string | null
          rent_per_month?: number | null
          security_deposit?: number | null
          state?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_listing_contact_info: {
        Args: { listing_id: string }
        Returns: {
          id: string
          owner_address: string
          owner_email: string
          owner_name: string
          owner_phone: string
        }[]
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      user_role: "user" | "pg_owner" | "admin"
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
    Enums: {
      user_role: ["user", "pg_owner", "admin"],
    },
  },
} as const
