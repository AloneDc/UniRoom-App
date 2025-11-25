import { supabase } from "@/infrastructure/supabase/supabaseClient";
import { StorageService } from "@/infrastructure/storage/StorageService";
import type { Room } from "@/shared/types";

export const RoomService = {
  /**
   * 🔹 Obtener habitaciones destacadas (para Home)
   */
  async getFeaturedRooms() {
    const { data, error } = await supabase
      .from("rooms")
      .select(
        `
        id,
        title,
        price,
        location,
        type,
        room_photos (url)
      `
      )
      .limit(6)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return (
      data?.map((room) => ({
        ...room,
        room_photos: room.room_photos?.map((p) => ({ url: p.url })) ?? [],
      })) ?? []
    );
  },

  /**
   * 🔹 Obtener habitaciones filtradas (para /buscar)
   */
  async getFilteredRooms({
    location,
    type,
    min,
    max,
  }: {
    location?: string;
    type?: string;
    min?: number;
    max?: number;
  }) {
    let query = supabase
      .from("rooms")
      .select(
        `
        id,
        title,
        description,
        price,
        location,
        type,
        available,
        landlord_id,
        rating,
        created_at,
        room_photos (url)
      `
      )
      .eq("available", true)
      .order("created_at", { ascending: false });

    if (location) query = query.ilike("location", `%${location}%`);
    if (type) query = query.eq("type", type);
    if (min) query = query.gte("price", min);
    if (max) query = query.lte("price", max);

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    return (
      data?.map((room) => ({
        ...room,
        room_photos: room.room_photos?.map((p) => ({ url: p.url })) ?? [],
      })) ?? []
    );
  },

  /**
   * 🔹 Crear nueva habitación (solo arrendadores)
   */
  async createRoom({
    title,
    description,
    price,
    location,
    address,
    type,
    landlord_id,
    images = [],
    services = [],
  }: {
    title: string;
    description: string;
    price: number;
    location: string;
    address?: string;
    type: "individual" | "compartida" | "departamento";
    landlord_id: string;
    images?: File[];
    services?: string[];
  }) {
    // Insertar habitación primero
    const { data: room, error } = await supabase
      .from("rooms")
      .insert([
        {
          title,
          description,
          price, // 💰 Guardado en soles
          location,
          address: address || "",
          type,
          landlord_id,
          services,
          available: true,
        },
      ])
      .select()
      .single();

    if (error) throw new Error(`Error al crear habitación: ${error.message}`);

    // Subir imágenes si existen
    if (images.length > 0) {
      for (const file of images) {
        try {
          const publicUrl = await StorageService.uploadRoomPhoto(file, room.id);
          await supabase
            .from("room_photos")
            .insert([{ room_id: room.id, url: publicUrl }]);
        } catch (err) {
          // ✅ Manejo correcto del error sin any
          console.error("Error subiendo imagen:", err);
          throw new Error(
            err instanceof Error
              ? `Error al subir imagen: ${err.message}`
              : "Error al subir una o más imágenes."
          );
        }
      }
    }

    return room;
  },

  /**
   * 🔹 Obtener habitaciones de un arrendador
   */
  async getRoomsByLandlord(landlordId: string): Promise<Room[]> {
    if (!landlordId) throw new Error("ID del arrendador requerido");
    const { data, error } = await supabase
      .from("rooms")
      .select(
        `
        id,
        title,
        price,
        location,
        available,
        created_at,
        room_photos (url)
      `
      )
      .eq("landlord_id", landlordId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  /**
   * 🔹 Obtener habitación por ID
   */
  async getRoomById(id: string) {
    const { data, error } = await supabase
      .from("rooms")
      .select(
        `
      id,
      title,
      description,
      price,
      location,
      address,
      type,
      services,
      rating,
      landlord_id,
      room_photos (url),
      users:landlord_id (full_name, photo_url)
    `
      )
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    if (!data) throw new Error("No se encontró la habitación");

    // 🧹 Normalizamos la estructura de salida
    return {
      ...data,
      room_photos: (data.room_photos || []).map((p: { url: string }) => ({
        url: p.url,
      })),
      // ✅ Si "users" viene como array, tomamos el primer elemento
      users: Array.isArray(data.users) ? data.users[0] : data.users,
    };
  },
  /**
   * 🔹 Actualizar habitación existente
   */
  async updateRoom(
    roomId: string,
    {
      title,
      description,
      price,
      location,
      address,
      type,
      services,
      images,
    }: {
      title: string;
      description: string;
      price: number;
      location: string;
      address?: string;
      type: "individual" | "compartida" | "departamento";
      services?: string[];
      images?: File[];
    }
  ) {
    const { error: updateError } = await supabase
      .from("rooms")
      .update({
        title,
        description,
        price,
        location,
        address,
        type,
        services,
      })
      .eq("id", roomId);

    if (updateError) throw new Error(updateError.message);

    if (images && images.length > 0) {
      for (const file of images) {
        const publicUrl = await StorageService.uploadRoomPhoto(file, roomId);
        await supabase
          .from("room_photos")
          .insert([{ room_id: roomId, url: publicUrl }]);
      }
    }

    return true;
  },

  /**
   * 🔹 Eliminar habitación
   */
  async deleteRoom(roomId: string) {
    try {
      await supabase.from("room_photos").delete().eq("room_id", roomId);
      const { error } = await supabase.from("rooms").delete().eq("id", roomId);
      if (error) throw error;
    } catch (err) {
      console.error("Error al eliminar habitación:", err);
      throw new Error("No se pudo eliminar la habitación.");
    }
  },
};
