"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRoleGuard } from "@/presentation/hooks/useRoleGuard";
import { ReservationService } from "@/domain/services/ReservationService";
import { toast } from "sonner";
import { Loader2, CalendarDays, MapPin, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type ReservationStatus = "pending" | "confirmed" | "cancelled";

interface RoomPhoto {
  url: string;
}

interface Room {
  id: string;
  title: string;
  price: number;
  location: string;
  room_photos?: RoomPhoto[];
}

interface Reservation {
  id: string;
  start_date: string;
  end_date: string;
  status: ReservationStatus;
  rental_type: "daily" | "monthly";
  months_count?: number;
  created_at: string;
  rooms?: Room;
}

export default function StudentReservationsPage() {
  const { user, loading: userLoading } = useRoleGuard("student");
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) void loadReservations();
  }, [user]);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const data = await ReservationService.getReservationsByStudent(user!.id);
      setReservations(data);
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar tus reservas.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm("¿Seguro que deseas cancelar esta reserva?")) return;
    try {
      await ReservationService.cancelReservation(id, user!.id);
      toast.success("Reserva cancelada exitosamente.");
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "cancelled" } : r))
      );
    } catch {
      toast.error("Error al cancelar la reserva.");
    }
  };

  if (userLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-gradient-to-br from-[#E3F2FD] via-[#E0F7F4] to-[#F9FAFF]">
        <Loader2 className="animate-spin h-10 w-10 text-[#6C63FF]" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#E3F2FD] via-[#E0F7F4] to-[#F9FAFF] py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 🔹 Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <h1 className="text-3xl font-extrabold text-[#1A1A2E] mb-2">
            Mis Reservas 🗓️
          </h1>
          <p className="text-gray-600">
            Aquí puedes ver todas tus reservas activas y su estado actual.
          </p>
        </motion.div>

        {/* 🔹 Lista de reservas */}
        {reservations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-gray-500 text-lg"
          >
            No tienes reservas por el momento 😴
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {reservations.map((r, index) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/90 backdrop-blur-lg border border-white/60 rounded-2xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col"
              >
                {/* Imagen */}
                <div className="relative h-40 w-full overflow-hidden">
                  <Image
                    src={
                      r.rooms?.room_photos?.[0]?.url ||
                      "/assets/placeholder.png"
                    }
                    alt={r.rooms?.title || "Habitación"}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                {/* Detalles */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-[#1A1A2E] truncate">
                      {r.rooms?.title}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin size={14} /> {r.rooms?.location}
                    </p>

                    <div className="mt-3 space-y-1 text-sm text-gray-600">
                      <p className="flex items-center gap-1">
                        <CalendarDays size={14} />
                        <span>
                          {new Date(r.start_date).toLocaleDateString("es-PE")} →{" "}
                          {new Date(r.end_date).toLocaleDateString("es-PE")}
                        </span>
                      </p>
                      <p className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>
                          {r.rental_type === "monthly"
                            ? `${r.months_count} mes(es)`
                            : "Reserva diaria"}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Estado y acciones */}
                  <div className="mt-4 flex justify-between items-center">
                    <Badge
                      className={`text-xs px-3 py-1 rounded-full ${
                        r.status === "confirmed"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : r.status === "pending"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                          : "bg-red-100 text-red-700 border-red-200"
                      }`}
                    >
                      {r.status === "confirmed"
                        ? "Confirmada"
                        : r.status === "pending"
                        ? "Pendiente"
                        : "Cancelada"}
                    </Badge>

                    {r.status === "pending" && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleCancel(r.id)}
                        className="flex items-center gap-1"
                      >
                        <XCircle size={14} />
                        Cancelar
                      </Button>
                    )}
                  </div>
                </div>

                {/* Precio */}
                <div className="border-t p-4 text-right text-[#6C63FF] font-semibold">
                  S/ {r.rooms?.price.toLocaleString()}{" "}
                  <span className="text-gray-500 text-sm font-normal">
                    / mes
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
