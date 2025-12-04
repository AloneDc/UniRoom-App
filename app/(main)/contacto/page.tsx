import ContactForm from "@/presentation/components/ContactForm";
import {
  Mail,
  MessageCircle,
  Phone,
  MapPin,
  Clock,
  Send,
  HelpCircle,
  FileText,
  AlertCircle,
} from "lucide-react";

export const metadata = {
  title: "Contacto | UniRoom",
  description: "Envía tus consultas o reportes al equipo de UniRoom.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F8FAFF] via-[#EEF2FF] to-[#E0F7F4]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(108,99,255,0.1),_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(0,224,198,0.1),_transparent_50%)]" />

        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#6C63FF]/10 text-[#6C63FF] px-4 py-2 rounded-full text-sm font-medium mb-6">
            <MessageCircle className="w-4 h-4" />
            Estamos aquí para ayudarte
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-[#1A1A2E] mb-6">
            ¿Necesitas ayuda?
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Completa el formulario y nuestro equipo te responderá en menos de 24
            horas
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              {
                icon: <MessageCircle className="w-5 h-5" />,
                value: "< 24h",
                label: "Tiempo de respuesta",
              },
              {
                icon: <Mail className="w-5 h-5" />,
                value: "100%",
                label: "Tasa de respuesta",
              },
              {
                icon: <Clock className="w-5 h-5" />,
                value: "24/7",
                label: "Disponibilidad",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white/60 backdrop-blur-sm border border-gray-100 rounded-2xl p-4 text-center"
              >
                <div className="flex justify-center text-[#6C63FF] mb-2">
                  {stat.icon}
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative pb-20 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="order-2 lg:order-1">
            <ContactForm />
          </div>

          {/* Contact Info & FAQ */}
          <div className="order-1 lg:order-2 space-y-6">
            {/* Contact Methods */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Otras formas de contacto
              </h2>

              <div className="space-y-4">
                <ContactMethod
                  icon={<Mail className="w-5 h-5" />}
                  title="Email"
                  value="quintero2001.205@gmail.com"
                  href="mailto:quintero2001.205@gmail.com"
                  color="text-blue-600"
                  bgColor="bg-blue-50"
                />

                <ContactMethod
                  icon={<Phone className="w-5 h-5" />}
                  title="WhatsApp"
                  value="+51 903 112 126"
                  href="https://wa.me/51903112126"
                  color="text-green-600"
                  bgColor="bg-green-50"
                />

                <ContactMethod
                  icon={<MapPin className="w-5 h-5" />}
                  title="Ubicación"
                  value="Piura, Perú"
                  color="text-purple-600"
                  bgColor="bg-purple-50"
                />
              </div>
            </div>

            {/* FAQ Quick Links */}
            <div className="bg-gradient-to-br from-[#6C63FF]/5 to-[#00E0C6]/5 border border-gray-100 rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Preguntas frecuentes
              </h2>

              <div className="space-y-3">
                <FAQLink
                  icon={<HelpCircle className="w-4 h-4" />}
                  text="¿Cómo público una habitación?"
                />
                <FAQLink
                  icon={<FileText className="w-4 h-4" />}
                  text="¿Cómo hago una reserva?"
                />
                <FAQLink
                  icon={<AlertCircle className="w-4 h-4" />}
                  text="¿Cómo reporto un problema?"
                />
                <FAQLink
                  icon={<Send className="w-4 h-4" />}
                  text="¿Cómo contacto al arrendador?"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="relative py-16 px-6 bg-white/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Estamos aquí para ti
          </h2>
          <p className="text-gray-600 mb-8">
            Miles de estudiantes y arrendadores confían en UniRoom. Tu
            satisfacción es nuestra prioridad.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                emoji: "🛡️",
                title: "Seguro",
                desc: "Tus datos están protegidos",
              },
              {
                emoji: "⚡",
                title: "Rápido",
                desc: "Respuestas en menos de 24h",
              },
              { emoji: "💬", title: "Cercano", desc: "Atención personalizada" },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-3">{item.emoji}</div>
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

// Componentes auxiliares
interface ContactMethodProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  href?: string;
  color: string;
  bgColor: string;
}

function ContactMethod({
  icon,
  title,
  value,
  href,
  color,
  bgColor,
}: ContactMethodProps) {
  const content = (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl ${bgColor} hover:shadow-md transition-all cursor-pointer group`}
    >
      <div
        className={`${color} ${bgColor} p-3 rounded-lg group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-600 mb-0.5">{title}</p>
        <p className={`font-semibold ${color}`}>{value}</p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {content}
      </a>
    );
  }

  return content;
}

interface FAQLinkProps {
  icon: React.ReactNode;
  text: string;
}

function FAQLink({ icon, text }: FAQLinkProps) {
  return (
    <button className="w-full flex items-center gap-3 text-left p-3 rounded-lg hover:bg-white transition-colors group">
      <div className="text-[#6C63FF] group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <span className="text-gray-700 group-hover:text-[#6C63FF] transition-colors">
        {text}
      </span>
    </button>
  );
}
