import "./globals.css";
import Navbar from "@/presentation/components/Navbar";
import Footer from "@/presentation/components/Footer";
import { AuthProvider } from "@/presentation/context/AuthContext";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "UniRoom – Alojamiento Estudiantil",
  description:
    "Encuentra, publica y reserva habitaciones para estudiantes universitarios.",

  icons: {
    icon: "Uni.ico",
    shortcut: "/Uni.ico",
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    title: "UniRoom – Alojamiento Estudiantil",
    description:
      "La plataforma donde estudiantes universitarios encuentran y reservan habitaciones seguras.",
    url: "https://www.unirooom.com",
    siteName: "UniRoom",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "UniRoom – Encuentra habitaciones para estudiantes",
      },
    ],
    locale: "es_ES",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "UniRoom – Alojamiento Estudiantil",
    description:
      "Encuentra y publica habitaciones para estudiantes de forma rápida y segura.",
    images: ["/og-image.png"],
  },
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
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />

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
