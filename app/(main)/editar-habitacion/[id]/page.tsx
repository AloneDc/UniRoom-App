"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRoleGuard } from "@/presentation/hooks/useRoleGuard";
import { supabase } from "@/infrastructure/supabase/supabaseClient";
import EditRoomForm from "./EditRoomForm";

// ✅ Define el tipo para la habitación
interface Room {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  type: "individual" | "compartida" | "departamento"; // ✅ Tipo específico
  services: string[];
  address: string;
  landlord_id: string;
  images?: string[];
}

export default function EditRoomPage() {
  const { id } = useParams();
  const { user, loading } = useRoleGuard("landlord");
  const [room, setRoom] = useState<Room | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const loadRoom = async () => {
      if (!id || !user) return;
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error(error.message);
        setFetching(false);
        return;
      }

      // Seguridad: solo el dueño puede editar
      if (data.landlord_id !== user.id) {
        alert("No tienes permiso para editar esta habitación.");
        return;
      }

      setRoom(data as Room); // ✅ Cast al tipo Room
      setFetching(false);
    };

    loadRoom();
  }, [id, user]);

  if (loading || fetching)
    return <p className="text-center py-10">Cargando habitación...</p>;

  if (!room)
    return (
      <p className="text-center py-10 text-red-600">
        Habitación no encontrada o no tienes acceso.
      </p>
    );

  return (
    <div className="py-10 px-6 bg-gray-50 min-h-screen">
      <EditRoomForm
        roomId={room.id}
        initialData={{
          title: room.title,
          description: room.description,
          price: room.price,
          location: room.location,
          type: room.type,
          services: room.services ?? [],
          address: room.address ?? "",
          images: [],
        }}
      />
    </div>
  );
}
