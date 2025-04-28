import { defineMiddleware } from "astro:middleware";
import { createClient } from "./lib/supabase";

const PATHS_TO_IGNORE = [];

export const onRequest = defineMiddleware(async (context, next) => {
	const { pathname } = context.url;

	if (PATHS_TO_IGNORE.includes(pathname)) {
		return next();
	}

	console.log("Middleware executing for path:", pathname);

	const supabase = createClient({
		request: context.request,
		cookies: context.cookies,
	});

	const { data: authData } = await supabase.auth.getUser();
	
	if (authData.user) {
		// Récupérer les informations du profil depuis la table profiles
		const { data: profileData, error: profileError } = await supabase
			.from('profiles')
			.select('*')
			.eq('id', authData.user.id)
			.single();
		
		if (profileError) {
			console.error("Erreur lors de la récupération du profil:", profileError);
		}
		
		// Ajouter les données auth et profile à context.locals
		context.locals.user = {
			// Données d'authentification de base
			email: authData.user.email,
			id: authData.user.id,
			// Données du profil
			username: profileData?.username || null,
			fullName: profileData?.full_name || null,
			avatarUrl: profileData?.avatar_url || null,
			organization: profileData?.organization || null,
			country: profileData?.country || null,
			// Métadonnées supplémentaires si nécessaire
			updatedAt: profileData?.updated_at || null,
		};
	}

	return next();
});