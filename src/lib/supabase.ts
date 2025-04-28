import { createServerClient, parseCookieHeader } from "@supabase/ssr";
import type { AstroCookies } from "astro";

export const cookieOptions: CookieOptionsWithName = {
    path: '/',
    secure: true,
    httpOnly: true,
    sameSite: 'lax',
};

export function createClient({
	request,
	cookies,
}: {
	request: Request;
	cookies: AstroCookies;
}) {
	return createServerClient(
		import.meta.env.SUPABASE_URL,
		import.meta.env.SUPABASE_KEY,
		{
			cookieOptions,
			cookies: {
				getAll() {
					return parseCookieHeader(request.headers.get("Cookie") ?? "");
				},
				setAll(cookiesToSet) {
					cookiesToSet.forEach(({ name, value, options }) =>
						cookies.set(name, value, options)
					);
				},
			},
		}
	);
}