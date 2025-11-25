// domain/repositories/ReservationRepository.ts

import {
  Reservation,
  ReservationInput,
  ReservationStatus,
} from "@/domain/services/ReservationService";

/**
 * 🧩 Contrato base para repositorios de Reservas
 *
 * Cualquier implementación (Supabase, Mock, REST API) debe cumplir
 * esta interfaz para integrarse con ReservationService.
 */
export interface ReservationRepository {
  /** 🔹 Devuelve el landlord_id de una habitación específica */
  getLandlordIdByRoom(roomId: string): Promise<string>;

  /** 🔹 Crea una nueva reserva */
  create(
    input: ReservationInput & { landlordId: string }
  ): Promise<Reservation>;

  /** 🔹 Obtiene todas las reservas realizadas por un estudiante */
  getByUser(userId: string): Promise<Reservation[]>;

  /** 🔹 Obtiene todas las reservas que pertenecen a un arrendador */
  getByLandlord(landlordId: string): Promise<Reservation[]>;

  /** 🔹 Cancela una reserva (solo si pertenece al estudiante) */
  cancel(reservationId: string, userId: string): Promise<void>;

  /** 🔹 Actualiza el estado de una reserva (confirmar o rechazar) */
  updateStatus(reservationId: string, status: ReservationStatus): Promise<void>;
}
