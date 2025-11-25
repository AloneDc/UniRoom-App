"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

interface Room {
  id: string;
  title: string;
  price: number;
  location: string;
  rating?: number;
  room_photos?: { url: string }[];
}

export default function RoomsList({ rooms }: { rooms: Room[] }) {
  const router = useRouter();

  // 🔢 Genera un rating determinista y puro
  const generateStableRating = (id: string) => {
    const hash =
      Array.from(id).reduce((acc, char) => acc + char.charCodeAt(0), 0) % 20;
    return 3 + hash / 10; // rating entre 3.0 y 5.0
  };

  // ⚙️ Calcula ratings sin impurezas
  const clientRatings = useMemo(() => {
    const ratings: Record<string, number> = {};
    rooms.forEach((room) => {
      ratings[room.id] = room.rating ?? generateStableRating(room.id);
    });
    return ratings;
  }, [rooms]);

  if (!rooms.length)
    return (
      <p className="text-gray-500 text-center py-10 text-lg">
        No se encontraron habitaciones con esos filtros 😔
      </p>
    );

  const handleViewDetails = (roomId: string) => {
    router.push(`/habitacion/${roomId}`);
  };

  return (
    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 p-2">
      {rooms.map((room) => {
        const imageUrl =
          room.room_photos?.[0]?.url ?? "/assets/placeholder.png";
        const rating = clientRatings[room.id] ?? 4.0;

        return (
          <div
            key={room.id}
            className="group relative overflow-hidden rounded-2xl bg-white/60 dark:bg-gray-800/50 border border-gray-200/60 shadow-md hover:shadow-2xl transition-all duration-500 backdrop-blur-md"
          >
            {/* Imagen principal */}
            <div className="relative w-full h-60 overflow-hidden">
              <Image
                src={imageUrl}
                alt={room.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={!room.room_photos?.[0]?.url}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <span className="absolute bottom-3 left-3 bg-white/90 dark:bg-gray-900/70 backdrop-blur-md text-blue-700 dark:text-blue-300 text-sm font-semibold px-3 py-1 rounded-full shadow-md">
                ${room.price.toLocaleString()} / mes
              </span>
            </div>

            {/* Información */}
            <div className="p-5">
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-200 mb-1 group-hover:text-blue-600 transition-colors">
                {room.title}
              </h3>

              <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
                {room.location}
              </p>

              <div className="flex items-center gap-1 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
                <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                  {rating.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Overlay animado */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 backdrop-blur-sm transition-all duration-500">
              <button
                onClick={() => handleViewDetails(room.id)}
                className="bg-blue-600 text-white px-6 py-2 rounded-full shadow-lg hover:bg-blue-700 active:scale-95 transition"
              >
                Ver detalles
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
