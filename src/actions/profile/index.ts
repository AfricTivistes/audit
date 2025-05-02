import { defineAction } from 'astro:actions';
import { z } from "astro:schema";
import { updateProfile } from "./updateProfile";

export const profile = {
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
}