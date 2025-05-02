import { type ActionAPIContext } from "astro:actions";
import { createClient } from "../../lib/supabase";

export const emailSignUp = async (
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