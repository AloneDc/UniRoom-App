"use client";

import {
  Star,
  MapPin,
  Edit,
  Trash2,
  Coins,
  Home,
  Wifi,
  Utensils,
  ShowerHead,
  Sofa,
  Building,
} from "lucide-react";
import RoomGallery from "./RoomGallery";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuth } from "@/presentation/context/AuthContext";
import { supabase } from "@/infrastructure/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface Landlord {
  full_name?: string;
  photo_url?: string;
}

interface RoomPhoto {
  url: string;
}

interface RoomDetailData {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  address?: string;
  type: "individual" | "compartida" | "departamento";
  services?: string[];
  rating?: number;
  landlord_id?: string;
  room_photos?: RoomPhoto[];
  users?: Landlord;
}

export default function RoomDetail({ room }: { room: RoomDetailData }) {
  const { user } = useAuth();
  const router = useRouter();

  const [role, setRole] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  const rating = room.rating ?? 4.5;
  const landlord = room.users || {};

  useEffect(() => {
    let active = true;
    const fetchRole = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();
      if (error) {
        console.error("Error al obtener rol:", error.message);
        setLoading(false);
        return;
      }
      if (!active) return;
      setRole(data?.role || null);
      setIsOwner(room.landlord_id === user.id);
      setLoading(false);
    };
    fetchRole();
    return () => {
      active = false;
    };
  }, [user, room.landlord_id]);

  const handleEditRoom = (): void =>
    router.push(`/editar-habitacion/${room.id}`);
  const handleDeleteRoom = async (): Promise<void> => {
    if (!confirm("¿Seguro que deseas eliminar esta habitación?")) return;
    try {
      const { error } = await supabase.from("rooms").delete().eq("id", room.id);
      if (error) throw error;
      alert("✅ Habitación eliminada correctamente.");
      router.push("/perfil/arrendador");
    } catch (err) {
      console.error(err);
      alert("❌ Error al eliminar la habitación.");
    }
  };
  const handleReserve = (): void => {
    if (!user) {
      alert("Debes iniciar sesión para reservar una habitación.");
      router.push("/login");
      return;
    }
    router.push(`/reservar/${room.id}`);
  };

  const serviceIcons: Record<string, React.ReactNode> = {
    WiFi: <Wifi size={16} className="text-[#6C63FF]" />,
    Cocina: <Utensils size={16} className="text-[#6C63FF]" />,
    "Baño privado": <ShowerHead size={16} className="text-[#6C63FF]" />,
    Amoblado: <Sofa size={16} className="text-[#6C63FF]" />,
    Lavandería: <Building size={16} className="text-[#6C63FF]" />,
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen w-full bg-gradient-to-br from-[#E3F2FD] via-[#E0F7F4] to-[#F9FAFF] px-4 py-12"
    >
      <div className="max-w-6xl mx-auto space-y-10">
        {/* 🖼️ Galería */}
        <RoomGallery photos={room.room_photos ?? []} />

        <div className="grid md:grid-cols-3 gap-10">
          {/* ℹ️ Información principal */}
          <div className="md:col-span-2 bg-white/90 backdrop-blur-lg border border-white/60 shadow-xl rounded-3xl p-8 hover:shadow-2xl transition-all duration-300">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#1A1A2E] mb-2">
              {room.title}
            </h1>

            <p className="text-gray-600 text-lg flex items-center gap-1 mb-2">
              <MapPin size={18} className="text-[#6C63FF]" />
              {room.location}
            </p>
            {room.address && (
              <p className="text-gray-500 text-sm mb-4 pl-6">{room.address}</p>
            )}

            {/* ⭐ Rating */}
            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(rating)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-gray-700 ml-1 text-sm font-medium">
                {rating.toFixed(1)}
              </span>
            </div>

            {/* 🧾 Descripción */}
            <p className="text-gray-700 leading-relaxed mb-6 whitespace-pre-line">
              {room.description}
            </p>

            {/* 🏷️ Tipo */}
            <div className="mb-6 flex items-center gap-2 text-gray-700 bg-[#EAF4FF] px-3 py-2 rounded-xl w-fit">
              <Home size={18} className="text-[#00E0C6]" />
              {room.type === "individual"
                ? "Habitación individual"
                : room.type === "compartida"
                ? "Habitación compartida"
                : "Departamento completo"}
            </div>

            {/* 🔧 Servicios */}
            {room.services && room.services.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Servicios incluidos
                </h3>
                <div className="flex flex-wrap gap-2">
                  {room.services.map((service) => (
                    <span
                      key={service}
                      className="flex items-center gap-1 bg-[#F3F4FF] text-[#1A1A2E] px-3 py-1.5 rounded-full text-sm font-medium"
                    >
                      {serviceIcons[service] || "•"} {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 💰 Precio y acciones */}
            <div className="flex items-center justify-between border-t pt-5 mt-6">
              <span className="text-2xl font-bold text-[#6C63FF] flex items-center gap-1">
                <Coins size={20} className="text-[#00E0C6]" /> S/.
                {room.price.toLocaleString("es-PE")}{" "}
                <span className="text-gray-500 text-sm font-medium">/ mes</span>
              </span>

              {loading ? (
                <span className="text-gray-500 italic">Cargando...</span>
              ) : !user ? (
                <button
                  onClick={() => router.push("/login")}
                  className="bg-gradient-to-r from-[#6C63FF] to-[#00E0C6] text-white px-6 py-2.5 rounded-full font-semibold shadow-md hover:opacity-90 transition"
                >
                  Inicia sesión para reservar
                </button>
              ) : isOwner ? (
                <div className="flex gap-3">
                  <button
                    onClick={handleEditRoom}
                    className="flex items-center gap-1 bg-yellow-500 text-white px-5 py-2 rounded-full hover:bg-yellow-600 transition font-medium"
                  >
                    <Edit size={16} /> Editar
                  </button>
                  <button
                    onClick={handleDeleteRoom}
                    className="flex items-center gap-1 bg-red-600 text-white px-5 py-2 rounded-full hover:bg-red-700 transition font-medium"
                  >
                    <Trash2 size={16} /> Eliminar
                  </button>
                </div>
              ) : role === "student" ? (
                <button
                  onClick={handleReserve}
                  className="bg-gradient-to-r from-[#6C63FF] to-[#00E0C6] text-white px-6 py-2.5 rounded-full font-semibold shadow-md hover:opacity-90 transition"
                >
                  Reservar ahora
                </button>
              ) : (
                <span className="text-gray-500 italic">
                  Solo los estudiantes pueden reservar
                </span>
              )}
            </div>
          </div>

          {/* 🧍 Propietario */}
          <aside className="p-6 border border-gray-200 rounded-3xl bg-gradient-to-br from-[#FFFFFF]/90 via-[#EAF4FF]/90 to-[#F0FFFB]/90 shadow-md backdrop-blur-sm">
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-4">
              Arrendador
            </h2>
            <div className="flex items-center gap-4">
              <Image
                src={
                  landlord.photo_url && landlord.photo_url.trim() !== ""
                    ? landlord.photo_url
                    : "/assets/placeholder.png"
                }
                alt={landlord.full_name ?? "Arrendador"}
                width={70}
                height={70}
                className="rounded-full object-cover border-2 border-[#6C63FF]/30"
              />
              <div>
                <p className="font-semibold text-[#1A1A2E]">
                  {landlord.full_name ?? "Usuario"}
                </p>
                <p className="text-gray-500 text-sm">
                  Propietario verificado ✅
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </motion.section>
  );
}
