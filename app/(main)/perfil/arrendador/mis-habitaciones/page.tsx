"use client";

import { useRoleGuard } from "@/presentation/hooks/useRoleGuard";
import {
  Loader2,
  Home,
  Calendar,
  Star,
  Settings,
  Eye,
  Pencil,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { RoomService } from "@/domain/services/RoomService";
import { ReservationService } from "@/domain/services/ReservationService";
import { toast } from "sonner";
import type { UserProfile } from "@/shared/types";

interface Stats {
  rooms: number;
  reservations: number;
  rating: number;
}

interface Room {
  id: string;
  title: string;
  price: number;
  location: string;
  available: boolean;
  rating?: number;
  room_photos?: { url: string }[];
}

export default function LandlordProfilePage() {
  const { user, profile, loading } = useRoleGuard("landlord");
  const [stats, setStats] = useState<Stats>({
    rooms: 0,
    reservations: 0,
    rating: 0,
  });
  const [rooms, setRooms] = useState<Room[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const router = useRouter();

  // ✅ useCallback para evitar warnings de dependencias
  const loadStats = useCallback(async () => {
    if (!user) return;
    try {
      setStatsLoading(true);
      const roomsData = await RoomService.getRoomsByLandlord(user.id);
      const reservations = await ReservationService.getReservationsByLandlord(
        user.id
      );
      const avgRating =
        roomsData.length > 0
          ? roomsData.reduce((sum, r: Room) => sum + (r.rating ?? 0), 0) /
            roomsData.length
          : 0;
      setStats({
        rooms: roomsData.length,
        reservations: reservations.length,
        rating: avgRating,
      });
    } catch {
      toast.error("Error al cargar estadísticas.");
    } finally {
      setStatsLoading(false);
    }
  }, [user]);

  const loadRooms = useCallback(async () => {
    if (!user) return;
    try {
      const data = await RoomService.getRoomsByLandlord(user.id);
      setRooms(data);
    } catch {
      toast.error("Error al cargar tus habitaciones.");
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    loadStats();
    loadRooms();
  }, [user, loadStats, loadRooms]); // ✅ Dependencias completas

  if (loading || statsLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      </div>
    );
  }

  const landlord = profile as UserProfile;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <Image
          src={landlord.photo_url ?? "/assets/placeholder.png"}
          alt={landlord.full_name}
          width={120}
          height={120}
          className="rounded-full object-cover shadow-md"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-blue-900 mb-1">
            {landlord.full_name}
          </h1>
          <p className="text-gray-500 mb-3">{landlord.email}</p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => router.push("/publicar")}>
              + Publicar habitación
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/perfil/arrendador/reservas")}
            >
              Ver reservas
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/perfil/arrendador/configuracion")}
            >
              <Settings className="h-4 w-4 mr-1" /> Configuración
            </Button>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid md:grid-cols-3 gap-4">
        <StatCard
          title="Habitaciones publicadas"
          value={stats.rooms}
          icon={<Home />}
        />
        <StatCard
          title="Reservas recibidas"
          value={stats.reservations}
          icon={<Calendar />}
        />
        <StatCard
          title="Calificación promedio"
          value={`${stats.rating.toFixed(1)} ⭐`}
          icon={<Star />}
        />
      </div>

      {/* Mis Habitaciones */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">
          Mis habitaciones
        </h2>

        {rooms.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No tienes habitaciones publicadas aún.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="border rounded-xl shadow-sm hover:shadow-md transition p-4 flex flex-col"
              >
                <div className="relative h-40 rounded-lg overflow-hidden">
                  <Image
                    src={
                      room.room_photos?.[0]?.url || "/assets/placeholder.png"
                    }
                    alt={room.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 mt-3 space-y-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {room.title}
                  </h3>
                  <p className="text-sm text-gray-500">{room.location}</p>
                  <p className="text-blue-600 font-semibold">
                    ${room.price}/mes
                  </p>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                      room.available
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {room.available ? "Disponible" : "Ocupada"}
                  </span>
                </div>
                <div className="flex justify-between mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/editar-habitacion/${room.id}`)}
                  >
                    <Pencil className="h-4 w-4 mr-1" /> Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/habitacion/${room.id}`)}
                  >
                    <Eye className="h-4 w-4 mr-1" /> Ver
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition">
      <div className="text-blue-600">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
