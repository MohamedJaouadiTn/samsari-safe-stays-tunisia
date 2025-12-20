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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          updated_at: string
          user_email: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          role?: string
          updated_at?: string
          user_email: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          updated_at?: string
          user_email?: string
          user_id?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          actual_check_in: string | null
          actual_check_out: string | null
          check_in_date: string
          check_in_time: string | null
          check_out_date: string
          check_out_time: string | null
          created_at: string
          deposit_amount: number | null
          guest_id: string
          guest_service_fee: number | null
          host_id: string
          host_response: string | null
          id: string
          payment_method: string | null
          payment_status: string | null
          platform_commission: number | null
          property_id: string
          request_message: string | null
          responded_at: string | null
          status: string | null
          stripe_payment_intent_id: string | null
          total_price: number
          updated_at: string
        }
        Insert: {
          actual_check_in?: string | null
          actual_check_out?: string | null
          check_in_date: string
          check_in_time?: string | null
          check_out_date: string
          check_out_time?: string | null
          created_at?: string
          deposit_amount?: number | null
          guest_id: string
          guest_service_fee?: number | null
          host_id: string
          host_response?: string | null
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          platform_commission?: number | null
          property_id: string
          request_message?: string | null
          responded_at?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          total_price: number
          updated_at?: string
        }
        Update: {
          actual_check_in?: string | null
          actual_check_out?: string | null
          check_in_date?: string
          check_in_time?: string | null
          check_out_date?: string
          check_out_time?: string | null
          created_at?: string
          deposit_amount?: number | null
          guest_id?: string
          guest_service_fee?: number | null
          host_id?: string
          host_response?: string | null
          id?: string
          payment_method?: string | null
          payment_status?: string | null
          platform_commission?: number | null
          property_id?: string
          request_message?: string | null
          responded_at?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          total_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          booking_id: string | null
          created_at: string
          deleted_by_guest: boolean | null
          deleted_by_host: boolean | null
          guest_id: string
          host_id: string
          id: string
          property_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          deleted_by_guest?: boolean | null
          deleted_by_host?: boolean | null
          guest_id: string
          host_id: string
          id?: string
          property_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          deleted_by_guest?: boolean | null
          deleted_by_host?: boolean | null
          guest_id?: string
          host_id?: string
          id?: string
          property_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "host_bookings_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      id_verifications: {
        Row: {
          cin_back_url: string
          cin_front_url: string
          created_at: string
          id: string
          reviewed_at: string | null
          reviewer_notes: string | null
          selfie_url: string
          status: string | null
          submitted_at: string
          user_id: string
        }
        Insert: {
          cin_back_url: string
          cin_front_url: string
          created_at?: string
          id?: string
          reviewed_at?: string | null
          reviewer_notes?: string | null
          selfie_url: string
          status?: string | null
          submitted_at?: string
          user_id: string
        }
        Update: {
          cin_back_url?: string
          cin_front_url?: string
          created_at?: string
          id?: string
          reviewed_at?: string | null
          reviewer_notes?: string | null
          selfie_url?: string
          status?: string | null
          submitted_at?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          message_type: string | null
          read: boolean | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          message_type?: string | null
          read?: boolean | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          message_type?: string | null
          read?: boolean | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string | null
          id: string
          is_host: boolean | null
          phone: string | null
          updated_at: string
          username: string | null
          verification_status: string | null
          verification_submitted_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          is_host?: boolean | null
          phone?: string | null
          updated_at?: string
          username?: string | null
          verification_status?: string | null
          verification_submitted_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_host?: boolean | null
          phone?: string | null
          updated_at?: string
          username?: string | null
          verification_status?: string | null
          verification_submitted_at?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string | null
          amenities: Json | null
          bathrooms: number
          bed_types: Json | null
          bedrooms: number
          booking_enabled: boolean | null
          cancellation_policy: string | null
          check_in_time: string | null
          check_out_time: string | null
          city: string
          coordinates: Json | null
          created_at: string
          currency: string | null
          description: string | null
          extra_beds: number | null
          google_maps_url: string | null
          governorate: string
          host_id: string
          house_rules: string | null
          id: string
          is_public: boolean | null
          max_guests: number
          minimum_stay: number | null
          photos: Json | null
          price_per_night: number
          property_type: string
          safety_features: Json | null
          short_code: string | null
          sleeping_arrangements: Json | null
          status: string | null
          title: string
          updated_at: string
          visitor_policy: string | null
          welcome_message: string | null
        }
        Insert: {
          address?: string | null
          amenities?: Json | null
          bathrooms?: number
          bed_types?: Json | null
          bedrooms?: number
          booking_enabled?: boolean | null
          cancellation_policy?: string | null
          check_in_time?: string | null
          check_out_time?: string | null
          city: string
          coordinates?: Json | null
          created_at?: string
          currency?: string | null
          description?: string | null
          extra_beds?: number | null
          google_maps_url?: string | null
          governorate: string
          host_id: string
          house_rules?: string | null
          id?: string
          is_public?: boolean | null
          max_guests?: number
          minimum_stay?: number | null
          photos?: Json | null
          price_per_night: number
          property_type: string
          safety_features?: Json | null
          short_code?: string | null
          sleeping_arrangements?: Json | null
          status?: string | null
          title: string
          updated_at?: string
          visitor_policy?: string | null
          welcome_message?: string | null
        }
        Update: {
          address?: string | null
          amenities?: Json | null
          bathrooms?: number
          bed_types?: Json | null
          bedrooms?: number
          booking_enabled?: boolean | null
          cancellation_policy?: string | null
          check_in_time?: string | null
          check_out_time?: string | null
          city?: string
          coordinates?: Json | null
          created_at?: string
          currency?: string | null
          description?: string | null
          extra_beds?: number | null
          google_maps_url?: string | null
          governorate?: string
          host_id?: string
          house_rules?: string | null
          id?: string
          is_public?: boolean | null
          max_guests?: number
          minimum_stay?: number | null
          photos?: Json | null
          price_per_night?: number
          property_type?: string
          safety_features?: Json | null
          short_code?: string | null
          sleeping_arrangements?: Json | null
          status?: string | null
          title?: string
          updated_at?: string
          visitor_policy?: string | null
          welcome_message?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          booking_id: string
          comment: string | null
          created_at: string
          id: string
          property_id: string
          rating: number
          updated_at: string
          user_id: string
        }
        Insert: {
          booking_id: string
          comment?: string | null
          created_at?: string
          id?: string
          property_id: string
          rating: number
          updated_at?: string
          user_id: string
        }
        Update: {
          booking_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          property_id?: string
          rating?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "host_bookings_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_properties: {
        Row: {
          created_at: string
          id: string
          property_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          property_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          property_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_properties_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      host_bookings_view: {
        Row: {
          actual_check_in: string | null
          actual_check_out: string | null
          check_in_date: string | null
          check_in_time: string | null
          check_out_date: string | null
          check_out_time: string | null
          created_at: string | null
          deposit_amount: number | null
          guest_id: string | null
          host_id: string | null
          host_response: string | null
          id: string | null
          payment_method: string | null
          payment_status: string | null
          property_id: string | null
          request_message: string | null
          responded_at: string | null
          status: string | null
          stripe_payment_intent_id: string | null
          total_price: number | null
          updated_at: string | null
        }
        Insert: {
          actual_check_in?: string | null
          actual_check_out?: string | null
          check_in_date?: string | null
          check_in_time?: string | null
          check_out_date?: string | null
          check_out_time?: string | null
          created_at?: string | null
          deposit_amount?: number | null
          guest_id?: string | null
          host_id?: string | null
          host_response?: string | null
          id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          property_id?: string | null
          request_message?: string | null
          responded_at?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          total_price?: number | null
          updated_at?: string | null
        }
        Update: {
          actual_check_in?: string | null
          actual_check_out?: string | null
          check_in_date?: string | null
          check_in_time?: string | null
          check_out_date?: string | null
          check_out_time?: string | null
          created_at?: string | null
          deposit_amount?: number | null
          guest_id?: string | null
          host_id?: string | null
          host_response?: string | null
          id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          property_id?: string | null
          request_message?: string | null
          responded_at?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          total_price?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      public_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string | null
          is_host: boolean | null
          username: string | null
          verification_status: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string | null
          is_host?: boolean | null
          username?: string | null
          verification_status?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string | null
          is_host?: boolean | null
          username?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_property_type_digit: { Args: { p_type: string }; Returns: number }
      is_admin:
        | { Args: never; Returns: boolean }
        | { Args: { user_email: string }; Returns: boolean }
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
