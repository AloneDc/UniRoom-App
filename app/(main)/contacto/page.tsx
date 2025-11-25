import ContactForm from "@/presentation/components/ContactForm";

export const metadata = {
  title: "Contacto | UniRoom",
  description: "Envía tus consultas o reportes al equipo de UniRoom.",
};

export default function ContactPage() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-16">
      <div className="max-w-4xl text-center mb-8">
        <h1 className="text-4xl font-bold text-blue-700 mb-2">
          ¿Necesitas ayuda?
        </h1>
        <p className="text-gray-700">
          Completa el formulario y nuestro equipo te responderá en breve.
        </p>
      </div>
      <ContactForm />
    </section>
  );
}
