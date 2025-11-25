"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/presentation/context/AuthContext";
import {
  ReservationService,
  Reservation,
} from "@/domain/services/ReservationService";
import Image from "next/image";
import { toast } from "sonner";

/* -----------------------------------------------------
   🧩 Página: Reservas (Arrendador)
----------------------------------------------------- */

export default function ReservasArrendadorPage() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* -----------------------------------------------------
     🔹 Cargar reservas del arrendador
  ----------------------------------------------------- */
  useEffect(() => {
    if (!user?.id) return;
    void fetchReservations();
  }, [user]);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await ReservationService.getReservationsByLandlord(user!.id);
      setReservations(data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar las reservas de tus habitaciones.");
    } finally {
      setLoading(false);
    }
  };

  /* -----------------------------------------------------
     🔹 Confirmar / Rechazar reserva
  ----------------------------------------------------- */
  const handleUpdateStatus = async (
    id: string,
    status: "confirmed" | "cancelled"
  ) => {
    try {
      await ReservationService.updateReservationStatus(id, status);
      toast.success(
        status === "confirmed"
          ? "Reserva confirmada correctamente."
          : "Reserva rechazada correctamente."
      );
      void fetchReservations();
    } catch {
      toast.error("Error al actualizar el estado de la reserva.");
    }
  };

  /* -----------------------------------------------------
     🧭 Render
  ----------------------------------------------------- */
  if (loading) return <p className="text-center py-10">Cargando reservas...</p>;
  if (error) return <p className="text-center text-red-600 py-10">{error}</p>;

  if (reservations.length === 0)
    return (
      <p className="text-center py-10 text-gray-500">
        No tienes reservas registradas aún.
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-blue-800">Reservas Recibidas</h1>

      <div className="grid gap-6">
        {reservations.map((r) => (
          <div
            key={r.id}
            className="flex flex-col md:flex-row gap-6 p-5 bg-white rounded-xl shadow-sm border"
          >
            {/* Imagen */}
            <div className="relative w-full md:w-1/3 h-40 rounded-lg overflow-hidden">
              <Image
                src={
                  r.rooms?.room_photos?.[0]?.url || "/assets/placeholder.png"
                }
                alt={r.rooms?.title || "Habitación"}
                fill
                className="object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-2">
              <h2 className="text-xl font-semibold text-gray-800">
                {r.rooms?.title || "Habitación sin título"}
              </h2>
              <p className="text-gray-600">{r.rooms?.location}</p>
              <p className="text-sm text-gray-500">
                Desde <b>{r.start_date}</b> hasta <b>{r.end_date}</b>
              </p>

              {/* Estado */}
              <p
                className={`font-semibold ${
                  r.status === "pending"
                    ? "text-yellow-600"
                    : r.status === "confirmed"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                Estado:{" "}
                {r.status === "pending"
                  ? "Pendiente"
                  : r.status === "confirmed"
                  ? "Confirmada"
                  : "Cancelada"}
              </p>

              {/* Datos del estudiante */}
              {r.users && (
                <div className="mt-2 text-sm text-gray-700">
                  <p>
                    <b>Estudiante:</b> {r.users.full_name}
                  </p>
                  <p>
                    <b>Email:</b> {r.users.email}
                  </p>
                  {r.users.phone && (
                    <p>
                      <b>Teléfono:</b> {r.users.phone}
                    </p>
                  )}
                </div>
              )}

              {/* Acciones */}
              <div className="flex gap-3 pt-3">
                {/* Confirmar / Rechazar */}
                {r.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(r.id, "confirmed")}
                      className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(r.id, "cancelled")}
                      className="px-4 py-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
                    >
                      Rechazar
                    </button>
                  </>
                )}

                {/* Contactar estudiante */}
                {r.users?.phone && (
                  <a
                    href={`https://wa.me/${r.users.phone.replace(
                      /[^0-9]/g,
                      ""
                    )}?text=Hola ${
                      r.users.full_name
                    }, te contacto desde UniRoom sobre tu reserva en "${
                      r.rooms?.title
                    }".`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition"
                  >
                    Contactar por WhatsApp
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
