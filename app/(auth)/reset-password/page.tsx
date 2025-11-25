"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetSchema } from "@/shared/validations/authSchemas";
import { z } from "zod";
import { AuthService } from "@/domain/services/AuthService";
import { useState } from "react";

type ResetForm = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetForm) => {
    try {
      setLoading(true);
      await AuthService.resetPassword(data.email);
      setMessage("Te hemos enviado un enlace para restablecer tu contraseña.");
      setError("");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md transition-transform hover:scale-[1.01]"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-700 tracking-tight">
          Recuperar Contraseña
        </h2>

        {message && (
          <p className="text-green-600 text-sm mb-4 text-center bg-green-50 p-2 rounded">
            {message}
          </p>
        )}
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center bg-red-50 p-2 rounded">
            {error}
          </p>
        )}

        <input
          {...register("email")}
          type="email"
          placeholder="Correo electrónico"
          className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none p-3 w-full rounded-md transition"
        />

        <button
          disabled={loading}
          className={`mt-6 w-full py-3 rounded-md font-semibold text-white transition ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Enviando..." : "Enviar enlace"}
        </button>
      </form>
    </section>
  );
}
