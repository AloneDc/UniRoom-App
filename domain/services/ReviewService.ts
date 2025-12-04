import { supabase } from "@/infrastructure/supabase/supabaseClient";

export interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  rooms?: {
    id: string;
    title: string;
    location: string;
    price?: number;
    room_photos?: { url: string }[];
  };
}

/**
 * Servicio: Manejo de reseñas de usuario
 */
export const ReviewService = {
  async getReviewsByUser(userId: string): Promise<Review[]> {
    const { data, error } = await supabase
      .from("reviews")
      .select(
        `
        id,
        rating,
        comment,
        created_at,
        rooms:room_id (
          id,
          title,
          location,
          price,
          room_photos (url)
        )
      `
      )
      .eq("reviewer_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    // Normalizar para asegurar el tipo correcto
    return (data ?? []).map((r: any) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      created_at: r.created_at,
      rooms: r.rooms || null,
    })) as Review[];
  },
};
