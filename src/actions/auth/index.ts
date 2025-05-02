import { defineAction } from 'astro:actions';
import { z } from "astro:schema";
import { emailSignIn } from "./emailSignIn";
import { emailSignUp } from "./emailSignUp";
import { createClient } from "../../lib/supabase";

export const auth = {
    signIn: defineAction({
        accept: "form",
        input: z.object({
          email: z.string().email(),
          password: z.string().min(6),
        }),
        handler: async (input, context) => {
          return emailSignIn(input, context);
        },
      }),
    signUp: defineAction({
        accept: "form",
        input: z.object({
            email: z.string().email(),
            password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
            name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
        }),
        handler: async (input, context) => {
            return emailSignUp(input, context);
        },
    }),
    signOut: defineAction({
        handler: async (_, context) => {
            const supabase = createClient({
            request: context.request,
            cookies: context.cookies,
            });
            const { error } = await supabase.auth.signOut();
            if (error) {
            console.error("Erreur de déconnexion", error);
            return {
                success: false,
                message: error.message,
            };
            }
            return {
            success: true,
            message: "Déconnexion réussie",
            };
        },
    }),
  }