import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(3, "Nombre demasiado corto"),
  role: z
    .enum(["student", "landlord"], { message: "Rol inválido" })
    .refine((val) => val === "student" || val === "landlord", {
      message: "Debes seleccionar un rol",
    }),
});

export const resetSchema = z.object({
  email: z.string().email(),
});
