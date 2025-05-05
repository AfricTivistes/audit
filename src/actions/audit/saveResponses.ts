import { defineAction, type ActionAPIContext } from 'astro:actions';
import { z } from 'astro:schema';
import { createClient } from '../../lib/supabase';

export const saveResponses = defineAction({
  accept: 'json',
  input: z.object({
    auditId: z.string().uuid(),
    answers: z.record(z.string(), z.any()),
  }),
  handler: async ({ auditId, answers }, context: ActionAPIContext) => {
    try {
      const supabase = createClient({
        request: context.request,
        cookies: context.cookies,
      });

      // Vérifier si l'utilisateur est connecté
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) {
        return {
          success: false,
          message: 'Vous devez être connecté pour sauvegarder vos réponses',
        };
      }

      // Vérifier si un profile_audit existe pour cet audit et cet utilisateur
      const { data: profileAudit, error: profileAuditError } = await supabase
        .from('profile_audits')
        .select('id')
        .eq('profile_id', authData.user.id)
        .eq('audit_id', auditId)
        .single();

      if (profileAuditError || !profileAudit) {
        return {
          success: false,
          message: 'Audit non trouvé ou non démarré',
        };
      }

      // Récupérer les questions pour valider les IDs
      const { data: questions, error: questionsError } = await supabase
        .from('questions')
        .select('id')
        .eq('audit_id', auditId);

      if (questionsError) {
        console.error('Erreur lors de la récupération des questions:', questionsError);
        return {
          success: false,
          message: 'Erreur lors de la récupération des questions',
        };
      }

      const questionIds = questions.map((q) => q.id);

      // Préparer les réponses à sauvegarder (uniquement pour les questions existantes)
      const responses = Object.entries(answers)
        .filter(([questionId]) => questionIds.includes(questionId))
        .map(([questionId, answer]) => ({
          profile_audit_id: profileAudit.id,
          question_id: questionId,
          answer,
        }));

      // Sauvegarder ou mettre à jour les réponses
      const { error: saveError } = await supabase
        .from('responses')
        .upsert(responses, { onConflict: 'profile_audit_id,question_id' });

      if (saveError) {
        console.error('Erreur lors de la sauvegarde des réponses:', saveError);
        return {
          success: false,
          message: 'Erreur lors de la sauvegarde des réponses',
        };
      }

      return {
        success: true,
        message: 'Réponses sauvegardées avec succès',
      };
    } catch (err) {
      console.error('Erreur inattendue lors de la sauvegarde des réponses:', err);
      return {
        success: false,
        message: 'Erreur inattendue',
      };
    }
  },
});