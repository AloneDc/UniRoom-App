"use client";

import { useState } from "react";
import { ReservationService } from "@/domain/services/ReservationService";
import { useAuth } from "@/presentation/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { es } from "date-fns/locale";

interface ReserveButtonProps {
  roomId: string;
}

export const ReserveButton: React.FC<ReserveButtonProps> = ({ roomId }) => {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [rentalType, setRentalType] = useState<"daily" | "monthly">("daily");
  const [monthsCount, setMonthsCount] = useState<number>(1);
  const [loadingAction, setLoadingAction] = useState(false);

  const handleReservation = async (): Promise<void> => {
    if (!user) {
      toast.error("Debes iniciar sesión como estudiante para reservar.");
      return;
    }

    if (!startDate) {
      toast.warning("Selecciona una fecha de inicio.");
      return;
    }

    if (rentalType === "daily" && !endDate) {
      toast.warning("Selecciona la fecha de salida.");
      return;
    }

    try {
      setLoadingAction(true);

      // ✅ Calculamos endDate según el tipo de renta
      const calculatedEndDate =
        rentalType === "daily" && endDate
          ? endDate.toISOString().split("T")[0]
          : (() => {
              // Para alquiler mensual, calculamos la fecha de fin
              const end = new Date(startDate);
              end.setMonth(end.getMonth() + monthsCount);
              return end.toISOString().split("T")[0];
            })();

      await ReservationService.createReservation({
        roomId,
        userId: user.id,
        startDate: startDate.toISOString().split("T")[0],
        endDate: calculatedEndDate, // ✅ Ahora siempre es string
        rentalType,
        monthsCount: rentalType === "monthly" ? monthsCount : undefined,
      });

      toast.success("Reserva creada con éxito ✅");
      setOpen(false);
      setStartDate(null);
      setEndDate(null);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Error desconocido al crear la reserva";
      toast.error(message);
    } finally {
      setLoadingAction(false);
    }
  };

  if (loading) return null;
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          disabled={loadingAction}
        >
          Reservar ahora
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Selecciona tu tipo de reserva</DialogTitle>
          <DialogDescription>
            Puedes reservar por días o arrendar por meses.
          </DialogDescription>
        </DialogHeader>

        {/* 🔹 Tipo de reserva */}
        <div className="flex gap-4 mt-4">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="radio"
              name="rentalType"
              value="daily"
              checked={rentalType === "daily"}
              onChange={() => setRentalType("daily")}
            />
            Por días
          </label>
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="radio"
              name="rentalType"
              value="monthly"
              checked={rentalType === "monthly"}
              onChange={() => setRentalType("monthly")}
            />
            Por meses
          </label>
        </div>

        {/* 🔹 Calendario o selector mensual */}
        {rentalType === "daily" ? (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-sm font-medium mb-1">Desde</p>
              <Calendar
                mode="single"
                selected={startDate ?? undefined}
                onSelect={(date: Date | undefined) =>
                  setStartDate(date ?? null)
                }
                locale={es}
                initialFocus
              />
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Hasta</p>
              <Calendar
                mode="single"
                selected={endDate ?? undefined}
                onSelect={(date: Date | undefined) => setEndDate(date ?? null)}
                locale={es}
              />
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Duración (meses)</p>
            <input
              type="number"
              min={1}
              max={12}
              value={monthsCount}
              onChange={(e) => setMonthsCount(Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Desde {startDate?.toLocaleDateString("es-PE") || "..."} hasta{" "}
              {startDate
                ? new Date(
                    new Date(startDate).setMonth(
                      startDate.getMonth() + monthsCount
                    )
                  ).toLocaleDateString("es-PE")
                : "..."}
            </p>
          </div>
        )}

        {/* 🔹 Botón de confirmar */}
        <Button
          onClick={handleReservation}
          className="mt-6 bg-green-600 hover:bg-green-700 text-white"
          disabled={loadingAction}
        >
          {loadingAction ? "Procesando..." : "Confirmar reserva"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
