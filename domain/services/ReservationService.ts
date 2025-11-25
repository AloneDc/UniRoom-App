import { z, ZodError } from "zod";
import { supabase } from "@/infrastructure/supabase/supabaseClient";

/* -----------------------------------------------------
   ✅ Tipos y esquema de validación
----------------------------------------------------- */
const reservationSchema = z.object({
  roomId: z.string().uuid(),
  startDate: z.string().min(1, "Fecha de inicio requerida"),
  endDate: z.string().min(1, "Fecha de fin requerida"),
  userId: z.string().uuid(),
  rentalType: z.enum(["daily", "monthly"]),
  monthsCount: z.number().min(1).max(12).optional(),
});

export type ReservationInput = z.infer<typeof reservationSchema>;
export type ReservationStatus = "pending" | "confirmed" | "cancelled";

export interface Reservation {
  id: string;
  room_id: string;
  student_id: string;
  landlord_id: string;
  start_date: string;
  end_date: string;
  status: ReservationStatus;
  rental_type: "daily" | "monthly";
  months_count?: number;
  created_at: string;

  rooms?: {
    id: string;
    title: string;
    price: number;
    location: string;
    room_photos: { url: string }[];
  };

  users?: {
    id: string;
    full_name: string;
    email: string;
    phone?: string;
    photo_url?: string;
  };
}

// ✅ Tipo para los datos crudos de Supabase
interface SupabaseReservationData {
  id: string;
  room_id: string;
  student_id: string;
  landlord_id: string;
  start_date: string;
  end_date: string;
  status: ReservationStatus;
  rental_type: "daily" | "monthly";
  months_count?: number;
  created_at: string;
  rooms?:
    | {
        id: string;
        title: string;
        price: number;
        location: string;
        room_photos: { url: string }[];
      }
    | {
        id: string;
        title: string;
        price: number;
        location: string;
        room_photos: { url: string }[];
      }[];
  users?:
    | {
        id: string;
        full_name: string;
        email: string;
        phone?: string;
        photo_url?: string;
      }
    | {
        id: string;
        full_name: string;
        email: string;
        phone?: string;
        photo_url?: string;
      }[];
}

/* -----------------------------------------------------
   🧠 ReservationService — control completo de reservas
----------------------------------------------------- */
export const ReservationService = {
  /**
   * 🔹 Crear una nueva reserva (pendiente por defecto)
   */
  async createReservation(input: ReservationInput): Promise<Reservation> {
    const parsed = reservationSchema.safeParse(input);
    if (!parsed.success) {
      const err = parsed.error as ZodError;
      throw new Error(err.issues?.[0]?.message ?? "Datos inválidos");
    }

    const { roomId, startDate, endDate, userId, rentalType, monthsCount } =
      parsed.data;

    try {
      // 1️⃣ Obtener landlord_id de la habitación
      const { data: roomData, error: roomError } = await supabase
        .from("rooms")
        .select("landlord_id")
        .eq("id", roomId)
        .single();

      if (roomError || !roomData)
        throw new Error("No se encontró la habitación especificada");

      // 2️⃣ Crear reserva
      const { data, error } = await supabase
        .from("reservations")
        .insert([
          {
            room_id: roomId,
            student_id: userId,
            landlord_id: roomData.landlord_id,
            start_date: startDate,
            end_date: endDate,
            rental_type: rentalType,
            months_count: monthsCount ?? null,
            status: "pending",
          },
        ])
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data as Reservation;
    } catch (err) {
      if (err instanceof Error) throw new Error(err.message);
      throw new Error("Error desconocido al crear la reserva");
    }
  },

  async getReservationsByUser(userId: string): Promise<Reservation[]> {
    const { data, error } = await supabase
      .from("reservations")
      .select(
        `
      id,
      room_id,
      student_id,
      landlord_id,
      start_date,
      end_date,
      status,
      rental_type,
      months_count,
      created_at,
      rooms (
        id,
        title,
        price,
        location,
        room_photos (url)
      ),
      users:landlord_id (
        id,
        full_name,
        email,
        phone,
        photo_url
      )
    `
      )
      .eq("student_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    if (!data) return [];

    // 🧠 Normalizamos estructura - ✅ Tipo específico
    const formatted = data.map((r: SupabaseReservationData) => ({
      id: r.id,
      room_id: r.room_id,
      student_id: r.student_id,
      landlord_id: r.landlord_id,
      start_date: r.start_date,
      end_date: r.end_date,
      status: r.status,
      rental_type: r.rental_type,
      months_count: r.months_count,
      created_at: r.created_at,
      rooms: Array.isArray(r.rooms) ? r.rooms[0] : r.rooms,
      users: Array.isArray(r.users) ? r.users[0] : r.users, // 🔹 Importante
    })) as Reservation[];

    return formatted;
  },
  /**
   * 🔹 Obtener reservas por arrendador (todas sus habitaciones)
   */
  async getReservationsByLandlord(landlordId: string): Promise<Reservation[]> {
    const { data, error } = await supabase
      .from("reservations")
      .select(
        `
        id,
        room_id,
        student_id,
        landlord_id,
        start_date,
        end_date,
        status,
        rental_type,
        months_count,
        created_at,
        rooms (
          id,
          title,
          price,
          location,
          room_photos (url)
        ),
        users:student_id (
          id,
          full_name,
          email,
          phone,
          photo_url
        )
      `
      )
      .eq("landlord_id", landlordId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    if (!data) return [];

    // 🧠 Normalizamos estructura Supabase → TS - ✅ Tipo específico
    const formatted = data.map((r: SupabaseReservationData) => ({
      id: r.id,
      room_id: r.room_id,
      student_id: r.student_id,
      landlord_id: r.landlord_id,
      start_date: r.start_date,
      end_date: r.end_date,
      status: r.status,
      rental_type: r.rental_type,
      months_count: r.months_count,
      created_at: r.created_at,
      rooms: Array.isArray(r.rooms) ? r.rooms[0] : r.rooms,
      users: Array.isArray(r.users) ? r.users[0] : r.users,
    })) as Reservation[];

    return formatted;
  },

  /**
   * 🔹 Actualizar estado (confirmar o rechazar)
   * Además actualiza la disponibilidad de la habitación.
   */
  async updateReservationStatus(
    reservationId: string,
    status: ReservationStatus
  ): Promise<void> {
    // 1️⃣ Obtener datos de la reserva actual
    const { data: reservation, error: fetchError } = await supabase
      .from("reservations")
      .select("room_id")
      .eq("id", reservationId)
      .single();

    if (fetchError || !reservation)
      throw new Error("No se encontró la reserva.");

    // 2️⃣ Actualizar estado de la reserva
    const { error: updateError } = await supabase
      .from("reservations")
      .update({ status })
      .eq("id", reservationId);

    if (updateError) throw new Error(updateError.message);

    // 3️⃣ Actualizar disponibilidad de la habitación
    if (status === "confirmed") {
      // Si se confirma, marcar habitación como no disponible
      await supabase
        .from("rooms")
        .update({ available: false })
        .eq("id", reservation.room_id);
    } else if (status === "cancelled") {
      // Si se cancela, vuelve a estar disponible
      await supabase
        .from("rooms")
        .update({ available: true })
        .eq("id", reservation.room_id);
    }
  },

  /**
   * 🔹 Cancelar reserva (solo estudiante)
   */
  async cancelReservation(
    reservationId: string,
    userId: string
  ): Promise<void> {
    const { error } = await supabase
      .from("reservations")
      .update({ status: "cancelled" })
      .eq("id", reservationId)
      .eq("student_id", userId);

    if (error) throw new Error(error.message);
  },

  /**
   * 🔹 Alias semántico: obtener reservas de un estudiante
   * (usa internamente getReservationsByUser)
   */
  async getReservationsByStudent(userId: string): Promise<Reservation[]> {
    return this.getReservationsByUser(userId);
  },
};
