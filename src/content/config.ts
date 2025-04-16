import { defineCollection, z } from 'astro:content';
import {getAudits} from '../lib/api/supabase.ts';

const audits = defineCollection({
  loader: async () => {
    try {
      const data = await getAudits();
        return data.map((audit) => ({
          id: audit.id,
          type: audit.type,
          description: audit.description,
          icon: audit.icon,
          status: audit.status,
          updated_at: audit.updated_at
      }));
    } catch (error) {
        console.error('Error in loader:', error);
        return [];
    }
  },
  schema: z.object({
    id: z.string(),
    type: z.string(),
    description: z.string(),
    icon: z.string(),
    status: z.string(),
    updated_at: z.coerce.date()
  }),
});

export const collections = {
  audits,
};