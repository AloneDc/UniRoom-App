"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/shared/validations/authSchemas";
import { z } from "zod";
import { AuthService } from "@/domain/services/AuthService";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Lock, Mail } from "lucide-react";

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true);
      setError("");
      const { role } = await AuthService.login(data.email, data.password);

      if (role === "landlord") router.push("/perfil/arrendador");
      else router.push("/perfil/estudiante");
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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.1),transparent_70%)]" />

      {/* Tarjeta de Login */}
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 bg-white/80 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-xl p-8 md:p-10 w-full max-w-md"
      >
        {/* Título */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A2E] mb-2">
            Bienvenido a <span className="text-[#6C63FF]">UniRoom</span>
          </h2>
          <p className="text-gray-600">Inicia sesión para continuar</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm text-center p-2 rounded-md mb-4 border border-red-100">
            {error}
          </div>
        )}

        {/* Inputs */}
        <div className="space-y-4">
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
        </div>

        {/* Botón */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={loading}
          className={`mt-6 w-full py-3 rounded-lg font-semibold text-white transition-all ${
            loading
              ? "bg-[#7A70FF]/70 cursor-not-allowed"
              : "bg-gradient-to-r from-[#6C63FF] to-[#00E0C6] hover:opacity-90 shadow-md"
          }`}
        >
          {loading ? "Ingresando..." : "Entrar"}
        </motion.button>

        {/* Enlaces */}
        <div className="text-center mt-6 text-sm text-gray-600 space-y-1">
          <p>
            ¿Olvidaste tu contraseña?{" "}
            <Link
              href="/reset-password"
              className="text-[#6C63FF] font-medium hover:underline"
            >
              Recuperar
            </Link>
          </p>
          <p>
            ¿No tienes cuenta?{" "}
            <Link
              href="/register"
              className="text-[#00E0C6] font-medium hover:underline"
            >
              Registrarse
            </Link>
          </p>
        </div>
      </motion.form>
    </section>
  );
}
