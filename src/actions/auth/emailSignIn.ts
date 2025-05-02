import { type ActionAPIContext } from "astro:actions";
import { createClient } from "../../lib/supabase";

export const emailSignIn = async (
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