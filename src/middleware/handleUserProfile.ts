import type { APIContext } from 'astro';
import type { SupabaseClient, User } from '@supabase/supabase-js';

export async function handleUserProfile(context: APIContext, supabase: SupabaseClient, user: User) {
    const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
    
    if (profileError) {
        console.error("Erreur lors de la récupération du profil:", profileError);
    }
    
    // Ajouter les données auth et profile à context.locals
    context.locals.user = {
        // Données d'authentification de base
        email: user.email,
        id: user.id,
        // Données du profil
        ...(profileData || {}),
    };

    // Add role if it exists in user metadata
    if (user.user_metadata?.role) {
        context.locals.user.role = user.user_metadata.role;
    }
}