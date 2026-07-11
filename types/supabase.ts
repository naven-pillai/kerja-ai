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
      affiliate_clicks: {
        Row: {
          clicked_at: string
          country: string | null
          id: string
          ip_address: string | null
          link_id: string
          referrer: string | null
          user_agent: string | null
        }
        Insert: {
          clicked_at?: string
          country?: string | null
          id?: string
          ip_address?: string | null
          link_id: string
          referrer?: string | null
          user_agent?: string | null
        }
        Update: {
          clicked_at?: string
          country?: string | null
          id?: string
          ip_address?: string | null
          link_id?: string
          referrer?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_clicks_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "affiliate_links"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_links: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          destination_url: string
          id: string
          is_active: boolean
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          destination_url: string
          id?: string
          is_active?: boolean
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          destination_url?: string
          id?: string
          is_active?: boolean
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
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
      expense_services: {
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
      expenses: {
        Row: {
          amount_usd: number
          created_at: string | null
          exchange_rate: number
          id: string
          is_edited: boolean | null
          month: string
          service_name: string
        }
        Insert: {
          amount_usd: number
          created_at?: string | null
          exchange_rate: number
          id?: string
          is_edited?: boolean | null
          month: string
          service_name: string
        }
        Update: {
          amount_usd?: number
          created_at?: string | null
          exchange_rate?: number
          id?: string
          is_edited?: boolean | null
          month?: string
          service_name?: string
        }
        Relationships: []
      }
      job_alerts_sent: {
        Row: {
          id: string
          job_id: string
          sent_at: string | null
          telegram_chat_id: number
        }
        Insert: {
          id?: string
          job_id: string
          sent_at?: string | null
          telegram_chat_id: number
        }
        Update: {
          id?: string
          job_id?: string
          sent_at?: string | null
          telegram_chat_id?: number
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
            referencedRelation: "get_matching_chat_ids"
            referencedColumns: ["job_id"]
          },
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
          {
            foreignKeyName: "job_events_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "matching_telegram_early_access"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "job_events_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "matching_telegram_jobs"
            referencedColumns: ["job_id"]
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
            referencedRelation: "get_matching_chat_ids"
            referencedColumns: ["job_id"]
          },
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
          {
            foreignKeyName: "job_payments_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "matching_telegram_early_access"
            referencedColumns: ["job_id"]
          },
          {
            foreignKeyName: "job_payments_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "matching_telegram_jobs"
            referencedColumns: ["job_id"]
          },
        ]
      }
      jobs: {
        Row: {
          apply_url: string
          billing_plan: string
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
          zapier_posted: boolean | null
          remote_type: string
        }
        Insert: {
          apply_url: string
          billing_plan?: string
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
          zapier_posted?: boolean | null
          remote_type?: string
        }
        Update: {
          apply_url?: string
          billing_plan?: string
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
          zapier_posted?: boolean | null
          remote_type?: string
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
          country: string | null
          email: string
          id: string
          name: string | null
          source: string | null
          subscribed_at: string | null
        }
        Insert: {
          country?: string | null
          email: string
          id?: string
          name?: string | null
          source?: string | null
          subscribed_at?: string | null
        }
        Update: {
          country?: string | null
          email?: string
          id?: string
          name?: string | null
          source?: string | null
          subscribed_at?: string | null
        }
        Relationships: []
      }
      price_logs: {
        Row: {
          country: string
          created_at: string | null
          id: string
          plan: string
        }
        Insert: {
          country: string
          created_at?: string | null
          id?: string
          plan: string
        }
        Update: {
          country?: string
          created_at?: string | null
          id?: string
          plan?: string
        }
        Relationships: []
      }
      stripe_customers: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string
          id: string
          interval: string | null
          is_paid: boolean | null
          plan: string
          telegram_chat_id: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          expires_at: string
          id?: string
          interval?: string | null
          is_paid?: boolean | null
          plan: string
          telegram_chat_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          interval?: string | null
          is_paid?: boolean | null
          plan?: string
          telegram_chat_id?: string | null
        }
        Relationships: []
      }
      talent_admin_notes: {
        Row: {
          created_at: string
          created_by: string
          id: string
          note: string
          profile_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          note: string
          profile_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          note?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "talent_admin_notes_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "talent_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      talent_education: {
        Row: {
          created_at: string
          degree: string
          description: string | null
          field_of_study: string | null
          from_year: number
          id: string
          institution: string
          is_current: boolean
          order_index: number
          profile_id: string
          to_year: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          degree: string
          description?: string | null
          field_of_study?: string | null
          from_year: number
          id?: string
          institution: string
          is_current?: boolean
          order_index?: number
          profile_id: string
          to_year?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          degree?: string
          description?: string | null
          field_of_study?: string | null
          from_year?: number
          id?: string
          institution?: string
          is_current?: boolean
          order_index?: number
          profile_id?: string
          to_year?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "talent_education_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "talent_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      talent_inquiries: {
        Row: {
          admin_notes: string | null
          budget: string | null
          company_name: string
          created_at: string
          employer_name: string
          hiring_requirement: string
          id: string
          inquiry_status: string
          job_type: string | null
          message: string | null
          talent_profile_id: string
          updated_at: string
          work_email: string
        }
        Insert: {
          admin_notes?: string | null
          budget?: string | null
          company_name: string
          created_at?: string
          employer_name: string
          hiring_requirement: string
          id?: string
          inquiry_status?: string
          job_type?: string | null
          message?: string | null
          talent_profile_id: string
          updated_at?: string
          work_email: string
        }
        Update: {
          admin_notes?: string | null
          budget?: string | null
          company_name?: string
          created_at?: string
          employer_name?: string
          hiring_requirement?: string
          id?: string
          inquiry_status?: string
          job_type?: string | null
          message?: string | null
          talent_profile_id?: string
          updated_at?: string
          work_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "talent_inquiries_talent_profile_id_fkey"
            columns: ["talent_profile_id"]
            isOneToOne: false
            referencedRelation: "talent_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      talent_profile_views: {
        Row: {
          created_at: string
          id: string
          profile_id: string
          source: string
        }
        Insert: {
          created_at?: string
          id?: string
          profile_id: string
          source?: string
        }
        Update: {
          created_at?: string
          id?: string
          profile_id?: string
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "talent_profile_views_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "talent_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      talent_profiles: {
        Row: {
          admin_notes: string | null
          approval_status: string
          available_for_work: boolean
          available_from: string | null
          avatar_url: string | null
          bio: string
          consent_public_listing: boolean
          created_at: string
          currency: string
          education: string | null
          email: string
          employment_history: string | null
          english_level: string | null
          experience_level: string
          full_name: string
          gender: string | null
          github_url: string | null
          hourly_rate: number | null
          id: string
          instagram_username: string | null
          is_featured: boolean
          is_public: boolean
          job_title: string
          job_types: string[] | null
          language_list: string[] | null
          last_active_at: string | null
          linkedin_url: string | null
          loom_video_url: string | null
          nationality: string | null
          notice_period: string | null
          phone: string | null
          primary_role_category: string | null
          remote_preference: string | null
          residency: string
          resume_url: string | null
          salary_max_annual: number | null
          salary_max_monthly: number | null
          salary_min_annual: number | null
          salary_min_monthly: number | null
          skill_tags: string[] | null
          skills: string
          slug: string | null
          spoken_languages: string | null
          summary: string
          twitter_url: string | null
          updated_at: string
          visa_sponsorship_required: boolean | null
          website_url: string | null
          work_status: string
          years_of_experience: number | null
        }
        Insert: {
          admin_notes?: string | null
          approval_status?: string
          available_for_work?: boolean
          available_from?: string | null
          avatar_url?: string | null
          bio: string
          consent_public_listing?: boolean
          created_at?: string
          currency?: string
          education?: string | null
          email: string
          employment_history?: string | null
          english_level?: string | null
          experience_level: string
          full_name: string
          gender?: string | null
          github_url?: string | null
          hourly_rate?: number | null
          id?: string
          instagram_username?: string | null
          is_featured?: boolean
          is_public?: boolean
          job_title: string
          job_types?: string[] | null
          language_list?: string[] | null
          last_active_at?: string | null
          linkedin_url?: string | null
          loom_video_url?: string | null
          nationality?: string | null
          notice_period?: string | null
          phone?: string | null
          primary_role_category?: string | null
          remote_preference?: string | null
          residency: string
          resume_url?: string | null
          salary_max_annual?: number | null
          salary_max_monthly?: number | null
          salary_min_annual?: number | null
          salary_min_monthly?: number | null
          skill_tags?: string[] | null
          skills: string
          slug?: string | null
          spoken_languages?: string | null
          summary: string
          twitter_url?: string | null
          updated_at?: string
          visa_sponsorship_required?: boolean | null
          website_url?: string | null
          work_status: string
          years_of_experience?: number | null
        }
        Update: {
          admin_notes?: string | null
          approval_status?: string
          available_for_work?: boolean
          available_from?: string | null
          avatar_url?: string | null
          bio?: string
          consent_public_listing?: boolean
          created_at?: string
          currency?: string
          education?: string | null
          email?: string
          employment_history?: string | null
          english_level?: string | null
          experience_level?: string
          full_name?: string
          gender?: string | null
          github_url?: string | null
          hourly_rate?: number | null
          id?: string
          instagram_username?: string | null
          is_featured?: boolean
          is_public?: boolean
          job_title?: string
          job_types?: string[] | null
          language_list?: string[] | null
          last_active_at?: string | null
          linkedin_url?: string | null
          loom_video_url?: string | null
          nationality?: string | null
          notice_period?: string | null
          phone?: string | null
          primary_role_category?: string | null
          remote_preference?: string | null
          residency?: string
          resume_url?: string | null
          salary_max_annual?: number | null
          salary_max_monthly?: number | null
          salary_min_annual?: number | null
          salary_min_monthly?: number | null
          skill_tags?: string[] | null
          skills?: string
          slug?: string | null
          spoken_languages?: string | null
          summary?: string
          twitter_url?: string | null
          updated_at?: string
          visa_sponsorship_required?: boolean | null
          website_url?: string | null
          work_status?: string
          years_of_experience?: number | null
        }
        Relationships: []
      }
      talent_status_history: {
        Row: {
          changed_by: string
          created_at: string
          from_status: string | null
          id: string
          profile_id: string
          reason: string | null
          to_status: string
        }
        Insert: {
          changed_by?: string
          created_at?: string
          from_status?: string | null
          id?: string
          profile_id: string
          reason?: string | null
          to_status: string
        }
        Update: {
          changed_by?: string
          created_at?: string
          from_status?: string | null
          id?: string
          profile_id?: string
          reason?: string | null
          to_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "talent_status_history_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "talent_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      talent_work_experience: {
        Row: {
          created_at: string
          from_year: number
          id: string
          is_current: boolean
          order_index: number
          organization: string
          profile_id: string
          responsibilities: string | null
          role: string
          to_year: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          from_year: number
          id?: string
          is_current?: boolean
          order_index?: number
          organization: string
          profile_id: string
          responsibilities?: string | null
          role: string
          to_year?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          from_year?: number
          id?: string
          is_current?: boolean
          order_index?: number
          organization?: string
          profile_id?: string
          responsibilities?: string | null
          role?: string
          to_year?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "talent_work_experience_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "talent_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      telegram_preferences: {
        Row: {
          email: string
          job_category: string[] | null
          job_location: string[] | null
          job_type: string[] | null
          updated_at: string | null
        }
        Insert: {
          email: string
          job_category?: string[] | null
          job_location?: string[] | null
          job_type?: string[] | null
          updated_at?: string | null
        }
        Update: {
          email?: string
          job_category?: string[] | null
          job_location?: string[] | null
          job_type?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      telegram_subscribers: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          is_paid: boolean
          linked_at: string | null
          plan: string
          price_locked_cents: number | null
          source: string | null
          status: string
          subscription_expires_at: string | null
          telegram_chat_id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_paid?: boolean
          linked_at?: string | null
          plan?: string
          price_locked_cents?: number | null
          source?: string | null
          status?: string
          subscription_expires_at?: string | null
          telegram_chat_id: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          is_paid?: boolean
          linked_at?: string | null
          plan?: string
          price_locked_cents?: number | null
          source?: string | null
          status?: string
          subscription_expires_at?: string | null
          telegram_chat_id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      tools: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          developer_link: string | null
          developer_name: string | null
          facebook_url: string | null
          id: string
          is_featured: boolean | null
          linkedin_url: string | null
          logo_url: string | null
          meta_description: string | null
          name: string | null
          one_liner: string | null
          pricing_tiers: Json | null
          pricing_type: string[] | null
          seo_title: string | null
          slug: string | null
          status: string | null
          tags: string[] | null
          twitter_url: string | null
          visit_url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          developer_link?: string | null
          developer_name?: string | null
          facebook_url?: string | null
          id?: string
          is_featured?: boolean | null
          linkedin_url?: string | null
          logo_url?: string | null
          meta_description?: string | null
          name?: string | null
          one_liner?: string | null
          pricing_tiers?: Json | null
          pricing_type?: string[] | null
          seo_title?: string | null
          slug?: string | null
          status?: string | null
          tags?: string[] | null
          twitter_url?: string | null
          visit_url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          developer_link?: string | null
          developer_name?: string | null
          facebook_url?: string | null
          id?: string
          is_featured?: boolean | null
          linkedin_url?: string | null
          logo_url?: string | null
          meta_description?: string | null
          name?: string | null
          one_liner?: string | null
          pricing_tiers?: Json | null
          pricing_type?: string[] | null
          seo_title?: string | null
          slug?: string | null
          status?: string | null
          tags?: string[] | null
          twitter_url?: string | null
          visit_url?: string | null
        }
        Relationships: []
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
      get_matching_chat_ids: {
        Row: {
          created_at: string | null
          currency: string | null
          email: string | null
          goes_public_at: string | null
          job_category: string[] | null
          job_id: string | null
          job_location: string[] | null
          job_type: string[] | null
          max_salary: number | null
          min_salary: number | null
          slug: string | null
          telegram_chat_id: number | null
          title: string | null
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
          zapier_posted: boolean | null
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
      matching_telegram_chat_ids: {
        Row: {
          chat_id: number | null
          email: string | null
          job_category: string[] | null
          job_location: string[] | null
          job_type: string[] | null
        }
        Relationships: []
      }
      matching_telegram_early_access: {
        Row: {
          chat_id: number | null
          company_name: string | null
          currency: string | null
          email: string | null
          goes_public_at: string | null
          job_category: string[] | null
          job_created_at: string | null
          job_id: string | null
          job_location: string[] | null
          job_title: string | null
          job_type: string[] | null
          max_salary: number | null
          min_salary: number | null
          slug: string | null
          status: string | null
        }
        Relationships: []
      }
      matching_telegram_jobs: {
        Row: {
          chat_id: number | null
          created_at: string | null
          currency: string | null
          email: string | null
          goes_public_at: string | null
          job_category: string[] | null
          job_id: string | null
          job_location: string[] | null
          job_title: string | null
          job_type: string[] | null
          max_salary: number | null
          min_salary: number | null
          slug: string | null
        }
        Relationships: []
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
      calculate_talent_completeness: {
        Args: { p: Database["public"]["Tables"]["talent_profiles"]["Row"] }
        Returns: number
      }
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
      get_pending_talent_count: { Args: never; Returns: number }
      get_talent_approval_breakdown: {
        Args: never
        Returns: {
          status: string
          total: number
        }[]
      }
      get_talent_stats: {
        Args: { p_profile_ids: string[] }
        Returns: {
          completeness_score: number
          inquiry_count: number
          profile_id: string
          view_count: number
        }[]
      }
      monthly_blog_posts: {
        Args: never
        Returns: {
          month: number
          total: number
          year: number
        }[]
      }
      monthly_new_talent: {
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
      monthly_published_tools: {
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
      search_talent_profiles: {
        Args: {
          p_available_only?: boolean
          p_limit?: number
          p_offset?: number
          p_query?: string
          p_status?: string
        }
        Returns: {
          approval_status: string
          available_for_work: boolean
          available_from: string
          created_at: string
          email: string
          experience_level: string
          full_name: string
          id: string
          is_featured: boolean
          is_public: boolean
          job_title: string
          residency: string
          skills: string
          total_count: number
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
  public: {
    Enums: {},
  },
} as const
