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
import Image from "next/image";
import { Lock, Mail, Home, ArrowRight, Eye, EyeOff } from "lucide-react";

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <section className="min-h-screen flex relative overflow-hidden">
      {/* Lado izquierdo - Imagen de fondo */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#6C63FF] to-[#00E0C6]">
        {/* Imagen de fondo */}
        <div className="absolute inset-0">
          <Image
            src="/assets/login-bg.jpg"
            alt="UniRoom Background"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>

        {/* Overlay con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#6C63FF]/90 to-[#00E0C6]/90" />

        {/* Contenido */}
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12 w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 mb-8">
            <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-2xl ring-4 ring-white/30">
              <Image
                src="/assets/Logo.jpg"
                alt="UniRoom Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <span className="text-4xl font-extrabold">UniRoom</span>
          </Link>

          <div className="max-w-md text-center space-y-6">
            <h1 className="text-5xl font-extrabold leading-tight">
              Encuentra tu hogar ideal en Piura
            </h1>

            <p className="text-xl text-white/90">
              Conectamos estudiantes con los mejores alojamientos cerca de sus
              universidades
            </p>

            {/* Features */}
            <div className="space-y-4 pt-8">
              {[
                "✓ Miles de habitaciones verificadas",
                "✓ Reservas seguras y confiables",
                "✓ Atención personalizada 24/7",
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3 text-lg"
                >
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-2xl">✓</span>
                  </div>
                  {feature}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lado derecho - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gradient-to-br from-[#F8FAFF] via-white to-[#E0F7F4]">
        {/* Logo mobile */}
        <Link
          href="/"
          className="lg:hidden absolute top-6 left-6 flex items-center gap-2"
        >
          <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg">
            <Image
              src="/assets/Logo.jpg"
              alt="UniRoom Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <span className="text-2xl font-extrabold text-[#1A1A2E]">
            UniRoom
          </span>
        </Link>

        {/* Formulario */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8 mt-20 lg:mt-0">
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#1A1A2E] mb-2">
              ¡Bienvenido de vuelta! 👋
            </h2>
            <p className="text-gray-600">Inicia sesión para continuar</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 text-red-600 text-sm text-center p-3 rounded-xl border border-red-200 flex items-center justify-center gap-2"
              >
                <span>⚠️</span>
                {error}
              </motion.div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-3.5 text-[#6C63FF]/70"
                />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="tu@email.com"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                    errors.email ? "border-red-400" : "border-gray-300"
                  } focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF] outline-none transition bg-white`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  ⚠️ {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-3.5 text-[#6C63FF]/70"
                />
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`w-full pl-11 pr-12 py-3 rounded-xl border ${
                    errors.password ? "border-red-400" : "border-gray-300"
                  } focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF] outline-none transition bg-white`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  ⚠️ {errors.password.message}
                </p>
              )}
            </div>

            {/* Recordar / Olvidé */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-[#6C63FF] rounded border-gray-300 focus:ring-[#6C63FF]"
                />
                <span className="text-gray-600">Recordarme</span>
              </label>
              <Link
                href="/reset-password"
                className="text-[#6C63FF] font-medium hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Botón */}
            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              disabled={loading}
              className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                loading
                  ? "bg-[#7A70FF]/70 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#6C63FF] to-[#00E0C6] hover:shadow-xl shadow-lg"
              }`}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Ingresando...
                </>
              ) : (
                <>
                  Iniciar sesión
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#F8FAFF] text-gray-500">
                  ¿Nuevo en UniRoom?
                </span>
              </div>
            </div>

            {/* Registro */}
            <Link
              href="/register"
              className="block w-full py-3.5 rounded-xl font-semibold text-[#6C63FF] border-2 border-[#6C63FF] hover:bg-[#6C63FF] hover:text-white transition-all text-center"
            >
              Crear cuenta gratis
            </Link>

            {/* Volver al inicio */}
            <Link
              href="/"
              className="flex items-center justify-center gap-2 text-gray-600 hover:text-[#6C63FF] transition-colors text-sm font-medium mt-4"
            >
              <Home size={16} />
              Volver al inicio
            </Link>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
