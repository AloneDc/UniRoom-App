"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRoleGuard } from "@/presentation/hooks/useRoleGuard";
import { RoomService } from "@/domain/services/RoomService";
import { ReservationService } from "@/domain/services/ReservationService";
import { toast } from "sonner";
import {
  Loader2,
  Home,
  Calendar,
  Star,
  Settings,
  User,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { UserProfile, Room } from "@/shared/types";

interface Stats {
  rooms: number;
  reservations: number;
  rating: number;
}

export default function LandlordProfilePage() {
  const { user, profile, loading } = useRoleGuard("landlord");
  const [stats, setStats] = useState<Stats>({
    rooms: 0,
    reservations: 0,
    rating: 0,
  });
  const [myRooms, setMyRooms] = useState<Room[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!user) return;
    loadStats();
    loadRooms();
  }, [user]);

  const loadStats = async () => {
    if (!user) return;
    try {
      setStatsLoading(true);
      const rooms = await RoomService.getFilteredRooms({});
      const myRooms = rooms.filter((r) => r.landlord_id === user.id);
      const reservations = await ReservationService.getReservationsByLandlord(
        user.id
      );
      const avgRating =
        myRooms.length > 0
          ? myRooms.reduce((sum, r) => sum + (r.rating ?? 0), 0) /
            myRooms.length
          : 0;

      setStats({
        rooms: myRooms.length,
        reservations: reservations.length,
        rating: avgRating,
      });
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar estadísticas.");
    } finally {
      setStatsLoading(false);
    }
  };

  const loadRooms = async () => {
    if (!user) return;
    try {
      const rooms = await RoomService.getRoomsByLandlord(user.id);
      setMyRooms(rooms);
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar tus habitaciones.");
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    try {
      await RoomService.deleteRoom(roomId);
      toast.success("Habitación eliminada con éxito.");
      setMyRooms((prev) => prev.filter((r) => r.id !== roomId));
    } catch {
      toast.error("Error al eliminar la habitación.");
    }
  };

  if (loading || statsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-gradient-to-br from-[#E3F2FD] via-[#E0F7F4] to-[#F9FAFF]">
        <Loader2 className="animate-spin h-10 w-10 text-[#6C63FF]" />
      </div>
    );
  }

  if (!user || !profile) return null;
  const landlord = profile as UserProfile;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#E3F2FD] via-[#E0F7F4] to-[#F9FAFF] py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border border-[#6C63FF]/20 shadow-lg bg-white/90 backdrop-blur-sm rounded-3xl">
            <CardContent className="flex flex-col md:flex-row items-center gap-6 p-8">
              <Avatar className="w-28 h-28 border-4 border-[#6C63FF]/40 shadow-md">
                <AvatarImage
                  src={landlord.photo_url ?? "/assets/placeholder.png"}
                  alt={landlord.full_name}
                />
                <AvatarFallback>
                  <User className="text-gray-400" />
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-extrabold text-[#1A1A2E]">
                  {landlord.full_name}
                </h1>
                <p className="text-gray-500">{landlord.email}</p>
                <p className="text-sm text-gray-600 mt-1">
                  📅 Miembro desde{" "}
                  {landlord.created_at
                    ? new Date(landlord.created_at).toLocaleDateString(
                        "es-ES",
                        {
                          year: "numeric",
                          month: "long",
                        }
                      )
                    : "—"}
                </p>

                <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-5">
                  <Button
                    onClick={() => router.push("/publicar")}
                    className="bg-gradient-to-r from-[#6C63FF] to-[#00E0C6] hover:opacity-90 shadow"
                  >
                    + Publicar habitación
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/perfil/arrendador/reservas")}
                    className="border-[#6C63FF]/50 text-[#6C63FF] hover:bg-[#6C63FF]/10"
                  >
                    <Calendar className="h-4 w-4 mr-1" /> Ver reservas
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      router.push("/perfil/arrendador/configuracion")
                    }
                    className="border-gray-300 hover:bg-gray-50"
                  >
                    <Settings className="h-4 w-4 mr-1" /> Configuración
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ESTADÍSTICAS */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <StatCard
            title="Habitaciones publicadas"
            value={stats.rooms}
            icon={<Home className="w-5 h-5 text-[#6C63FF]" />}
            color="from-[#E3F2FD] to-white"
          />
          <StatCard
            title="Reservas recibidas"
            value={stats.reservations}
            icon={<Calendar className="w-5 h-5 text-[#00BFA6]" />}
            color="from-[#E0F7F4] to-white"
          />
          <StatCard
            title="Calificación promedio"
            value={`${stats.rating.toFixed(1)} ⭐`}
            icon={<Star className="w-5 h-5 text-yellow-500" />}
            color="from-[#FFF9C4] to-white"
          />
        </motion.div>

        {/* MIS HABITACIONES */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border border-gray-200 shadow-md bg-white/90 rounded-3xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-[#1A1A2E]">Mis Habitaciones</CardTitle>
              <CardDescription>
                Gestiona y visualiza tus publicaciones fácilmente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {myRooms.length === 0 ? (
                <p className="text-gray-500 py-6 text-center">
                  Aún no has publicado ninguna habitación.
                </p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myRooms.map((room) => (
                    <motion.div
                      key={room.id}
                      whileHover={{ scale: 1.02 }}
                      transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                      }}
                      className="border border-gray-100 rounded-2xl shadow-sm bg-white overflow-hidden hover:shadow-lg transition"
                    >
                      <div className="relative w-full h-40">
                        <Image
                          src={
                            room.room_photos?.[0]?.url ||
                            "/assets/placeholder.png"
                          }
                          alt={room.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4 space-y-2">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {room.title}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {room.location}
                        </p>
                        <p className="text-[#6C63FF] font-bold">
                          S/. {room.price} / mes
                        </p>
                        <Badge
                          className={`${
                            room.available
                              ? "bg-green-100 text-green-700 border-green-200"
                              : "bg-red-100 text-red-700 border-red-200"
                          }`}
                        >
                          {room.available ? "Disponible" : "Ocupada"}
                        </Badge>

                        <div className="flex justify-between pt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              router.push(`/habitacion/${room.id}`)
                            }
                            className="hover:bg-[#6C63FF]/10"
                          >
                            <Eye className="w-4 h-4 mr-1" /> Ver
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/editar/${room.id}`)}
                            className="hover:bg-[#00E0C6]/10"
                          >
                            <Pencil className="w-4 h-4 mr-1" /> Editar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteRoom(room.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-1" /> Eliminar
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}

/* 🧩 Subcomponente: Tarjeta de estadísticas */
function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 250, damping: 15 }}
      className={`p-5 rounded-2xl border shadow-sm bg-gradient-to-br ${color} flex items-center gap-4`}
    >
      <div className="p-2 bg-white rounded-lg shadow">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-semibold text-gray-900">{value}</p>
      </div>
    </motion.div>
  );
}
