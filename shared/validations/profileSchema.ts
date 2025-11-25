import { z } from "zod";

export const profileSchema = z.object({
  full_name: z.string().min(2, "El nombre es obligatorio"),
  phone: z.string().min(8, "El teléfono debe tener al menos 8 dígitos"),
  photo_url: z.string().optional(),
});

export type ProfileInput = z.infer<typeof profileSchema>;
