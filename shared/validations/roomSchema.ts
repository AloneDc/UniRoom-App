import { z } from "zod";

/**
 * ✅ Esquema completo para creación y edición de habitaciones
 */
export const roomSchema = z.object({
  title: z
    .string()
    .min(5, { message: "El título debe tener al menos 5 caracteres." })
    .max(100, { message: "El título no puede superar los 100 caracteres." }),

  description: z
    .string()
    .min(10, { message: "La descripción es obligatoria." })
    .max(800, { message: "La descripción es demasiado larga." }),

  price: z.coerce
    .number()
    .positive({ message: "El precio debe ser mayor que 0." })
    .refine((val) => val >= 100, {
      message: "El precio mínimo sugerido es S/100.",
    }),

  location: z
    .string()
    .min(3, { message: "La ubicación es obligatoria." })
    .max(100, { message: "La ubicación no puede superar los 100 caracteres." }),

  address: z
    .string()
    .max(150, { message: "La dirección no puede superar los 150 caracteres." })
    .optional()
    .or(z.literal("")),

  type: z
    .enum(["individual", "compartida", "departamento"])
    .refine((val) => !!val, {
      message: "Debes seleccionar un tipo de habitación.",
    }),

  services: z.array(z.string()).default([]),

  images: z
    .array(
      z.instanceof(File, {
        message: "Debe ser un archivo de imagen válido.",
      })
    )
    .optional(),
});

/**
 * 📘 Tipado derivado
 */
export type RoomInput = z.infer<typeof roomSchema>;
