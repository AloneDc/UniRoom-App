"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/presentation/context/AuthContext";
import { supabase } from "@/infrastructure/supabase/supabaseClient";
import { ReservationService } from "@/domain/services/ReservationService";
import { toast } from "sonner";
import { Loader2, Calendar, MapPin, Home } from "lucide-react";

/* -----------------------------------------------------
   ✅ Tipos seguros
----------------------------------------------------- */
type RentalType = "mensual" | "diaria";

interface RoomPhoto {
  url: string;
}

interface Room {
  id: string;
  title: string;
  price: number;
  location: string;
  type: "individual" | "compartida" | "departamento";
  landlord_id: string;
  room_photos?: RoomPhoto[];
}

/* -----------------------------------------------------
   💰 Calcular precio
----------------------------------------------------- */
function calculateReservationPrice(
  rentalType: RentalType,
  pricePerMonth: number,
  startDate: string,
  endDate?: string,
  monthsCount?: number
): { endDate: string; totalPrice: number } {
  const start = new Date(startDate);

  if (rentalType === "mensual" && monthsCount && monthsCount > 0) {
    const end = new Date(start);
    end.setMonth(end.getMonth() + monthsCount);
    const totalPrice = pricePerMonth * monthsCount;
    return { endDate: end.toISOString().split("T")[0], totalPrice };
  }

  if (rentalType === "diaria" && endDate) {
    const end = new Date(endDate);
    const diffDays = Math.max(
      1,
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    );
    const totalPrice = Math.round((pricePerMonth / 30) * diffDays);
    return { endDate, totalPrice };
  }

  throw new Error("Datos de reserva inválidos");
}

/* -----------------------------------------------------
   🧩 Página de Reserva
----------------------------------------------------- */
export default function ReservarPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const { user } = useAuth();

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [rentalType, setRentalType] = useState<RentalType>("mensual");
  const [dates, setDates] = useState<{ start_date: string; end_date: string }>({
    start_date: "",
    end_date: "",
  });
  const [monthsCount, setMonthsCount] = useState<number>(1);
  const [calculatedPrice, setCalculatedPrice] = useState<number>(0);

  /* -----------------------------------------------------
     🔹 Cargar habitación - ✅ useCallback
  ----------------------------------------------------- */
  const fetchRoom = useCallback(async (): Promise<void> => {
    if (!id) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("rooms")
        .select(
          `
          id,
          title,
          price,
          location,
          type,
          landlord_id,
          room_photos (url)
        `
        )
        .eq("id", id)
        .single<Room>();

      if (error || !data) throw new Error("No se encontró la habitación.");
      setRoom(data);
    } catch (err) {
      console.error(err);
      setError("Error al cargar la habitación.");
      toast.error("Error al cargar la habitación.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) void fetchRoom();
  }, [id, fetchRoom]); // ✅ Dependencias completas

  /* -----------------------------------------------------
     💰 Cálculo de precio dinámico
  ----------------------------------------------------- */
  useEffect(() => {
    if (!room || !dates.start_date) return;

    try {
      const result = calculateReservationPrice(
        rentalType,
        room.price,
        dates.start_date,
        rentalType === "diaria" ? dates.end_date : undefined,
        rentalType === "mensual" ? monthsCount : undefined
      );
      setCalculatedPrice(result.totalPrice);
      if (rentalType === "mensual") {
        setDates((prev) => ({ ...prev, end_date: result.endDate }));
      }
    } catch {
      setCalculatedPrice(0);
    }
  }, [rentalType, monthsCount, dates.start_date, dates.end_date, room]);

  /* -----------------------------------------------------
     🧾 Crear reserva
  ----------------------------------------------------- */
  const handleReserve = async (): Promise<void> => {
    if (!user) {
      toast.error("Debes iniciar sesión para reservar");
      router.push("/login");
      return;
    }
    if (!room || !dates.start_date) {
      toast.warning("Por favor selecciona las fechas antes de continuar.");
      return;
    }

    try {
      setSubmitting(true);
      const { endDate } = calculateReservationPrice(
        rentalType,
        room.price,
        dates.start_date,
        rentalType === "diaria" ? dates.end_date : undefined,
        rentalType === "mensual" ? monthsCount : undefined
      );

      await toast.promise(
        ReservationService.createReservation({
          roomId: room.id,
          userId: user.id,
          startDate: dates.start_date,
          endDate,
          rentalType: rentalType === "diaria" ? "daily" : "monthly",
          monthsCount: rentalType === "mensual" ? monthsCount : undefined,
        }),
        {
          loading: "Enviando solicitud de reserva...",
          success:
            "✅ Solicitud enviada. El arrendador te contactará para confirmar.",
          error: "Error al crear la reserva.",
        }
      );

      router.push("/perfil/estudiante/reservas");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  /* -----------------------------------------------------
     🖼️ Render
  ----------------------------------------------------- */
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#E3F2FD] via-[#E0F7F4] to-[#F9FAFF]">
        <Loader2 className="animate-spin h-10 w-10 text-[#6C63FF]" />
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#E3F2FD] via-[#E0F7F4] to-[#F9FAFF]">
        <p className="text-center text-red-600 text-lg mb-4">{error}</p>
        <button
          onClick={() => router.back()}
          className="bg-[#6C63FF] text-white px-6 py-2 rounded-lg hover:opacity-90"
        >
          Volver
        </button>
      </div>
    );

  if (!room)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#E3F2FD] via-[#E0F7F4] to-[#F9FAFF]">
        <p className="text-center text-gray-600 text-lg mb-4">
          No se encontró la habitación.
        </p>
        <button
          onClick={() => router.back()}
          className="bg-[#6C63FF] text-white px-6 py-2 rounded-lg hover:opacity-90"
        >
          Volver
        </button>
      </div>
    );

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#E3F2FD] via-[#E0F7F4] to-[#F9FAFF] py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-3xl shadow-lg p-8 md:p-10">
        <h1 className="text-3xl font-extrabold text-center text-[#6C63FF] mb-6">
          🏡 Reservar habitación
        </h1>

        {/* 🏠 Detalles */}
        <div className="flex flex-col md:flex-row gap-6 border rounded-xl p-6 bg-white shadow-sm">
          <div className="relative w-full md:w-1/3 h-48 rounded-lg overflow-hidden">
            <Image
              src={room.room_photos?.[0]?.url || "/assets/placeholder.png"}
              alt={room.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 space-y-2">
            <h2 className="text-2xl font-semibold text-gray-800">
              {room.title}
            </h2>
            <p className="text-gray-500 flex items-center gap-1">
              <MapPin size={16} className="text-gray-400" />
              {room.location}
            </p>
            <p className="text-gray-600 capitalize flex items-center gap-1">
              <Home size={16} className="text-gray-400" />
              Tipo: {room.type}
            </p>
            <p className="text-[#6C63FF] text-2xl font-bold">
              S/ {room.price.toLocaleString()} / mes
            </p>
          </div>
        </div>

        {/* Tipo de reserva */}
        <div className="bg-white shadow-md rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Calendar size={20} className="text-[#6C63FF]" />
            Tipo de reserva
          </h3>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rentalType"
                value="mensual"
                checked={rentalType === "mensual"}
                onChange={() => setRentalType("mensual")}
                className="w-4 h-4 text-[#6C63FF] focus:ring-[#6C63FF]"
              />
              <span className="font-medium">Por meses</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="rentalType"
                value="diaria"
                checked={rentalType === "diaria"}
                onChange={() => setRentalType("diaria")}
                className="w-4 h-4 text-[#6C63FF] focus:ring-[#6C63FF]"
              />
              <span className="font-medium">Por fechas exactas</span>
            </label>
          </div>

          {rentalType === "mensual" && (
            <div className="grid md:grid-cols-2 gap-6 mt-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Fecha de inicio
                </label>
                <input
                  type="date"
                  value={dates.start_date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) =>
                    setDates((d) => ({ ...d, start_date: e.target.value }))
                  }
                  className="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF]"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Cantidad de meses
                </label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={monthsCount}
                  onChange={(e) => setMonthsCount(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF]"
                />
                <p className="text-xs text-gray-500 mt-1">Máximo 12 meses</p>
              </div>
            </div>
          )}

          {rentalType === "diaria" && (
            <div className="grid md:grid-cols-2 gap-6 mt-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Fecha de inicio
                </label>
                <input
                  type="date"
                  value={dates.start_date}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) =>
                    setDates((d) => ({ ...d, start_date: e.target.value }))
                  }
                  className="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF]"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Fecha de fin
                </label>
                <input
                  type="date"
                  value={dates.end_date}
                  min={
                    dates.start_date || new Date().toISOString().split("T")[0]
                  }
                  onChange={(e) =>
                    setDates((d) => ({ ...d, end_date: e.target.value }))
                  }
                  className="border border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-[#6C63FF]/30 focus:border-[#6C63FF]"
                />
              </div>
            </div>
          )}

          {dates.end_date && rentalType === "mensual" && (
            <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              📅 Fecha de finalización calculada:{" "}
              <span className="font-semibold">
                {new Date(dates.end_date).toLocaleDateString("es-PE", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </p>
          )}
        </div>

        {/* 💰 Resumen */}
        <div className="bg-gradient-to-r from-[#6C63FF] to-[#00E0C6] rounded-2xl p-6 text-white flex flex-col md:flex-row justify-between items-center gap-4 shadow-md">
          <div>
            <p className="text-lg font-medium">Total estimado:</p>
            <p className="text-4xl font-bold">
              S/ {calculatedPrice.toLocaleString()}
            </p>
            {calculatedPrice > 0 && rentalType === "diaria" && (
              <p className="text-sm opacity-90 mt-1">
                ~S/{" "}
                {Math.round(
                  calculatedPrice /
                    Math.ceil(
                      (new Date(dates.end_date).getTime() -
                        new Date(dates.start_date).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )
                )}{" "}
                por día
              </p>
            )}
          </div>

          <button
            disabled={submitting || calculatedPrice <= 0 || !dates.start_date}
            onClick={() => void handleReserve()}
            className="bg-white text-[#6C63FF] font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin h-5 w-5" />
                Reservando...
              </span>
            ) : (
              "Enviar solicitud"
            )}
          </button>
        </div>

        {calculatedPrice <= 0 && dates.start_date && (
          <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg text-center">
            ⚠️ Por favor completa todos los campos para calcular el precio
          </p>
        )}
      </div>
    </main>
  );
}
