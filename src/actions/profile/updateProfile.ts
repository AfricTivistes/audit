import { type ActionAPIContext } from "astro:actions";
import { createClient } from "../../lib/supabase";

export const updateProfile = async (
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