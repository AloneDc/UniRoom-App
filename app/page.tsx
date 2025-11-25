import Hero from "@/presentation/components/Hero";
import FeaturedRooms from "@/presentation/components/FeaturedRooms";
import SearchFilters from "@/presentation/components/SearchFilters";
import Link from "next/link";
import { RoomService } from "@/domain/services/RoomService";

export const revalidate = 60;

export default async function HomePage() {
  const featuredRooms = await RoomService.getFeaturedRooms();

  return (
    <>
      {/* HERO */}
      <Hero />

      {/* Buscador principal */}
      <div className="relative -mt-10 z-20">
        <SearchFilters />
      </div>

      {/* HABITACIONES DESTACADAS */}
      <section className="relative py-20 px-6 overflow-hidden bg-gradient-to-br from-[#F8FAFF] via-[#EEF2FF] to-[#F3F4FF]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(108,99,255,0.08),_transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(0,224,198,0.08),_transparent_70%)]" />
        <div className="relative max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1A1A2E] mb-4">
            Habitaciones destacadas en Piura 🏠
          </h2>
          <p className="text-gray-600 mb-12 text-lg max-w-2xl mx-auto">
            Explora espacios únicos, cómodos y verificados para estudiantes en
            la ciudad de Piura.
          </p>
          <FeaturedRooms rooms={featuredRooms} />
        </div>
      </section>

      {/* POR QUÉ ELEGIR UNIRROOM */}
      <section className="relative py-24 text-center bg-gradient-to-b from-[#6C63FF]/10 via-white to-[#00E0C6]/10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(108,99,255,0.1),_transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,_rgba(0,224,198,0.1),_transparent_70%)]" />
        <div className="relative max-w-6xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#1A1A2E] mb-6">
            ¿Por qué elegir UniRoom?
          </h2>
          <p className="text-gray-600 text-lg mb-16 max-w-2xl mx-auto">
            Creamos una experiencia moderna y segura para estudiantes que buscan
            su próximo hogar en Piura.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Alojamientos verificados 🔒",
                text: "Cada publicación pasa por un proceso de validación para asegurar la autenticidad del arrendador.",
              },
              {
                title: "Flexibilidad para estudiantes 📅",
                text: "Elige el tiempo que necesitas: por ciclo, mes o semestre completo.",
              },
              {
                title: "Ubicaciones estratégicas 🎓",
                text: "Encuentra habitaciones cerca de universidades, transporte y zonas seguras de Piura.",
              },
            ].map((benefit) => (
              <div
                key={benefit.title}
                className="bg-white/80 backdrop-blur-xl border border-white rounded-3xl p-8 shadow-[0_8px_32px_rgba(31,38,135,0.1)] 
                           hover:shadow-[0_10px_40px_rgba(108,99,255,0.15)] transition-all duration-300 hover:-translate-y-1"
              >
                <h3 className="font-semibold text-[#6C63FF] text-xl mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ALOJAMIENTO CERCA DE TU UNIVERSIDAD */}
      <section className="relative py-20 bg-gradient-to-r from-[#EEF2FF] via-[#F8FAFF] to-[#E0F7F4] text-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(108,99,255,0.07),_transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(0,224,198,0.07),_transparent_70%)]" />
        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold text-[#1A1A2E] mb-6">
            Alojamiento cerca de tu universidad
          </h2>
          <p className="text-gray-600 mb-10 text-lg max-w-2xl mx-auto">
            Encuentra alojamiento cerca de los principales centros académicos de
            Piura.
          </p>

          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {[
              "Universidad de Piura",
              "Universidad César Vallejo",
              "Universidad Nacional de Piura",
              "Instituto IDAT Piura",
            ].map((place) => (
              <Link
                key={place}
                href={`/buscar?location=Piura&universidad=${encodeURIComponent(
                  place
                )}`}
                className="px-6 py-3 bg-white/90 border border-gray-200 rounded-full hover:border-[#6C63FF] hover:text-[#6C63FF] transition font-medium shadow-sm hover:shadow-md"
              >
                {place}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 text-center bg-gradient-to-r from-[#6C63FF] to-[#00E0C6] text-white">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-md">
          ¿Tienes una habitación disponible en Piura?
        </h2>
        <p className="mb-10 text-white/90 max-w-2xl mx-auto text-lg">
          Publica tu alojamiento en UniRoom y conecta con estudiantes que buscan
          un lugar seguro y cómodo.
        </p>
        <Link
          href="/publicar"
          className="inline-block bg-white text-[#6C63FF] font-semibold px-6 py-3 rounded-full shadow-lg hover:bg-gray-100 transition"
        >
          Publicar alojamiento
        </Link>
      </section>
    </>
  );
}
