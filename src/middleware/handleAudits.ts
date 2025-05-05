import type { APIContext } from 'astro';
import type { SupabaseClient } from '@supabase/supabase-js';

export async function handleAudits(context: APIContext, supabase: SupabaseClient) {
    const userId = context.locals.user?.id;
    if (!userId) {
        context.locals.audits = [];
        return;
    }

    // Récupérer les audits de l'utilisateur avec leur statut
    const { data: userAudits, error: userError } = await supabase
        .from('profile_audits')
        .select(`
            id,
            status,
            completion_date,
            score,
            audit:audit_id (
                id,
                type,
                description,
                icon
            )
        `)
        .eq('profile_id', userId);

    if (userError) {
        console.error("Erreur lors de la récupération des audits utilisateur:", userError);
        context.locals.audits = [];
        return;
    }

    // Récupérer tous les audits disponibles
    const { data: allAudits, error: allError } = await supabase
        .from('audits')
        .select('id, type, description, icon');

    if (allError) {
        console.error("Erreur lors de la récupération des audits:", allError);
        context.locals.audits = userAudits;
        return;
    }

    // Identifier les audits non commencés
    const userAuditIds = userAudits.map((ua: any) => ua.audit.id);
    const availableAudits = allAudits
        .filter((audit: any) => !userAuditIds.includes(audit.id))
        .map((audit: any) => ({
            id: null,
            status: 'available',
            completion_date: null,
            score: null,
            audit,
        }));

    context.locals.audits = [...userAudits, ...availableAudits];
}