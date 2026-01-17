// Supabase CDN එක හරහා සම්බන්ධ වීම
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'omflycicfddvrizdjzcf'
const supabaseAnonKey = 'sb_publishable_l-rATJ_SjrkQS-R-BamB1g_cXtPYoCl'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)