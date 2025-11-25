"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supportSchema } from "@/shared/validations/supportSchema";
import { z } from "zod";

type SupportForm = z.infer<typeof supportSchema>;

export default function ContactForm() {
  const { register, handleSubmit, reset } = useForm<SupportForm>({
    resolver: zodResolver(supportSchema),
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  const onSubmit = async (data: SupportForm) => {
    setStatus("sending");
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!result.success) throw new Error(result.error);

      setStatus("sent");
      reset();
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white shadow-md rounded-xl p-8 w-full max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-semibold mb-6 text-center text-blue-700">
        Contáctanos
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input
          {...register("name")}
          placeholder="Tu nombre"
          className="border p-3 rounded"
        />
        <input
          {...register("email")}
          placeholder="Tu correo"
          className="border p-3 rounded"
        />
      </div>

      <input
        {...register("subject")}
        placeholder="Asunto"
        className="border p-3 rounded w-full mb-4"
      />
      <textarea
        {...register("message")}
        placeholder="Tu mensaje..."
        rows={5}
        className="border p-3 rounded w-full mb-4"
      />

      <button
        disabled={status === "sending"}
        className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition w-full"
      >
        {status === "sending" ? "Enviando..." : "Enviar mensaje"}
      </button>

      {status === "sent" && (
        <p className="text-green-600 text-center mt-3">
          ✅ Mensaje enviado correctamente.
        </p>
      )}
      {status === "error" && (
        <p className="text-red-600 text-center mt-3">
          ❌ Ocurrió un error. Intenta nuevamente.
        </p>
      )}
    </form>
  );
}
