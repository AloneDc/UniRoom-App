"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import {
  profileSchema,
  type ProfileInput,
} from "@/shared/validations/profileSchema";
import { ProfileService } from "@/domain/services/ProfileService";
import { useAuth } from "@/presentation/context/AuthContext";
import { toast } from "sonner";
import { Upload, Loader2, User } from "lucide-react";
import { Button } from "@/components/ui/button";

// ✅ Extendemos el tipo para incluir email (solo lectura)
interface ProfileFormData extends ProfileInput {
  email?: string;
}

export default function ProfileForm({
  initialData,
}: {
  initialData: ProfileFormData;
}) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [preview, setPreview] = useState<string | null>(
    initialData.photo_url || null
  );

  const form = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: initialData.full_name,
      phone: initialData.phone,
      photo_url: initialData.photo_url,
    },
  });

  const onSubmit = async (values: ProfileInput) => {
    if (!user) return;

    setLoading(true);
    try {
      await ProfileService.updateProfile(user.id, values);
      toast.success("Perfil actualizado correctamente ✅");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al actualizar el perfil";
      toast.error(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !user) return;
    const file = e.target.files[0];

    // Validar tamaño de archivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no puede superar los 5MB");
      return;
    }

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      toast.error("Solo se permiten archivos de imagen");
      return;
    }

    try {
      setUploadingPhoto(true);
      const publicUrl = await ProfileService.uploadProfilePhoto(file, user.id);
      setPreview(publicUrl);
      form.setValue("photo_url", publicUrl);
      toast.success("Foto actualizada correctamente 📸");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al subir la foto";
      toast.error(message);
      console.error(err);
    } finally {
      setUploadingPhoto(false);
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="bg-white p-6 rounded-xl shadow-md space-y-6 max-w-lg mx-auto"
    >
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        Editar Perfil
      </h2>

      {/* Foto de perfil */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative group">
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-100 shadow-lg">
            {preview ? (
              <Image
                src={preview}
                alt="Foto de perfil"
                width={112}
                height={112}
                className="w-full h-full object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <User className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </div>
          {uploadingPhoto && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>

        <label className="cursor-pointer">
          <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition border border-blue-200">
            <Upload className="w-4 h-4" />
            <span className="text-sm font-medium">
              {uploadingPhoto ? "Subiendo..." : "Cambiar foto"}
            </span>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
            disabled={uploadingPhoto || loading}
          />
        </label>
        <p className="text-xs text-gray-500 text-center">
          Formatos: JPG, PNG. Máximo 5MB
        </p>
      </div>

      {/* Nombre completo */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Nombre completo
        </label>
        <input
          {...form.register("full_name")}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          placeholder="Ej: Juan Pérez García"
          disabled={loading}
        />
        {form.formState.errors.full_name && (
          <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
            ⚠️ {form.formState.errors.full_name.message}
          </p>
        )}
      </div>

      {/* Teléfono */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Teléfono
        </label>
        <input
          {...form.register("phone")}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          placeholder="Ej: +51 987 654 321"
          disabled={loading}
        />
        {form.formState.errors.phone && (
          <p className="text-red-500 text-sm mt-1.5 flex items-center gap-1">
            ⚠️ {form.formState.errors.phone.message}
          </p>
        )}
      </div>

      {/* Email (solo lectura) - solo si existe */}
      {initialData.email && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Correo electrónico
          </label>
          <input
            type="email"
            value={initialData.email}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 bg-gray-50 text-gray-500 cursor-not-allowed"
            disabled
            readOnly
          />
          <p className="text-xs text-gray-500 mt-1.5">
            El correo no puede modificarse
          </p>
        </div>
      )}

      {/* Botón de guardar */}
      <Button
        type="submit"
        disabled={loading || uploadingPhoto}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-semibold shadow-md transition-all"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Guardando...
          </>
        ) : (
          "Guardar cambios"
        )}
      </Button>
    </form>
  );
}
