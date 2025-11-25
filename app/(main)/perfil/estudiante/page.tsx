"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRoleGuard } from "@/presentation/hooks/useRoleGuard";
import { ReservationService } from "@/domain/services/ReservationService";
import { toast } from "sonner";
import {
  Loader2,
  Calendar,
  Star,
  Settings,
  User,
  BookmarkCheck,
  Mail,
  MessageCircle,
  MapPin,
  Eye,
  Clock,
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
import type { UserProfile } from "@/shared/types";

interface Landlord {
  full_name: string;
  email: string;
  phone?: string;
  photo_url?: string;
}

interface Room {
  id: string;
  title: string;
  price: number;
  location: string;
  room_photos?: { url: string }[];
}

interface Reservation {
  id: string;
  start_date: string;
  end_date: string;
  status: "pending" | "confirmed" | "cancelled";
  rental_type: "daily" | "monthly";
  months_count?: number;
  created_at: string;
  rooms?: Room;
  users?: Landlord;
}

interface Stats {
  reservations: number;
  confirmed: number;
  pending: number;
  rating: number;
}

export default function StudentProfilePage() {
  const { user, profile, loading } = useRoleGuard("student");
  const [stats, setStats] = useState<Stats>({
    reservations: 0,
    confirmed: 0,
    pending: 0,
    rating: 0,
  });
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const router = useRouter();

  // ✅ useCallback para evitar warning de dependencias
  const loadData = useCallback(async () => {
    if (!user) return;

    try {
      setLoadingData(true);
      const res = await ReservationService.getReservationsByUser(user.id);
      const confirmed = res.filter((r) => r.status === "confirmed");
      const pending = res.filter((r) => r.status === "pending");

      setReservations(confirmed);
      setStats({
        reservations: res.length,
        confirmed: confirmed.length,
        pending: pending.length,
        rating: 4.8,
      });
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar tus datos.");
    } finally {
      setLoadingData(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    void loadData();
  }, [user, loadData]);

  // ✅ Función para calcular días restantes
  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading || loadingData) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-gradient-to-br from-[#E3F2FD] via-[#E0F7F4] to-[#F9FAFF]">
        <Loader2 className="animate-spin h-10 w-10 text-[#6C63FF]" />
      </div>
    );
  }

  if (!user || !profile) return null;
  const student = profile as UserProfile;

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#E3F2FD] via-[#E0F7F4] to-[#F9FAFF] py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border border-[#6C63FF]/20 shadow-lg bg-white/90 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardContent className="flex flex-col md:flex-row items-center gap-6 p-8">
              <div className="relative">
                <Avatar className="w-28 h-28 border-4 border-[#6C63FF]/40 shadow-md">
                  <AvatarImage
                    src={student.photo_url ?? "/assets/placeholder.png"}
                    alt={student.full_name}
                  />
                  <AvatarFallback>
                    <User className="text-gray-400" />
                  </AvatarFallback>
                </Avatar>
                {stats.confirmed > 0 && (
                  <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs">
                    Activo
                  </Badge>
                )}
              </div>

              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-extrabold text-[#1A1A2E]">
                  {student.full_name}
                </h1>
                <p className="text-gray-500">{student.email}</p>
                {student.phone && (
                  <p className="text-sm text-gray-600 mt-1 flex items-center justify-center md:justify-start gap-1">
                    📞 {student.phone}
                  </p>
                )}
                <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    🎓 Estudiante
                  </Badge>
                  {stats.confirmed > 0 && (
                    <Badge className="bg-green-100 text-green-700 text-xs">
                      {stats.confirmed} reserva{stats.confirmed > 1 ? "s" : ""}{" "}
                      activa{stats.confirmed > 1 ? "s" : ""}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-5">
                  <Button
                    onClick={() => router.push("/perfil/estudiante/reservas")}
                    className="bg-gradient-to-r from-[#6C63FF] to-[#00E0C6] hover:opacity-90 shadow"
                  >
                    <BookmarkCheck className="h-4 w-4 mr-1" /> Mis reservas
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/perfil/estudiante/reseñas")}
                    className="border-[#6C63FF]/40 text-[#6C63FF] hover:bg-[#6C63FF]/10"
                  >
                    <Star className="h-4 w-4 mr-1" /> Mis reseñas
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      router.push("/perfil/estudiante/configuracion")
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
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <StatCard
            title="Reservas totales"
            value={stats.reservations}
            icon={<Calendar className="w-5 h-5 text-[#6C63FF]" />}
            color="from-[#E3F2FD] to-white"
          />
          <StatCard
            title="Confirmadas"
            value={stats.confirmed}
            icon={<BookmarkCheck className="w-5 h-5 text-[#00BFA6]" />}
            color="from-[#E0F7F4] to-white"
          />
          <StatCard
            title="Pendientes"
            value={stats.pending}
            icon={<Clock className="w-5 h-5 text-orange-500" />}
            color="from-orange-50 to-white"
          />
          <StatCard
            title="Puntuación"
            value={`${stats.rating.toFixed(1)} ⭐`}
            icon={<Star className="w-5 h-5 text-yellow-500" />}
            color="from-[#FFF9C4] to-white"
          />
        </motion.div>

        {/* TU ACTIVIDAD */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border border-blue-100 bg-white/90 shadow-lg backdrop-blur-lg rounded-3xl">
            <CardHeader>
              <CardTitle className="text-[#1A1A2E] text-2xl font-bold">
                🏠 Tus Habitaciones Reservadas
              </CardTitle>
              <CardDescription className="text-gray-600">
                Gestiona tus reservas y mantente en contacto con tus
                arrendadores
              </CardDescription>
            </CardHeader>

            <CardContent>
              <AnimatePresence mode="wait">
                {reservations.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    <div className="inline-block p-4 bg-blue-50 rounded-full mb-4">
                      <BookmarkCheck className="h-12 w-12 text-blue-400" />
                    </div>
                    <p className="text-gray-500 text-lg mb-2 font-semibold">
                      Aún no tienes reservas confirmadas
                    </p>
                    <p className="text-gray-400 text-sm mb-6">
                      Explora habitaciones disponibles y encuentra tu lugar
                      ideal
                    </p>
                    <Button
                      onClick={() => router.push("/buscar")}
                      className="bg-gradient-to-r from-[#6C63FF] to-[#00E0C6] hover:opacity-90 shadow-lg"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Buscar habitaciones
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
                  >
                    {reservations.map((res, index) => {
                      const daysRemaining = getDaysRemaining(res.end_date);
                      const isExpiringSoon = daysRemaining <= 7;

                      return (
                        <motion.div
                          key={res.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-blue-50 shadow-md hover:shadow-xl transition-all overflow-hidden group"
                        >
                          {/* Imagen habitación */}
                          <div className="relative h-48 w-full overflow-hidden">
                            <Image
                              src={
                                res.rooms?.room_photos?.[0]?.url ||
                                "/assets/placeholder.png"
                              }
                              alt={res.rooms?.title || "Habitación"}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                              <Badge className="bg-green-500 text-white text-xs font-semibold shadow-lg">
                                ✓ Confirmada
                              </Badge>
                              {isExpiringSoon && daysRemaining > 0 && (
                                <Badge className="bg-orange-500 text-white text-xs font-semibold shadow-lg">
                                  {daysRemaining} día
                                  {daysRemaining !== 1 ? "s" : ""}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="p-5 space-y-3">
                            {/* Detalles habitación */}
                            <h3 className="text-lg font-bold text-blue-900 line-clamp-2">
                              {res.rooms?.title}
                            </h3>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <MapPin size={14} className="text-blue-500" />{" "}
                              {res.rooms?.location}
                            </p>
                            <div className="flex items-baseline gap-1">
                              <p className="text-2xl font-bold text-blue-700">
                                S/ {res.rooms?.price?.toLocaleString()}
                              </p>
                              <span className="text-gray-500 text-sm">
                                / mes
                              </span>
                            </div>

                            {/* Fecha de reserva */}
                            <div className="bg-blue-50 rounded-lg p-3 text-xs space-y-1">
                              <p className="text-gray-600 flex items-center justify-between">
                                <span>
                                  <Calendar className="inline h-3 w-3 mr-1" />
                                  Inicio:
                                </span>
                                <span className="font-semibold text-gray-800">
                                  {new Date(res.start_date).toLocaleDateString(
                                    "es-PE",
                                    { day: "2-digit", month: "short" }
                                  )}
                                </span>
                              </p>
                              <p className="text-gray-600 flex items-center justify-between">
                                <span>Fin:</span>
                                <span className="font-semibold text-gray-800">
                                  {new Date(res.end_date).toLocaleDateString(
                                    "es-PE",
                                    { day: "2-digit", month: "short" }
                                  )}
                                </span>
                              </p>
                              {daysRemaining > 0 && (
                                <p
                                  className={`text-xs font-medium pt-1 border-t ${
                                    isExpiringSoon
                                      ? "text-orange-600"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {isExpiringSoon ? "⚠️ " : ""}
                                  {daysRemaining} día
                                  {daysRemaining !== 1 ? "s" : ""} restante
                                  {daysRemaining !== 1 ? "s" : ""}
                                </p>
                              )}
                            </div>

                            {/* Arrendador */}
                            <div className="border-t pt-3 mt-3">
                              <p className="text-sm text-gray-600 font-semibold mb-2 flex items-center gap-1">
                                <User size={14} /> Arrendador
                              </p>

                              <div className="text-sm text-gray-700 space-y-1.5">
                                <p className="font-medium text-gray-900">
                                  {res.users?.full_name || "No disponible"}
                                </p>
                                {res.users?.email && (
                                  <p className="text-xs text-gray-600 truncate">
                                    {res.users.email}
                                  </p>
                                )}
                                {res.users?.phone && (
                                  <p className="text-xs text-green-700 font-medium">
                                    📱 {res.users.phone}
                                  </p>
                                )}
                              </div>

                              {/* Botones de contacto */}
                              <div className="grid grid-cols-3 gap-2 mt-4">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    router.push(`/habitacion/${res.rooms?.id}`)
                                  }
                                  className="text-gray-700 border-gray-200 hover:bg-gray-50"
                                >
                                  <Eye size={14} />
                                </Button>
                                {res.users?.email && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() =>
                                      window.open(`mailto:${res.users?.email}`)
                                    }
                                    className="text-blue-700 border-blue-200 hover:bg-blue-50"
                                  >
                                    <Mail size={14} />
                                  </Button>
                                )}
                                {res.users?.phone && (
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      window.open(
                                        `https://wa.me/${res.users?.phone?.replace(
                                          /\D/g,
                                          ""
                                        )}`
                                      )
                                    }
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    <MessageCircle size={14} />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}

/* Subcomponente: Tarjeta de estadísticas */
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
      whileHover={{ scale: 1.03, y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`p-5 rounded-2xl border shadow-sm bg-gradient-to-br ${color} flex items-center gap-4 hover:shadow-lg cursor-pointer`}
    >
      <div className="p-3 bg-white rounded-xl shadow">{icon}</div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </motion.div>
  );
}
