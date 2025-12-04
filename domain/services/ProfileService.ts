import { supabase } from "@/infrastructure/supabase/supabaseClient";
import type { ProfileInput } from "@/shared/validations/profileSchema";

export const ProfileService = {
  /**
   * 🔹 Actualizar perfil de usuario en Supabase
   */
  async updateProfile(userId: string, data: ProfileInput) {
    const { error } = await supabase
      .from("users")
      .update(data)
      .eq("id", userId);
    if (error) throw new Error(error.message);
  },

  /**
   * 🔹 Subir foto de perfil a Supabase Storage
   */
  async uploadProfilePhoto(file: File, userId: string): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const fileName = `profiles/${userId}-${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: true, // permite reemplazar si el usuario sube otra foto
        contentType: file.type,
      });

    if (error) throw new Error(error.message);

    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;
  },
};
