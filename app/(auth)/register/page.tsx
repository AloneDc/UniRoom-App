"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/shared/validations/authSchemas";
import { z } from "zod";
import { AuthService } from "@/domain/services/AuthService";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { User, Mail, Lock, UserPlus, Phone } from "lucide-react";

type RegisterForm = z.infer<typeof registerSchema> & {
  phone?: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      setLoading(true);
      setError("");

      await AuthService.register(
        data.email,
        data.password,
        data.fullName,
        data.role,
        data.phone || ""
      );

      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex justify-center items-center relative bg-gradient-to-br from-[#6C63FF] via-[#7F78FF] to-[#00E0C6] overflow-hidden px-4">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(255,255,255,0.1),transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_90%,rgba(255,255,255,0.1),transparent_70%)]" />

      {/* Formulario */}
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 bg-white/80 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-xl p-8 md:p-10 w-full max-w-md"
      >
        {/* Encabezado */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A2E] mb-2 flex justify-center items-center gap-2">
            <UserPlus className="text-[#6C63FF]" size={28} />
            Crear cuenta
          </h2>
          <p className="text-gray-600">Únete a la comunidad de UniRoom 🏡</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm text-center p-2 rounded-md mb-4 border border-red-100">
            {error}
          </div>
        )}

        {/* Campos */}
        <div className="space-y-4">
          {/* Nombre completo */}
          <div className="relative">
            <User
              size={18}
              className="absolute left-3 top-3.5 text-[#6C63FF]/70"
            />
            <input
              {...register("fullName")}
              type="text"
              placeholder="Nombre completo"
              className={`w-full pl-10 pr-3 py-3 rounded-lg border ${
                errors.fullName ? "border-red-400" : "border-gray-300"
              } focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF] outline-none transition`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="relative">
            <Mail
              size={18}
              className="absolute left-3 top-3.5 text-[#6C63FF]/70"
            />
            <input
              {...register("email")}
              type="email"
              placeholder="Correo electrónico"
              className={`w-full pl-10 pr-3 py-3 rounded-lg border ${
                errors.email ? "border-red-400" : "border-gray-300"
              } focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF] outline-none transition`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Contraseña */}
          <div className="relative">
            <Lock
              size={18}
              className="absolute left-3 top-3.5 text-[#6C63FF]/70"
            />
            <input
              {...register("password")}
              type="password"
              placeholder="Contraseña"
              className={`w-full pl-10 pr-3 py-3 rounded-lg border ${
                errors.password ? "border-red-400" : "border-gray-300"
              } focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF] outline-none transition`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Teléfono */}
          <div className="relative">
            <Phone
              size={18}
              className="absolute left-3 top-3.5 text-[#6C63FF]/70"
            />
            <input
              {...register("phone")}
              type="tel"
              placeholder="Teléfono"
              className="w-full pl-10 pr-3 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF] outline-none transition"
            />
          </div>

          {/* Rol */}
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Tipo de cuenta
            </label>
            <div className="flex gap-4 justify-center md:justify-start">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register("role")}
                  type="radio"
                  value="student"
                  className="accent-[#6C63FF]"
                />
                Estudiante 🎓
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  {...register("role")}
                  type="radio"
                  value="landlord"
                  className="accent-[#00E0C6]"
                />
                Arrendador 🏠
              </label>
            </div>
          </div>
        </div>

        {/* Botón */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          className={`mt-8 w-full py-3 rounded-lg font-semibold text-white transition-all ${
            loading
              ? "bg-[#7A70FF]/60 cursor-not-allowed"
              : "bg-gradient-to-r from-[#6C63FF] to-[#00E0C6] hover:opacity-90 shadow-md"
          }`}
        >
          {loading ? "Creando cuenta..." : "Registrarse"}
        </motion.button>

        {/* Enlace al login */}
        <p className="text-center mt-6 text-sm text-gray-600">
          ¿Ya tienes una cuenta?{" "}
          <Link
            href="/login"
            className="text-[#6C63FF] font-medium hover:underline"
          >
            Inicia sesión
          </Link>
        </p>
      </motion.form>
    </section>
  );
}
