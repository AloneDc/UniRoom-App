import { supabase } from "@/infrastructure/supabase/supabaseClient";

export const StorageService = {
  /**
   * 🔹 Subir imagen al bucket `room_photos`
   * Retorna la URL pública para guardarla en la base de datos
   */
  async uploadRoomPhoto(file: File, roomId: string): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${roomId}-${Date.now()}.${fileExt}`;
    const filePath = `room_photos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("room_photos")
      .upload(filePath, file);

    if (uploadError) throw new Error(uploadError.message);

    const { data } = supabase.storage
      .from("room_photos")
      .getPublicUrl(filePath);
    return data.publicUrl;
  },

  /**
   * 🔹 Eliminar imagen del bucket a partir de su URL pública
   * (usado al eliminar o actualizar habitaciones)
   */
  async deleteFile(publicUrl: string): Promise<void> {
    try {
      // Extraer la ruta interna del archivo desde la URL pública
      const path = publicUrl.split("/storage/v1/object/public/room_photos/")[1];

      if (!path) throw new Error("No se pudo obtener la ruta del archivo");

      const { error } = await supabase.storage
        .from("room_photos")
        .remove([path]);

      if (error) throw new Error(error.message);
      console.log(`🗑️ Archivo eliminado: ${path}`);
    } catch (err) {
      console.error("❌ Error eliminando archivo del storage:", err);
    }
  },
};
