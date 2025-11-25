import { RoomService } from "@/domain/services/RoomService";
import SearchFilters from "@/presentation/components/SearchFilters";
import RoomsList from "@/presentation/components/RoomsList";

/**
 * Página de búsqueda de habitaciones
 * Compatible con Next.js 15 (searchParams es Promise)
 */
export const revalidate = 60;

interface SearchParams {
  location?: string;
  type?: string;
  min?: string;
  max?: string;
}

export default async function BuscarPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  // ✅ Nuevo en Next.js 15 — desestructuramos la promesa
  const params = await searchParams;

  // ✅ Normalizamos filtros
  const filters = {
    location: params.location?.trim() ?? "",
    type: params.type ?? "",
    min: params.min ? Number(params.min) : 0,
    max: params.max ? Number(params.max) : 9999,
  };

  // ✅ Consultamos las habitaciones desde el servicio del dominio
  const rooms = await RoomService.getFilteredRooms(filters);

  return (
    <section className="max-w-6xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8 text-blue-700">
        Buscar alojamiento 🏡
      </h1>

      {/* Filtros de búsqueda */}
      <SearchFilters />

      {/* Resultados */}
      <RoomsList rooms={rooms} />
    </section>
  );
}
