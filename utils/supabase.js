/*
SUPABASE DATABASE CONNECTION:
This file sets up the connection to our Supabase database
Will be used in Step 2 for authentication and CRUD operations
Environment variables keep database credentials secure
*/

import { createClient } from '@supabase/supabase-js'

// Get database credentials from environment variables (secure approach)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create and export Supabase client for use throughout the application
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
