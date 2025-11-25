"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { roomSchema } from "@/shared/validations/roomSchema";
import type { z } from "zod";
import { RoomService } from "@/domain/services/RoomService";
import { useState, ChangeEvent } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Resolver } from "react-hook-form";

/**
 * ✅ Tipo inferido directamente del schema (nunca lo escribas manual)
 */
export type RoomInput = z.infer<typeof roomSchema>;

export default function EditRoomForm({
  initialData,
  roomId,
}: {
  initialData: RoomInput;
  roomId: string;
}) {
  const router = useRouter();
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * 🧠 useForm tipado con RoomInput y compatible con zodResolver
   * 👇 Eliminamos el uso de "as any" usando un tipo explícito correcto
   */
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<z.infer<typeof roomSchema>>({
    resolver: zodResolver(roomSchema) as unknown as Resolver<
      z.infer<typeof roomSchema>
    >,
    defaultValues: initialData as z.infer<typeof roomSchema>,
    mode: "onBlur",
  });

  /**
   * 🖼️ Manejo de nuevas imágenes seleccionadas
   */
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setValue("images", files);
    setPreviewUrls(files.map((f) => URL.createObjectURL(f)));
  };

  /**
   * 💾 Guardar cambios
   */
  const onSubmit = async (values: RoomInput) => {
    try {
      setLoading(true);
      await RoomService.updateRoom(roomId, values);
      toast.success("✅ Habitación actualizada correctamente");
      router.push("/perfil/arrendador");
    } catch (error) {
      console.error(error);
      toast.error("❌ Error al actualizar la habitación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white shadow-md p-6 rounded-xl max-w-3xl mx-auto space-y-6"
    >
      <h2 className="text-2xl font-semibold text-blue-800 mb-4">
        Editar habitación
      </h2>

      {/* Título */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Título</label>
        <input
          {...register("title")}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Descripción
        </label>
        <textarea
          {...register("description")}
          className="w-full border border-gray-300 rounded-md px-3 py-2 h-28"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Precio y ubicación */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Precio</label>
          <input
            type="number"
            step="0.01"
            {...register("price", { valueAsNumber: true })}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
          )}
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Ubicación
          </label>
          <input
            {...register("location")}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          />
          {errors.location && (
            <p className="text-red-500 text-sm mt-1">
              {errors.location.message}
            </p>
          )}
        </div>
      </div>

      {/* Tipo */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Tipo de habitación
        </label>
        <select
          {...register("type")}
          className="w-full border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="">Selecciona...</option>
          <option value="individual">Individual</option>
          <option value="compartida">Compartida</option>
          <option value="departamento">Departamento</option>
        </select>
        {errors.type && (
          <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
        )}
      </div>

      {/* Subida de imágenes */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Nuevas imágenes
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
        <div className="flex gap-3 mt-3 flex-wrap">
          {previewUrls.map((url, i) => (
            <div key={i} className="relative w-24 h-24">
              <Image
                src={url}
                alt="Vista previa"
                fill
                className="object-cover rounded-md border"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Botón */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-blue-700 text-white px-6 py-2 rounded-lg transition ${
          loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-800"
        }`}
      >
        {loading ? "Guardando cambios..." : "Guardar cambios"}
      </button>
    </form>
  );
}
