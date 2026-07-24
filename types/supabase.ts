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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      authors: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          id: number
          linkedin: string | null
          name: string
          slug: string
          title: string | null
          twitter: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: number
          linkedin?: string | null
          name: string
          slug: string
          title?: string | null
          twitter?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          id?: number
          linkedin?: string | null
          name?: string
          slug?: string
          title?: string | null
          twitter?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      blogs: {
        Row: {
          author: string | null
          author_id: number | null
          canonical_url: string | null
          category: string
          content: string
          created_at: string
          date: string
          excerpt: string | null
          featured_image: string | null
          featured_image_alt: string | null
          id: number
          last_saved_at: string | null
          meta_description: string | null
          og_image: string | null
          schema_type: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: string
          summary: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          author_id?: number | null
          canonical_url?: string | null
          category: string
          content: string
          created_at?: string
          date: string
          excerpt?: string | null
          featured_image?: string | null
          featured_image_alt?: string | null
          id?: number
          last_saved_at?: string | null
          meta_description?: string | null
          og_image?: string | null
          schema_type?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: string
          summary?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          author_id?: number | null
          canonical_url?: string | null
          category?: string
          content?: string
          created_at?: string
          date?: string
          excerpt?: string | null
          featured_image?: string | null
          featured_image_alt?: string | null
          id?: number
          last_saved_at?: string | null
          meta_description?: string | null
          og_image?: string | null
          schema_type?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: string
          summary?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blogs_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "authors"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          careers_url: string | null
          company_size: string | null
          contact_email: string | null
          created_at: string | null
          description: string | null
          facebook: string | null
          glassdoor_url: string | null
          hq_location: string | null
          id: string
          industry: string | null
          linkedin: string | null
          logo_url: string | null
          name: string
          remote_policy: string | null
          slug: string
          tagline: string | null
          twitter: string | null
          updated_at: string | null
          website: string | null
          year_founded: string | null
        }
        Insert: {
          careers_url?: string | null
          company_size?: string | null
          contact_email?: string | null
          created_at?: string | null
          description?: string | null
          facebook?: string | null
          glassdoor_url?: string | null
          hq_location?: string | null
          id?: string
          industry?: string | null
          linkedin?: string | null
          logo_url?: string | null
          name: string
          remote_policy?: string | null
          slug: string
          tagline?: string | null
          twitter?: string | null
          updated_at?: string | null
          website?: string | null
          year_founded?: string | null
        }
        Update: {
          careers_url?: string | null
          company_size?: string | null
          contact_email?: string | null
          created_at?: string | null
          description?: string | null
          facebook?: string | null
          glassdoor_url?: string | null
          hq_location?: string | null
          id?: string
          industry?: string | null
          linkedin?: string | null
          logo_url?: string | null
          name?: string
          remote_policy?: string | null
          slug?: string
          tagline?: string | null
          twitter?: string | null
          updated_at?: string | null
          website?: string | null
          year_founded?: string | null
        }
        Relationships: []
      }
      comparisons: {
        Row: {
          cost_of_living_note: string | null
          is_published: boolean
          role_slug: string
          updated_at: string
          verdict: string
          visa_note: string | null
        }
        Insert: {
          cost_of_living_note?: string | null
          is_published?: boolean
          role_slug: string
          updated_at?: string
          verdict: string
          visa_note?: string | null
        }
        Update: {
          cost_of_living_note?: string | null
          is_published?: boolean
          role_slug?: string
          updated_at?: string
          verdict?: string
          visa_note?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comparisons_role_slug_fkey"
            columns: ["role_slug"]
            isOneToOne: true
            referencedRelation: "roles"
            referencedColumns: ["slug"]
          },
        ]
      }
      guides: {
        Row: {
          author_id: string | null
          content: string
          country: string | null
          cover_image: string | null
          created_at: string
          excerpt: string | null
          faq: Json
          id: string
          is_published: boolean
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          title: string
          tldr: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          country?: string | null
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          faq?: Json
          id?: string
          is_published?: boolean
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          title: string
          tldr: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          country?: string | null
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          faq?: Json
          id?: string
          is_published?: boolean
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          title?: string
          tldr?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      job_events: {
        Row: {
          created_at: string | null
          event_type: string | null
          id: string
          job_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_type?: string | null
          id?: string
          job_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_type?: string | null
          id?: string
          job_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_events_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_events_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs_with_payment"
            referencedColumns: ["id"]
          },
        ]
      }
      job_payments: {
        Row: {
          amount: number
          country: string | null
          created_at: string
          currency: string
          email: string | null
          id: string
          job_id: string | null
          payment_status: string
          stripe_session_id: string
          updated_at: string
        }
        Insert: {
          amount: number
          country?: string | null
          created_at?: string
          currency: string
          email?: string | null
          id?: string
          job_id?: string | null
          payment_status?: string
          stripe_session_id: string
          updated_at?: string
        }
        Update: {
          amount?: number
          country?: string | null
          created_at?: string
          currency?: string
          email?: string | null
          id?: string
          job_id?: string | null
          payment_status?: string
          stripe_session_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_payments_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_payments_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs_with_payment"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          apply_url: string
          billing_plan: string
          city: string | null
          company_id: string | null
          created_at: string | null
          currency: string
          description: string
          expires_at: string | null
          featured_addon_paid: boolean
          goes_public_at: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          job_category: string[]
          job_location: string[]
          job_type: string[]
          max_salary: number | null
          min_salary: number | null
          paid_amount_total: number | null
          paid_at: string | null
          paid_currency: string | null
          remote_type: string
          search_vector: unknown
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: string | null
          stripe_session_id: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          valid_through: string | null
          visibility_plan: string
        }
        Insert: {
          apply_url: string
          billing_plan?: string
          city?: string | null
          company_id?: string | null
          created_at?: string | null
          currency?: string
          description: string
          expires_at?: string | null
          featured_addon_paid?: boolean
          goes_public_at?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          job_category: string[]
          job_location: string[]
          job_type: string[]
          max_salary?: number | null
          min_salary?: number | null
          paid_amount_total?: number | null
          paid_at?: string | null
          paid_currency?: string | null
          remote_type?: string
          search_vector?: unknown
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: string | null
          stripe_session_id?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          valid_through?: string | null
          visibility_plan?: string
        }
        Update: {
          apply_url?: string
          billing_plan?: string
          city?: string | null
          company_id?: string | null
          created_at?: string | null
          currency?: string
          description?: string
          expires_at?: string | null
          featured_addon_paid?: boolean
          goes_public_at?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          job_category?: string[]
          job_location?: string[]
          job_type?: string[]
          max_salary?: number | null
          min_salary?: number | null
          paid_amount_total?: number | null
          paid_at?: string | null
          paid_currency?: string | null
          remote_type?: string
          search_vector?: unknown
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: string | null
          stripe_session_id?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          valid_through?: string | null
          visibility_plan?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_with_job_count"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "sorted_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          categories: string[]
          country: string | null
          email: string
          id: string
          name: string | null
          source: string | null
          subscribed_at: string | null
        }
        Insert: {
          categories?: string[]
          country?: string | null
          email: string
          id?: string
          name?: string | null
          source?: string | null
          subscribed_at?: string | null
        }
        Update: {
          categories?: string[]
          country?: string | null
          email?: string
          id?: string
          name?: string | null
          source?: string | null
          subscribed_at?: string | null
        }
        Relationships: []
      }
      roles: {
        Row: {
          created_at: string
          name: string
          plural: string
          skills: string[]
          slug: string
          sort_order: number
          summary: string
        }
        Insert: {
          created_at?: string
          name: string
          plural: string
          skills?: string[]
          slug: string
          sort_order?: number
          summary: string
        }
        Update: {
          created_at?: string
          name?: string
          plural?: string
          skills?: string[]
          slug?: string
          sort_order?: number
          summary?: string
        }
        Relationships: []
      }
      salaries: {
        Row: {
          basis: string
          country: string
          currency: string
          methodology: string | null
          p25: number
          p50: number | null
          p75: number
          role_slug: string
          sample_size: number | null
          source_period: string | null
          sources: string[]
          updated_at: string
        }
        Insert: {
          basis?: string
          country: string
          currency: string
          methodology?: string | null
          p25: number
          p50?: number | null
          p75: number
          role_slug: string
          sample_size?: number | null
          source_period?: string | null
          sources: string[]
          updated_at?: string
        }
        Update: {
          basis?: string
          country?: string
          currency?: string
          methodology?: string | null
          p25?: number
          p50?: number | null
          p75?: number
          role_slug?: string
          sample_size?: number | null
          source_period?: string | null
          sources?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "salaries_role_slug_fkey"
            columns: ["role_slug"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["slug"]
          },
        ]
      }
    }
    Views: {
      companies_with_job_count: {
        Row: {
          id: string | null
          job_count: number | null
          logo_url: string | null
          name: string | null
          slug: string | null
        }
        Relationships: []
      }
      jobs_with_payment: {
        Row: {
          apply_url: string | null
          billing_plan: string | null
          company_id: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          expires_at: string | null
          goes_public_at: string | null
          id: string | null
          is_active: boolean | null
          is_featured: boolean | null
          job_category: string[] | null
          job_location: string[] | null
          job_type: string[] | null
          max_salary: number | null
          min_salary: number | null
          paid_amount: number | null
          paid_country: string | null
          paid_created_at: string | null
          paid_currency: string | null
          paid_email: string | null
          paid_payment_status: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string | null
          status: string | null
          stripe_session_id: string | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
          valid_through: string | null
          visibility_plan: string | null
        }
        Relationships: [
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies_with_job_count"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "sorted_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      sorted_companies: {
        Row: {
          created_at: string | null
          id: string | null
          logo_url: string | null
          name: string | null
          name_lower: string | null
          slug: string | null
          tagline: string | null
          website: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          logo_url?: string | null
          name?: string | null
          name_lower?: never
          slug?: string | null
          tagline?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          logo_url?: string | null
          name?: string | null
          name_lower?: never
          slug?: string | null
          tagline?: string | null
          website?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      archive_expired_jobs: { Args: never; Returns: undefined }
      expire_stale_jobs: { Args: never; Returns: number }
      get_job_stats: {
        Args: { p_job_id: string }
        Returns: {
          clicks: number
          views: number
        }[]
      }
      get_jobs_stats: {
        Args: { p_job_ids: string[] }
        Returns: {
          clicks: number
          job_id: string
          views: number
        }[]
      }
      job_events_daily: {
        Args: { p_end: string; p_start: string }
        Returns: {
          clicks: number
          day: string
          views: number
        }[]
      }
      jobs_search_vector: {
        Args: {
          p_category: string[]
          p_city: string
          p_description: string
          p_job_type: string[]
          p_location: string[]
          p_remote_type: string
          p_tags: string[]
          p_title: string
        }
        Returns: unknown
      }
      monthly_blog_posts: {
        Args: never
        Returns: {
          month: number
          total: number
          year: number
        }[]
      }
      monthly_published_jobs: {
        Args: never
        Returns: {
          month: number
          total: number
          year: number
        }[]
      }
      monthly_registered_companies: {
        Args: never
        Returns: {
          month: number
          total: number
          year: number
        }[]
      }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      top_jobs_by_event: {
        Args: { p_event_type: string; p_limit?: number }
        Returns: {
          event_count: number
          job_id: string
        }[]
      }
      top_jobs_by_event_windowed: {
        Args: {
          p_end: string
          p_event_type: string
          p_limit?: number
          p_start: string
        }
        Returns: {
          event_count: number
          job_id: string
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
