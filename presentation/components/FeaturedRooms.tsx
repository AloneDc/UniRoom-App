"use client";

import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";
import { motion } from "framer-motion";
import {
  Star,
  MapPin,
  Home,
  Wifi,
  ShowerHead,
  Utensils,
  Sofa,
  Building,
} from "lucide-react";

type Room = {
  id: string;
  title: string;
  price: number;
  location: string;
  type: "individual" | "compartida" | "departamento";
  rating?: number;
  services?: string[];
  room_photos?: { url: string }[];
};

interface FeaturedRoomsProps {
  rooms: Room[];
}

const FeaturedRooms: FC<FeaturedRoomsProps> = ({ rooms }) => {
  if (!rooms || rooms.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 text-lg">
          No hay habitaciones disponibles por el momento 💤
        </p>
      </div>
    );
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12 bg-gradient-to-br from-[#F9FAFF] via-[#EFF9F8] to-[#FFFFFF] rounded-3xl shadow-inner">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-[#1A1A2E] mb-10">
        Habitaciones destacadas ✨
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {rooms.map((room, index) => {
          const imageUrl =
            room.room_photos?.[0]?.url || "/assets/placeholder.png";

          return (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="relative bg-white/90 backdrop-blur-xl border border-gray-100 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Imagen */}
              <div className="relative h-56 w-full overflow-hidden group">
                <Image
                  src={imageUrl}
                  alt={room.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Información */}
              <div className="p-6 flex flex-col justify-between h-[260px]">
                <div>
                  <h3 className="text-xl font-semibold text-[#1A1A2E] mb-2 line-clamp-2">
                    {room.title}
                  </h3>

                  <p className="text-gray-600 text-sm flex items-center gap-1 mb-2">
                    <MapPin size={15} className="text-[#6C63FF]" />{" "}
                    {room.location}
                  </p>

                  <p className="text-gray-600 text-sm flex items-center gap-1 mb-2">
                    <Home size={15} className="text-[#00E0C6]" />{" "}
                    {room.type === "individual"
                      ? "Habitación individual"
                      : room.type === "compartida"
                      ? "Habitación compartida"
                      : "Departamento completo"}
                  </p>

                  {/* Servicios */}
                  {room.services && room.services.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {room.services.slice(0, 3).map((service) => {
                        const icons: Record<string, React.ReactNode> = {
                          WiFi: <Wifi size={14} className="text-[#6C63FF]" />,
                          "Baño privado": (
                            <ShowerHead size={14} className="text-[#6C63FF]" />
                          ),
                          Cocina: (
                            <Utensils size={14} className="text-[#6C63FF]" />
                          ),
                          Amoblado: (
                            <Sofa size={14} className="text-[#6C63FF]" />
                          ),
                          Lavandería: (
                            <Building size={14} className="text-[#6C63FF]" />
                          ),
                        };
                        return (
                          <span
                            key={service}
                            className="text-xs flex items-center gap-1 bg-[#F4F3FF] text-[#1A1A2E] px-2 py-1 rounded-full"
                          >
                            {icons[service] || "•"} {service}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Precio y rating */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-[#6C63FF] font-bold text-lg">
                      S/.{room.price.toLocaleString("es-PE")}{" "}
                      <span className="text-gray-600 text-sm font-normal">
                        / mes
                      </span>
                    </p>

                    {room.rating && (
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star size={15} fill="#FFD700" />{" "}
                        <span className="text-sm font-medium text-gray-700">
                          {room.rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>

                  <Link
                    href={`/habitacion/${room.id}`}
                    className="block w-full text-center bg-gradient-to-r from-[#6C63FF] to-[#00E0C6] text-white font-semibold py-2.5 rounded-full shadow-md hover:shadow-lg transition-transform transform hover:scale-[1.03] active:scale-[0.98]"
                  >
                    Ver detalles
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default FeaturedRooms;
