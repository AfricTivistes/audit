import type { APIContext } from 'astro';
import type { SupabaseClient, User } from '@supabase/supabase-js';

export async function handleAudits(context: APIContext, supabase: SupabaseClient) {
    const { data, error } = await supabase
    .from('audits')
    .select('*');

    if (error) {
        console.error("Erreur lors de la récupération des données d'audit:", error);
    }	

    context.locals.audits = data;
}
