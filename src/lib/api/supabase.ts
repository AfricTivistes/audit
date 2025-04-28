import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.SUPABASE_URL
const supabaseAnonKey = import.meta.env.SUPABASE_KEY

export const supabase = createClient< Database >(supabaseUrl, supabaseAnonKey)

export async function getAudits() {
    const { data, error } = await supabase.from('audits').select();

    if (error) {
      console.error('Error fetching audits:', error);
      return [];
    }
    return data;
}