// infrastructure/repositories/SupabaseReservationRepository.ts

import { supabase } from "@/infrastructure/supabase/supabaseClient";
import {
  Reservation,
  ReservationInput,
  ReservationStatus,
} from "@/domain/services/ReservationService";
import { ReservationRepository } from "@/domain/repositories/ReservationRepository";

/**
 * ⚙️ Implementación del repositorio de reservas usando Supabase
 * Cumple con la interfaz ReservationRepository
 */
export class SupabaseReservationRepository implements ReservationRepository {
  /** 🔹 Obtener landlord_id desde la tabla rooms */
  async getLandlordIdByRoom(roomId: string): Promise<string> {
    const { data, error } = await supabase
      .from("rooms")
      .select("landlord_id")
      .eq("id", roomId)
      .single();

    if (error || !data?.landlord_id)
      throw new Error("No se encontró la habitación o landlord_id inválido");

    return data.landlord_id;
  }

  /** 🔹 Crear una nueva reserva */
  async create(
    input: ReservationInput & { landlordId: string }
  ): Promise<Reservation> {
    const {
      roomId,
      startDate,
      endDate,
      userId,
      rentalType,
      monthsCount,
      landlordId,
    } = input;

    const { data, error } = await supabase
      .from("reservations")
      .insert([
        {
          room_id: roomId,
          student_id: userId,
          landlord_id: landlordId,
          start_date: startDate,
          end_date: endDate,
          status: "pending" as ReservationStatus,
          rental_type: rentalType,
          months_count: monthsCount ?? null,
        },
      ])
      .select(
        `
        id,
        room_id,
        student_id,
        start_date,
        end_date,
        status,
        rental_type,
        months_count,
        created_at
      `
      )
      .single();

    if (error || !data)
      throw new Error(error?.message ?? "Error al crear la reserva");

    return data as Reservation;
  }

  /** 🔹 Obtener reservas de un estudiante */
  async getByUser(userId: string): Promise<Reservation[]> {
    const { data, error } = await supabase
      .from("reservations")
      .select(
        `
        id,
        room_id,
        student_id,
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
        )
      `
      )
      .eq("student_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    if (!data) return [];

    // 🔄 Normalizar rooms para evitar arrays
    return data.map((r) => ({
      ...r,
      rooms: Array.isArray(r.rooms) ? r.rooms[0] : r.rooms,
    })) as Reservation[];
  }

  /** 🔹 Obtener reservas de un arrendador */
  async getByLandlord(landlordId: string): Promise<Reservation[]> {
    const { data, error } = await supabase
      .from("reservations")
      .select(
        `
        id,
        room_id,
        student_id,
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
          photo_url
        )
      `
      )
      .eq("landlord_id", landlordId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    if (!data) return [];

    return data.map((r) => ({
      ...r,
      rooms: Array.isArray(r.rooms) ? r.rooms[0] : r.rooms,
      users: Array.isArray(r.users) ? r.users[0] : r.users,
    })) as Reservation[];
  }

  /** 🔹 Cancelar una reserva (solo si pertenece al estudiante) */
  async cancel(reservationId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from("reservations")
      .update({ status: "cancelled" as ReservationStatus })
      .eq("id", reservationId)
      .eq("student_id", userId);

    if (error) throw new Error(error.message);
  }

  /** 🔹 Actualizar estado de la reserva */
  async updateStatus(
    reservationId: string,
    status: ReservationStatus
  ): Promise<void> {
    const { error } = await supabase
      .from("reservations")
      .update({ status })
      .eq("id", reservationId);

    if (error) throw new Error(error.message);
  }
}
