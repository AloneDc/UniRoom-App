// /shared/types.ts
export type ReservationStatus = "pending" | "confirmed" | "cancelled";

export interface Reservation {
  id: string;
  room_id: string;
  student_id: string;
  start_date: string;
  end_date: string;
  status: ReservationStatus;
  created_at: string;
  rooms?: {
    id: string;
    title: string;
    price: number;
    location: string;
    room_photos: { url: string }[];
  };
}
// ================================
// 🧩 UserProfile (Perfil de usuario global)
// ================================
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: "student" | "landlord" | "admin";
  photo_url?: string;
  phone?: string;
  verified?: boolean;
  created_at?: string;
}
export interface Room {
  id: string;
  title: string;
  price: number;
  location: string;
  available: boolean;
  created_at: string;
  landlord_id?: string;
  rating?: number;
  room_photos?: { url: string }[];
}
