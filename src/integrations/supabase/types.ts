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
      appointments: {
        Row: {
          client_id: string
          created_at: string | null
          created_by: string
          data: string
          hora: string
          id: string
          observacoes: string | null
          service_id: string
          status: string
          updated_at: string | null
          valor: number
        }
        Insert: {
          client_id: string
          created_at?: string | null
          created_by: string
          data: string
          hora: string
          id?: string
          observacoes?: string | null
          service_id: string
          status?: string
          updated_at?: string | null
          valor: number
        }
        Update: {
          client_id?: string
          created_at?: string | null
          created_by?: string
          data?: string
          hora?: string
          id?: string
          observacoes?: string | null
          service_id?: string
          status?: string
          updated_at?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "appointments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          created_at: string | null
          criado_por: string
          data_nascimento: string | null
          email: string | null
          id: string
          nome: string
          telefone: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          criado_por: string
          data_nascimento?: string | null
          email?: string | null
          id?: string
          nome: string
          telefone: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          criado_por?: string
          data_nascimento?: string | null
          email?: string | null
          id?: string
          nome?: string
          telefone?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          appointment_id: string | null
          client_id: string | null
          enviado_em: string | null
          id: string
          mensagem: string
          status: string | null
          tipo: string
        }
        Insert: {
          appointment_id?: string | null
          client_id?: string | null
          enviado_em?: string | null
          id?: string
          mensagem: string
          status?: string | null
          tipo: string
        }
        Update: {
          appointment_id?: string | null
          client_id?: string | null
          enviado_em?: string | null
          id?: string
          mensagem?: string
          status?: string | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          nome: string
          telefone: string | null
          tipo_usuario: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id: string
          nome: string
          telefone?: string | null
          tipo_usuario: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          nome?: string
          telefone?: string | null
          tipo_usuario?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      public_bookings: {
        Row: {
          created_at: string | null
          data: string
          email: string | null
          hora: string
          id: string
          nome: string
          observacoes: string | null
          service_id: string
          status: string | null
          telefone: string
          valor: number
        }
        Insert: {
          created_at?: string | null
          data: string
          email?: string | null
          hora: string
          id?: string
          nome: string
          observacoes?: string | null
          service_id: string
          status?: string | null
          telefone: string
          valor: number
        }
        Update: {
          created_at?: string | null
          data?: string
          email?: string | null
          hora?: string
          id?: string
          nome?: string
          observacoes?: string | null
          service_id?: string
          status?: string | null
          telefone?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          ativo: boolean | null
          categoria: string | null
          created_at: string | null
          descricao: string | null
          duracao_min: number
          id: string
          nome: string
          preco: number
        }
        Insert: {
          ativo?: boolean | null
          categoria?: string | null
          created_at?: string | null
          descricao?: string | null
          duracao_min: number
          id?: string
          nome: string
          preco: number
        }
        Update: {
          ativo?: boolean | null
          categoria?: string | null
          created_at?: string | null
          descricao?: string | null
          duracao_min?: number
          id?: string
          nome?: string
          preco?: number
        }
        Relationships: []
      }
      studio_settings: {
        Row: {
          cor_primaria: string | null
          created_at: string | null
          endereco: string | null
          facebook: string | null
          horas_funcionamento: Json | null
          id: string
          instagram: string | null
          link_agendamento: string | null
          logo_url: string | null
          nome: string
          telefone: string | null
          updated_at: string | null
          whatsapp: string | null
        }
        Insert: {
          cor_primaria?: string | null
          created_at?: string | null
          endereco?: string | null
          facebook?: string | null
          horas_funcionamento?: Json | null
          id?: string
          instagram?: string | null
          link_agendamento?: string | null
          logo_url?: string | null
          nome: string
          telefone?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Update: {
          cor_primaria?: string | null
          created_at?: string | null
          endereco?: string | null
          facebook?: string | null
          horas_funcionamento?: Json | null
          id?: string
          instagram?: string | null
          link_agendamento?: string | null
          logo_url?: string | null
          nome?: string
          telefone?: string | null
          updated_at?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      transaction_categories: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          descricao: string | null
          id: string
          nome: string
          tipo: string
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
          tipo: string
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          tipo?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          appointment_id: string | null
          categoria: string
          category_id: string | null
          created_at: string | null
          created_by: string
          data: string
          descricao: string
          id: string
          tipo: string
          valor: number
        }
        Insert: {
          appointment_id?: string | null
          categoria: string
          category_id?: string | null
          created_at?: string | null
          created_by: string
          data: string
          descricao: string
          id?: string
          tipo: string
          valor: number
        }
        Update: {
          appointment_id?: string | null
          categoria?: string
          category_id?: string | null
          created_at?: string | null
          created_by?: string
          data?: string
          descricao?: string
          id?: string
          tipo?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "transactions_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "transaction_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          appointments_today: number
          revenue_today: number
          total_clients: number
          services_completed: number
        }[]
      }
      get_next_appointment: {
        Args: Record<PropertyKey, never>
        Returns: {
          appointment_id: string
          client_name: string
          client_phone: string
          appointment_date: string
          appointment_time: string
          service_name: string
        }[]
      }
      get_random_client: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          nome: string
          telefone: string
        }[]
      }
      get_studio_name: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_studio_status: {
        Args: Record<PropertyKey, never>
        Returns: {
          is_open: boolean
          current_day: string
          opening_time: string
          closing_time: string
        }[]
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
