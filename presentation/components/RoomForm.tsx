"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { roomSchema } from "@/shared/validations/roomSchema";
import { z } from "zod";
import { useState } from "react";
import { RoomService } from "@/domain/services/RoomService";
import { supabase } from "@/infrastructure/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Camera,
  MapPin,
  Home,
  Coins,
  Building,
  Wifi,
  ShowerHead,
  Utensils,
  Sofa,
} from "lucide-react";

type RoomFormType = z.input<typeof roomSchema>;

export default function RoomForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RoomFormType>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      location: "",
      address: "",
      type: "individual",
      services: [],
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const onSubmit = async (formData: RoomFormType) => {
    try {
      setLoading(true);
      setError("");
      setSuccess(false);

      const { data: session } = await supabase.auth.getUser();
      const user = session?.user;
      if (!user) throw new Error("Debes iniciar sesión para publicar.");

      const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!userData || userData.role !== "landlord")
        throw new Error("Solo los arrendadores pueden publicar habitaciones.");

      await RoomService.createRoom({
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        location: formData.location,
        address: formData.address,
        type: formData.type,
        landlord_id: user.id,
        images,
        services: formData.services || [],
      });

      setSuccess(true);
      reset();
      setImages([]);
      setPreviews([]);

      setTimeout(() => router.push("/perfil/arrendador"), 1800);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Ocurrió un error inesperado.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex justify-center items-center bg-gradient-to-br from-[#F3F4FF] via-[#E0F7F4] to-[#FFFFFF] px-4 py-10">
      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl shadow-xl p-8 md:p-10 w-full max-w-2xl"
      >
        <h2 className="text-3xl font-extrabold text-center mb-6 text-[#6C63FF]">
          🏠 Publicar nueva habitación
        </h2>

        {/* Mensajes */}
        {error && (
          <p className="text-red-600 bg-red-50 border border-red-100 text-sm mb-4 p-2 rounded-md text-center">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 bg-green-50 border border-green-100 text-sm mb-4 p-2 rounded-md text-center">
            ✅ Habitación publicada correctamente. Redirigiendo...
          </p>
        )}

        <div className="space-y-6">
          {/* Título */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Título del anuncio
            </label>
            <input
              {...register("title")}
              placeholder="Ejemplo: Habitación moderna cerca de la UDEP"
              className={`w-full p-3 rounded-lg border ${
                errors.title ? "border-red-400" : "border-gray-300"
              } focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF] outline-none transition`}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              {...register("description")}
              rows={4}
              placeholder="Describe la habitación, servicios incluidos, y condiciones..."
              className={`w-full p-3 rounded-lg border ${
                errors.description ? "border-red-400" : "border-gray-300"
              } focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF] outline-none transition`}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Precio + Ubicación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Precio mensual (S/.)
              </label>
              <div className="relative">
                <Coins
                  size={18}
                  className="absolute left-3 top-3.5 text-[#6C63FF]/70"
                />
                <input
                  type="number"
                  {...register("price")}
                  placeholder="Ejemplo: 800"
                  min={0}
                  step={50}
                  className={`w-full pl-9 p-3 rounded-lg border ${
                    errors.price ? "border-red-400" : "border-gray-300"
                  } focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF] outline-none transition`}
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Ciudad o zona
              </label>
              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-3 top-3.5 text-[#6C63FF]/70"
                />
                <input
                  {...register("location")}
                  placeholder="Ejemplo: Piura, Castilla"
                  className={`w-full pl-9 p-3 rounded-lg border ${
                    errors.location ? "border-red-400" : "border-gray-300"
                  } focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF] outline-none transition`}
                />
              </div>
            </div>
          </div>

          {/* Dirección */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Dirección exacta (opcional)
            </label>
            <div className="relative">
              <Building
                size={18}
                className="absolute left-3 top-3.5 text-[#6C63FF]/70"
              />
              <input
                {...register("address")}
                placeholder="Ejemplo: Av. Grau 1025, Piura"
                className="w-full pl-9 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF] outline-none transition"
              />
            </div>
          </div>

          {/* Tipo */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Tipo de habitación
            </label>
            <div className="relative">
              <Home
                size={18}
                className="absolute left-3 top-3.5 text-[#6C63FF]/70"
              />
              <select
                {...register("type")}
                className={`w-full pl-9 p-3 rounded-lg border ${
                  errors.type ? "border-red-400" : "border-gray-300"
                } focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF] outline-none transition`}
              >
                <option value="">Seleccionar tipo</option>
                <option value="individual">Individual</option>
                <option value="compartida">Compartida</option>
                <option value="departamento">Departamento</option>
              </select>
            </div>
          </div>

          {/* Servicios */}
          <div>
            <label className="block font-semibold text-gray-700 mb-2">
              Servicios incluidos
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-700">
              {[
                { label: "WiFi", icon: <Wifi size={16} /> },
                { label: "Baño privado", icon: <ShowerHead size={16} /> },
                { label: "Cocina", icon: <Utensils size={16} /> },
                { label: "Amoblado", icon: <Sofa size={16} /> },
                { label: "Lavandería", icon: <Building size={16} /> },
              ].map((service) => (
                <label
                  key={service.label}
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 cursor-pointer transition"
                >
                  <input
                    type="checkbox"
                    value={service.label}
                    {...register("services")}
                    className="accent-[#6C63FF]"
                  />
                  {service.icon}
                  <span>{service.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Imágenes */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Imágenes (mínimo 1)
            </label>
            <div className="flex items-center gap-2 border border-dashed border-gray-300 rounded-lg bg-gray-50 p-4 hover:border-[#6C63FF] transition">
              <Camera className="text-[#6C63FF]" size={20} />
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm text-gray-600 w-full bg-transparent outline-none"
              />
            </div>
            {previews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                {previews.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`preview-${i}`}
                    className="rounded-lg h-32 w-full object-cover shadow-md"
                  />
                ))}
              </div>
            )}
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
          {loading ? "Publicando..." : "Publicar habitación"}
        </motion.button>
      </motion.form>
    </section>
  );
}
