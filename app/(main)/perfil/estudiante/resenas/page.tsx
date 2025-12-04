"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRoleGuard } from "@/presentation/hooks/useRoleGuard";
import { ReviewService, type Review } from "@/domain/services/ReviewService";
import { toast } from "sonner";
import { Star, Loader2, MapPin } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function StudentReviewsPage() {
  const { user, loading } = useRoleGuard("student");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const loadData = useCallback(async () => {
    if (!user) return;
    try {
      setLoadingData(true);
      const data = await ReviewService.getReviewsByUser(user.id);
      setReviews(data);
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar tus reseñas.");
    } finally {
      setLoadingData(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    void loadData();
  }, [user, loadData]);

  if (loading || loadingData) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-gradient-to-br from-[#E3F2FD] via-[#E0F7F4] to-[#F9FAFF]">
        <Loader2 className="animate-spin h-10 w-10 text-[#6C63FF]" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#E3F2FD] via-[#E0F7F4] to-[#F9FAFF] py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Encabezado */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border border-yellow-100 bg-white/90 shadow-lg backdrop-blur-lg rounded-3xl">
            <CardHeader>
              <CardTitle className="text-[#1A1A2E] text-3xl font-bold flex items-center gap-2">
                ⭐ Mis Reseñas
              </CardTitle>
              <CardDescription className="text-gray-600">
                Tus comentarios sobre habitaciones que has reservado
              </CardDescription>
            </CardHeader>

            <CardContent>
              <AnimatePresence mode="wait">
                {reviews.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    <div className="inline-block p-4 bg-yellow-50 rounded-full mb-4">
                      <Star className="h-12 w-12 text-yellow-400" />
                    </div>
                    <p className="text-gray-500 text-lg font-semibold">
                      Aún no has dejado reseñas
                    </p>
                    <p className="text-gray-400 text-sm mb-6">
                      Cuando califiques una habitación, tus reseñas aparecerán
                      aquí.
                    </p>
                    <Link href="/perfil/estudiante">
                      <Button className="bg-gradient-to-r from-[#6C63FF] to-[#00E0C6] hover:opacity-90 shadow-lg">
                        Volver al perfil
                      </Button>
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
                  >
                    {reviews.map((review, index) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="rounded-2xl border border-gray-100 bg-gradient-to-br from-white to-yellow-50 shadow-md hover:shadow-xl transition-all overflow-hidden"
                      >
                        {/* Imagen */}
                        <div className="relative h-44 w-full overflow-hidden">
                          <Image
                            src={
                              review.rooms?.room_photos?.[0]?.url ||
                              "/assets/placeholder.png"
                            }
                            alt={review.rooms?.title || "Habitación"}
                            fill
                            className="object-cover"
                          />
                        </div>

                        <div className="p-5 space-y-2">
                          <h3 className="text-lg font-bold text-gray-800 line-clamp-2">
                            {review.rooms?.title}
                          </h3>
                          <p className="text-xs text-gray-600 flex items-center gap-1">
                            <MapPin size={12} className="text-yellow-500" />
                            {review.rooms?.location}
                          </p>

                          {/* Estrellas */}
                          <div className="flex items-center gap-1 mt-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={`${
                                  i < review.rating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                                fill={
                                  i < review.rating ? "currentColor" : "none"
                                }
                              />
                            ))}
                          </div>

                          <p className="text-gray-700 text-sm mt-3 line-clamp-3">
                            {review.comment || "Sin comentarios"}
                          </p>

                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(review.created_at).toLocaleDateString(
                              "es-PE",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </motion.div>
                    ))}
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
