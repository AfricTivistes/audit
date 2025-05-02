import { defineMiddleware } from "astro:middleware";
import { createClient } from "../lib/supabase";
import { handleUserProfile } from "./handleUserProfile"
import { handleAudits } from "./handleAudits";

const PATHS_TO_IGNORE: string[] = [];

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
        const user = authData.user;
        await handleUserProfile(context, supabase, user);

		if (pathname === "/dashboard") {

			await handleAudits(context, supabase);

		}
	}

	return next();
});