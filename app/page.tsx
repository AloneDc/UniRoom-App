import Hero from "@/presentation/components/Hero";
import FeaturedRooms from "@/presentation/components/FeaturedRooms";
import SearchFilters from "@/presentation/components/SearchFilters";
import Link from "next/link";
import { RoomService } from "@/domain/services/RoomService";
import {
  Shield,
  Calendar,
  MapPin,
  TrendingUp,
  Users,
  CheckCircle2,
  Star,
  Home,
  Sparkles,
} from "lucide-react";

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

      {/* ESTADÍSTICAS RÁPIDAS */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                icon: <Home className="w-6 h-6" />,
                value: "500+",
                label: "Habitaciones",
              },
              {
                icon: <Users className="w-6 h-6" />,
                value: "1,200+",
                label: "Estudiantes",
              },
              {
                icon: <Star className="w-6 h-6" />,
                value: "4.8/5",
                label: "Calificación",
              },
              {
                icon: <CheckCircle2 className="w-6 h-6" />,
                value: "98%",
                label: "Satisfacción",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="text-center p-6 bg-gradient-to-br from-[#6C63FF]/5 to-[#00E0C6]/5 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex justify-center mb-3 text-[#6C63FF]">
                  {stat.icon}
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HABITACIONES DESTACADAS */}
      <section className="relative py-20 px-6 overflow-hidden bg-gradient-to-br from-[#F8FAFF] via-[#EEF2FF] to-[#F3F4FF]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(108,99,255,0.08),_transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(0,224,198,0.08),_transparent_70%)]" />

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#6C63FF]/10 text-[#6C63FF] px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Lo más popular
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1A1A2E] mb-4">
              Habitaciones destacadas en Piura
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Explora espacios únicos, cómodos y verificados para estudiantes en
              la ciudad de Piura
            </p>
          </div>

          <FeaturedRooms rooms={featuredRooms} />

          <div className="text-center mt-12">
            <Link
              href="/buscar"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#6C63FF] to-[#00E0C6] text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:opacity-90 transition"
            >
              Ver todas las habitaciones
              <TrendingUp className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* POR QUÉ ELEGIR UNIRROOM */}
      <section className="relative py-24 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(108,99,255,0.05),_transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,_rgba(0,224,198,0.05),_transparent_70%)]" />

        <div className="relative max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#1A1A2E] mb-4">
              ¿Por qué elegir UniRoom?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Creamos una experiencia moderna y segura para estudiantes que
              buscan su próximo hogar
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Alojamientos verificados",
                text: "Cada publicación pasa por un proceso de validación para asegurar la autenticidad del arrendador.",
                color: "from-blue-500/10 to-blue-600/10",
                iconColor: "text-blue-600",
              },
              {
                icon: <Calendar className="w-8 h-8" />,
                title: "Flexibilidad para estudiantes",
                text: "Elige el tiempo que necesitas: por ciclo, mes o semestre completo.",
                color: "from-purple-500/10 to-purple-600/10",
                iconColor: "text-purple-600",
              },
              {
                icon: <MapPin className="w-8 h-8" />,
                title: "Ubicaciones estratégicas",
                text: "Encuentra habitaciones cerca de universidades, transporte y zonas seguras de Piura.",
                color: "from-teal-500/10 to-teal-600/10",
                iconColor: "text-teal-600",
              },
            ].map((benefit, i) => (
              <div
                key={i}
                className="group relative bg-white border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${benefit.color} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <div className="relative">
                  <div
                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${benefit.color} mb-4 ${benefit.iconColor} group-hover:scale-110 transition-transform duration-300`}
                  >
                    {benefit.icon}
                  </div>

                  <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-[#6C63FF] transition-colors">
                    {benefit.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {benefit.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ALOJAMIENTO CERCA DE TU UNIVERSIDAD */}
      <section className="relative py-20 bg-gradient-to-br from-[#EEF2FF] via-[#F8FAFF] to-[#E0F7F4] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(108,99,255,0.07),_transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(0,224,198,0.07),_transparent_70%)]" />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-[#1A1A2E] mb-4">
              Alojamiento cerca de tu universidad
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Encuentra tu hogar ideal cerca de los principales centros
              académicos de Piura
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {[
              {
                name: "Universidad de Piura",
                icon: "🎓",
                color: "bg-blue-500",
              },
              {
                name: "Universidad César Vallejo",
                icon: "📚",
                color: "bg-purple-500",
              },
              {
                name: "Universidad Privada Antenor Orrego",
                icon: "🏛️",
                color: "bg-teal-500",
              },
              {
                name: "Universidad Tecnologíca del Perú",
                icon: "💻",
                color: "bg-orange-500",
              },
            ].map((place, i) => (
              <Link
                key={i}
                href={`/buscar?location=Piura&universidad=${encodeURIComponent(
                  place.name
                )}`}
                className="group flex items-center gap-4 p-5 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-2xl hover:border-[#6C63FF] hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`flex items-center justify-center w-12 h-12 ${place.color} text-white rounded-xl text-xl group-hover:scale-110 transition-transform`}
                >
                  {place.icon}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 group-hover:text-[#6C63FF] transition-colors">
                    {place.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    Ver habitaciones disponibles →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-[#1A1A2E] mb-4">
              Lo que dicen nuestros usuarios
            </h2>
            <p className="text-gray-600 text-lg">
              Experiencias reales de estudiantes que encontraron su hogar en
              UniRoom
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "María González",
                role: "Estudiante de Ingeniería - UDEP",
                text: "Encontré mi habitación ideal en menos de una semana. El proceso fue súper fácil y seguro.",
                rating: 5,
                avatar: "MG",
              },
              {
                name: "Carlos Ramírez",
                role: "Estudiante de Medicina - UCV",
                text: "Excelente plataforma. Los arrendadores responden rápido y las habitaciones son tal como se muestran.",
                rating: 5,
                avatar: "CR",
              },
              {
                name: "Ana Flores",
                role: "Estudiante de Derecho - UNP",
                text: "Me encanta la flexibilidad de rentar por meses. Perfecto para estudiantes foráneos como yo.",
                rating: 5,
                avatar: "AF",
              },
            ].map((testimonial, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-[#6C63FF]/5 to-[#00E0C6]/5 border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">{testimonial.text}</p>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#00E0C6] flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="relative py-24 overflow-hidden bg-gradient-to-r from-[#6C63FF] to-[#00E0C6] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.1),_transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,_rgba(255,255,255,0.1),_transparent_70%)]" />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg">
            ¿Tienes una habitación disponible?
          </h2>
          <p className="mb-10 text-white/90 text-lg max-w-2xl mx-auto">
            Publica tu alojamiento en UniRoom y conecta con estudiantes que
            buscan un lugar seguro y cómodo en Piura
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 bg-white text-[#6C63FF] font-semibold px-8 py-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <Home className="w-5 h-5" />
              Publicar alojamiento
            </Link>

            <Link
              href="/buscar"
              className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white border-2 border-white/50 font-semibold px-8 py-4 rounded-full hover:bg-white/20 transition-all duration-300"
            >
              Buscar habitación
              <MapPin className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
