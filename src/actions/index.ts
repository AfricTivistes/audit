import { defineAction, type ActionAPIContext } from "astro:actions";
import { z } from "astro:schema";
import { createClient } from "../lib/supabase";

const emailSignIn = async (
  { email, password }: { email: string; password: string },
  context: ActionAPIContext
) => {
  console.log("Action de connexion");
  try {
    const supabase = createClient({
      request: context.request,
      cookies: context.cookies,
    });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Erreur de connexion", error);
      return {
        success: false,
        message: error.message,
      };
    } else {
      console.log("Connexion réussie", data);
      return {
        success: true,
        message: "Connexion réussie",
      };
    }
  } catch (err) {
    console.error("Erreur inattendue dans l'action de connexion", err);
    return {
      success: false,
      message: "Erreur inattendue",
    };
  }
};

const emailSignUp = async (
  { email, password, name }: { email: string; password: string; name: string },
  context: ActionAPIContext
) => {
  console.log("Action d'inscription");
  try {
    const supabase = createClient({
      request: context.request,
      cookies: context.cookies,
    });

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      }
    });

    if (error) {
      console.error("Erreur d'inscription", error);
      return {
        success: false,
        message: error.message,
      };
    } else {
      console.log("Inscription réussie", data);
      return {
        success: true,
        message: "Inscription réussie. Veuillez vérifier votre email pour confirmer votre compte.",
      };
    }
  } catch (err) {
    console.error("Erreur inattendue dans l'action d'inscription", err);
    return {
      success: false,
      message: "Erreur inattendue",
    };
  }
};

const updateProfile = async (
  { username, fullName, organization, country }: { 
    username?: string; 
    fullName?: string; 
    organization?: string; 
    country?: string; 
  },
  context: ActionAPIContext
) => {
  try {
    const supabase = createClient({
      request: context.request,
      cookies: context.cookies,
    });

    // Vérifier si l'utilisateur est connecté
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) {
      return {
        success: false,
        message: "Vous devez être connecté pour mettre à jour votre profil",
      };
    }

    // Vérifier si le nom d'utilisateur est déjà pris (uniquement si le nom d'utilisateur est fourni)
    if (username) {
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .neq('id', authData.user.id)
        .maybeSingle();

      if (checkError) {
        console.error("Erreur lors de la vérification du nom d'utilisateur", checkError);
        return {
          success: false,
          message: "Erreur lors de la vérification du nom d'utilisateur",
        };
      }

      if (existingUser) {
        return {
          success: false,
          message: "Ce nom d'utilisateur est déjà pris",
        };
      }
    }

    // Préparer les données à mettre à jour
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (username) updateData.username = username;
    if (fullName) updateData.full_name = fullName;
    if (organization) updateData.organization = organization;
    if (country) updateData.country = country;

    // Mettre à jour le profil
    const { error: updateError } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', authData.user.id);

    if (updateError) {
      console.error("Erreur lors de la mise à jour du profil", updateError);
      return {
        success: false,
        message: updateError.message,
      };
    }

    return {
      success: true,
      message: "Profil mis à jour avec succès",
    };
  } catch (err) {
    console.error("Erreur inattendue lors de la mise à jour du profil", err);
    return {
      success: false,
      message: "Erreur inattendue",
    };
  }
};

export const server = {
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
  updateProfile: defineAction({
    accept: "form",
    input: z.object({
      username: z.string().min(3).optional(),
      fullName: z.string().optional(),
      organization: z.string().optional(),
      country: z.string().optional(),
    }),
    handler: async (input, context) => {
      return updateProfile(input, context);
    },
  }),
};