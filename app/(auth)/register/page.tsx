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
import Image from "next/image";
import {
  User,
  Mail,
  Lock,
  Phone,
  Home,
  GraduationCap,
  Building2,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";

type RegisterForm = z.infer<typeof registerSchema> & {
  phone?: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<
    "student" | "landlord" | null
  >(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const watchedRole = watch("role");

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

  const handleRoleSelect = (role: "student" | "landlord") => {
    setSelectedRole(role);
    setValue("role", role);
  };

  return (
    <section className="min-h-screen flex relative overflow-hidden">
      {/* Lado izquierdo - Imagen de fondo */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#00E0C6] to-[#6C63FF]">
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
        <div className="absolute inset-0 bg-gradient-to-br from-[#00E0C6]/90 to-[#6C63FF]/90" />

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
              Únete a la comunidad
            </h1>

            <p className="text-xl text-white/90">
              Miles de estudiantes y arrendadores ya confían en nosotros
            </p>

            {/* Benefits */}
            <div className="space-y-4 pt-8">
              {[
                {
                  icon: "🏠",
                  text: "Publica o encuentra habitaciones fácilmente",
                },
                { icon: "🔒", text: "Proceso seguro y verificado" },
                { icon: "⚡", text: "Respuesta rápida en menos de 24h" },
              ].map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3 text-lg"
                >
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                    {benefit.icon}
                  </div>
                  {benefit.text}
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
              Crea tu cuenta 🚀
            </h2>
            <p className="text-gray-600">Comienza tu búsqueda hoy mismo</p>
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

            {/* Tipo de cuenta - PRIMERO */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                ¿Qué tipo de cuenta necesitas?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoleSelect("student")}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    watchedRole === "student"
                      ? "border-[#6C63FF] bg-[#6C63FF]/5"
                      : "border-gray-300 hover:border-[#6C63FF]/50"
                  }`}
                >
                  <input
                    {...register("role")}
                    type="radio"
                    value="student"
                    className="hidden"
                  />
                  <GraduationCap
                    className={`w-8 h-8 mx-auto mb-2 ${
                      watchedRole === "student"
                        ? "text-[#6C63FF]"
                        : "text-gray-400"
                    }`}
                  />
                  <p
                    className={`font-semibold text-sm ${
                      watchedRole === "student"
                        ? "text-[#6C63FF]"
                        : "text-gray-700"
                    }`}
                  >
                    Estudiante
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Busco habitación</p>
                  {watchedRole === "student" && (
                    <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-[#6C63FF]" />
                  )}
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleRoleSelect("landlord")}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    watchedRole === "landlord"
                      ? "border-[#00E0C6] bg-[#00E0C6]/5"
                      : "border-gray-300 hover:border-[#00E0C6]/50"
                  }`}
                >
                  <input
                    {...register("role")}
                    type="radio"
                    value="landlord"
                    className="hidden"
                  />
                  <Building2
                    className={`w-8 h-8 mx-auto mb-2 ${
                      watchedRole === "landlord"
                        ? "text-[#00E0C6]"
                        : "text-gray-400"
                    }`}
                  />
                  <p
                    className={`font-semibold text-sm ${
                      watchedRole === "landlord"
                        ? "text-[#00E0C6]"
                        : "text-gray-700"
                    }`}
                  >
                    Arrendador
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Ofrezco habitación
                  </p>
                  {watchedRole === "landlord" && (
                    <CheckCircle2 className="absolute top-2 right-2 w-5 h-5 text-[#00E0C6]" />
                  )}
                </motion.button>
              </div>
              {errors.role && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  ⚠️ {errors.role.message}
                </p>
              )}
            </div>

            {/* Nombre completo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre completo
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-3.5 text-[#6C63FF]/70"
                />
                <input
                  {...register("fullName")}
                  type="text"
                  placeholder="Juan Pérez García"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border ${
                    errors.fullName ? "border-red-400" : "border-gray-300"
                  } focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF] outline-none transition bg-white`}
                />
              </div>
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  ⚠️ {errors.fullName.message}
                </p>
              )}
            </div>

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

            {/* Contraseña */}
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

            {/* Teléfono */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Teléfono (opcional)
              </label>
              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-4 top-3.5 text-[#6C63FF]/70"
                />
                <input
                  {...register("phone")}
                  type="tel"
                  placeholder="+51 987 654 321"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF] outline-none transition bg-white"
                />
              </div>
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
                  Creando cuenta...
                </>
              ) : (
                <>
                  Crear cuenta
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>

            {/* Términos */}
            <p className="text-xs text-gray-500 text-center">
              Al registrarte, aceptas nuestros{" "}
              <Link href="/terminos" className="text-[#6C63FF] hover:underline">
                Términos y Condiciones
              </Link>{" "}
              y{" "}
              <Link
                href="/privacidad"
                className="text-[#6C63FF] hover:underline"
              >
                Política de Privacidad
              </Link>
            </p>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[#F8FAFF] text-gray-500">
                  ¿Ya tienes cuenta?
                </span>
              </div>
            </div>

            {/* Login */}
            <Link
              href="/login"
              className="block w-full py-3.5 rounded-xl font-semibold text-[#6C63FF] border-2 border-[#6C63FF] hover:bg-[#6C63FF] hover:text-white transition-all text-center"
            >
              Iniciar sesión
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
