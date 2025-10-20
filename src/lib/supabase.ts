import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gdubecmdqwgszloygecj.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkdWJlY21kcXdnc3psb3lnZWNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NDQwNzcsImV4cCI6MjA3NjMyMDA3N30.V3v5NhGhBnzIXi0-ETG7X8yWd60NqBCQrTiX7rvuTr8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export type Database = {
  public: {
    Tables: {
      services: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string
          duration_minutes: number
          price: number
          is_active: boolean | null
          image_url: string | null
          display_order: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category: string
          duration_minutes: number
          price: number
          is_active?: boolean | null
          image_url?: string | null
          display_order?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string
          duration_minutes?: number
          price?: number
          is_active?: boolean | null
          image_url?: string | null
          display_order?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      training_courses: {
        Row: {
          id: string
          title: string
          description: string | null
          category: string
          duration: string | null
          price_display: string | null
          level: string | null
          max_students: number | null
          instructor: string | null
          image_url: string | null
          video_url: string | null
          what_you_learn: string[] | null
          prerequisites: string[] | null
          certification: string | null
          schedule: string | null
          rating: number | null
          reviews_count: number | null
          is_active: boolean | null
          display_order: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          category: string
          duration?: string | null
          price_display?: string | null
          level?: string | null
          max_students?: number | null
          instructor?: string | null
          image_url?: string | null
          video_url?: string | null
          what_you_learn?: string[] | null
          prerequisites?: string[] | null
          certification?: string | null
          schedule?: string | null
          rating?: number | null
          reviews_count?: number | null
          is_active?: boolean | null
          display_order?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          category?: string
          duration?: string | null
          price_display?: string | null
          level?: string | null
          max_students?: number | null
          instructor?: string | null
          image_url?: string | null
          video_url?: string | null
          what_you_learn?: string[] | null
          prerequisites?: string[] | null
          certification?: string | null
          schedule?: string | null
          rating?: number | null
          reviews_count?: number | null
          is_active?: boolean | null
          display_order?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      training_media: {
        Row: {
          id: string
          type: string
          url: string
          title: string
          description: string | null
          category: string
          course_id: string | null
          is_active: boolean | null
          display_order: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          type: string
          url: string
          title: string
          description?: string | null
          category: string
          course_id?: string | null
          is_active?: boolean | null
          display_order?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          type?: string
          url?: string
          title?: string
          description?: string | null
          category?: string
          course_id?: string | null
          is_active?: boolean | null
          display_order?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      gallery: {
        Row: {
          id: string
          title: string
          description: string | null
          image_url: string
          category: string | null
          tags: string[] | null
          is_featured: boolean | null
          display_order: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          image_url: string
          category?: string | null
          tags?: string[] | null
          is_featured?: boolean | null
          display_order?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          image_url?: string
          category?: string | null
          tags?: string[] | null
          is_featured?: boolean | null
          display_order?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          subject: string | null
          message: string
          status: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          subject?: string | null
          message: string
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          subject?: string | null
          message?: string
          status?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      staff: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          phone: string | null
          role: string
          bio: string | null
          specialties: string[] | null
          profile_image_url: string | null
          is_active: boolean | null
          hire_date: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          email: string
          first_name: string
          last_name: string
          phone?: string | null
          role?: string
          bio?: string | null
          specialties?: string[] | null
          profile_image_url?: string | null
          is_active?: boolean | null
          hire_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          phone?: string | null
          role?: string
          bio?: string | null
          specialties?: string[] | null
          profile_image_url?: string | null
          is_active?: boolean | null
          hire_date?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
  }
}
