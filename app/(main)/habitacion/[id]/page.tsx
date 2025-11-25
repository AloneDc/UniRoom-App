import { RoomService } from "@/domain/services/RoomService";
import RoomDetail from "@/presentation/components/RoomDetail";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    console.error("[RoomPage] ❌ ID no definido en la ruta.");
    notFound();
  }

  let room = null;
  let hasError = false;

  try {
    room = await RoomService.getRoomById(id);
  } catch (error) {
    console.error("[RoomPage] 🧨 Error al cargar habitación:", error);
    hasError = true;
  }

  if (hasError || !room) {
    console.warn(`[RoomPage] ⚠️ No se encontró la habitación con ID: ${id}`);
    notFound();
  }

  // ✅ Render fuera del try/catch
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#E3F2FD] via-[#E0F7F4] to-[#F9FAFF] py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <RoomDetail room={room} />
      </div>
    </main>
  );
}
