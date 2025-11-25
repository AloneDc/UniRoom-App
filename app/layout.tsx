import "./globals.css";
import Navbar from "@/presentation/components/Navbar";
import Footer from "@/presentation/components/Footer";
import { AuthProvider } from "@/presentation/context/AuthContext";
import { Inter } from "next/font/google";
import { Toaster } from "sonner"; // ✅ Importamos Sonner para los toast

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "UniRoom – Alojamiento Estudiantil",
  description:
    "Encuentra, publica y reserva habitaciones para estudiantes universitarios.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}
      >
        <AuthProvider>
          {/* ✅ Navbar global */}
          <Navbar />

          {/* ✅ Contenido principal */}
          <main className="min-h-screen">{children}</main>

          {/* ✅ Footer global */}
          <Footer />

          {/* ✅ Toaster global (notificaciones sonner) */}
          <Toaster
            richColors
            position="top-center"
            closeButton
            expand
            toastOptions={{
              style: {
                fontFamily: inter.style.fontFamily,
                borderRadius: "0.75rem",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
