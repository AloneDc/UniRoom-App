"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star, MapPin, Eye, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface Room {
  id: string;
  title: string;
  price: number;
  location: string;
  type?: string;
  rating?: number;
  room_photos?: { url: string }[];
}

export default function RoomsList({ rooms }: { rooms: Room[] }) {
  const router = useRouter();

  // 🔢 Genera un rating determinista y puro
  const generateStableRating = (id: string) => {
    const hash =
      Array.from(id).reduce((acc, char) => acc + char.charCodeAt(0), 0) % 20;
    return 3.5 + hash / 10; // rating entre 3.5 y 5.5
  };

  // 🔢 Genera un número de reseñas determinista y puro
  const generateStableReviewCount = (id: string) => {
    const hash =
      Array.from(id).reduce((acc, char) => acc + char.charCodeAt(0), 0) % 50;
    return hash + 10; // reseñas entre 10 y 59
  };

  // ⚙️ Calcula ratings y reseñas sin impurezas
  const clientData = useMemo(() => {
    const data: Record<string, { rating: number; reviewCount: number }> = {};
    rooms.forEach((room) => {
      data[room.id] = {
        rating: room.rating ?? generateStableRating(room.id),
        reviewCount: generateStableReviewCount(room.id),
      };
    });
    return data;
  }, [rooms]);

  if (!rooms.length)
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-24 h-24 bg-gradient-to-br from-[#6C63FF]/10 to-[#00E0C6]/10 rounded-full flex items-center justify-center mb-6">
          <Sparkles className="w-12 h-12 text-[#6C63FF]/40" />
        </div>
        <p className="text-gray-500 text-center text-xl font-semibold mb-2">
          No se encontraron habitaciones
        </p>
        <p className="text-gray-400 text-center text-sm max-w-md">
          Intenta ajustar los filtros o buscar en otra ubicación
        </p>
      </div>
    );

  const handleViewDetails = (roomId: string) => {
    router.push(`/habitacion/${roomId}`);
  };

  const getRoomTypeLabel = (type?: string) => {
    const types: Record<string, string> = {
      individual: "Individual",
      compartida: "Compartida",
      departamento: "Departamento",
    };
    return type ? types[type] || type : "Habitación";
  };

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {rooms.map((room, index) => {
        const imageUrl =
          room.room_photos?.[0]?.url ?? "/assets/placeholder.png";
        const { rating, reviewCount } = clientData[room.id] ?? {
          rating: 4.5,
          reviewCount: 20,
        };

        return (
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer"
            onClick={() => handleViewDetails(room.id)}
          >
            {/* Imagen principal */}
            <div className="relative w-full h-56 overflow-hidden bg-gray-100">
              <Image
                src={imageUrl}
                alt={room.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={index < 6}
              />

              {/* Overlay gradiente */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Badge de tipo */}
              {room.type && (
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-[#6C63FF] text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                  {getRoomTypeLabel(room.type)}
                </span>
              )}

              {/* Precio */}
              <div className="absolute bottom-3 left-3 right-3 flex items-baseline gap-1">
                <span className="text-white text-2xl font-bold drop-shadow-lg">
                  S/ {room.price.toLocaleString()}
                </span>
                <span className="text-white/80 text-sm drop-shadow-lg">
                  / mes
                </span>
              </div>

              {/* Botón ver detalles (hover) */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300">
                <button
                  className="flex items-center gap-2 bg-gradient-to-r from-[#6C63FF] to-[#00E0C6] text-white font-semibold px-6 py-3 rounded-full shadow-xl hover:scale-105 transition-transform"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(room.id);
                  }}
                >
                  <Eye className="w-4 h-4" />
                  Ver detalles
                </button>
              </div>
            </div>

            {/* Información */}
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#6C63FF] transition-colors">
                {room.title}
              </h3>

              <div className="flex items-center gap-1.5 text-gray-600 text-sm mb-3">
                <MapPin className="w-4 h-4 text-[#6C63FF]" />
                <span className="line-clamp-1">{room.location}</span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < Math.floor(rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-700">
                  {rating.toFixed(1)}
                </span>
                <span className="text-xs text-gray-400">
                  ({reviewCount} reseñas)
                </span>
              </div>
            </div>

            {/* Borde animado en hover */}
            <div className="absolute inset-0 rounded-2xl border-2 border-[#6C63FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </motion.div>
        );
      })}
    </div>
  );
}
