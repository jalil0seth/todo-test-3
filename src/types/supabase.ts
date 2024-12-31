export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          priority: string
          time_frame: string
          completed: boolean
          created_at: string
          order: number
          rank: number
          status: string
          tags: string[]
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string
          priority: string
          time_frame: string
          completed?: boolean
          created_at?: string
          order?: number
          rank?: number
          status?: string
          tags?: string[]
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          priority?: string
          time_frame?: string
          completed?: boolean
          created_at?: string
          order?: number
          rank?: number
          status?: string
          tags?: string[]
        }
      }
      subtasks: {
        Row: {
          id: string
          task_id: string
          title: string
          completed: boolean
        }
        Insert: {
          id?: string
          task_id: string
          title: string
          completed?: boolean
        }
        Update: {
          id?: string
          task_id?: string
          title?: string
          completed?: boolean
        }
      }
      comments: {
        Row: {
          id: string
          task_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          task_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          task_id?: string
          content?: string
          created_at?: string
        }
      }
    }
  }
}