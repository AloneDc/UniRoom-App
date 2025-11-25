"use client";

import RoomForm from "@/presentation/components/RoomForm";
import { useRoleGuard } from "@/presentation/hooks/useRoleGuard";

export default function PublishPage() {
  // Solo los arrendadores pueden publicar
  const { user, loading } = useRoleGuard("landlord");

  if (loading)
    return <p className="text-center py-10">Verificando permisos...</p>;
  if (!user) return null;

  return (
    <section className="min-h-screen bg-gray-50 py-10">
      <RoomForm />
    </section>
  );
}
