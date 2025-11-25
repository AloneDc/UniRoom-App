"use client";

import { type FC } from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Linkedin, Home } from "lucide-react";

const Footer: FC = () => {
  return (
    <footer className="relative bg-gradient-to-br from-[#6C63FF]/10 via-[#00E0C6]/10 to-white/20 backdrop-blur-md border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-8 md:grid-cols-3 text-center md:text-left text-gray-700">
        {/* Logo & descripción */}
        <div>
          <Link
            href="/"
            className="flex items-center justify-center md:justify-start gap-2 mb-3"
          >
            <Home className="text-[#6C63FF]" size={22} />
            <span className="text-2xl font-extrabold text-[#1A1A2E]">
              UniRoom
            </span>
          </Link>
          <p className="text-gray-600 text-sm">
            Encuentra tu espacio ideal para estudiar, descansar y compartir.
            UniRoom conecta estudiantes y arrendadores en una comunidad segura y
            moderna.
          </p>
        </div>

        {/* Navegación */}
        <div>
          <h3 className="font-semibold text-[#1A1A2E] mb-3">Enlaces útiles</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                href="/buscar"
                className="hover:text-[#6C63FF] transition-colors"
              >
                Buscar habitaciones
              </Link>
            </li>
            <li>
              <Link
                href="/publicar"
                className="hover:text-[#6C63FF] transition-colors"
              >
                Publicar alojamiento
              </Link>
            </li>
            <li>
              <Link
                href="/sobre"
                className="hover:text-[#6C63FF] transition-colors"
              >
                Sobre UniRoom
              </Link>
            </li>
            <li>
              <Link
                href="/contacto"
                className="hover:text-[#6C63FF] transition-colors"
              >
                Contacto
              </Link>
            </li>
          </ul>
        </div>

        {/* Redes sociales */}
        <div>
          <h3 className="font-semibold text-[#1A1A2E] mb-3">Síguenos</h3>
          <div className="flex justify-center md:justify-start gap-4">
            <Link
              href="https://facebook.com"
              target="_blank"
              className="p-2 bg-white rounded-full shadow-sm hover:shadow-md hover:bg-[#6C63FF] hover:text-white transition"
            >
              <Facebook size={18} />
            </Link>
            <Link
              href="https://instagram.com"
              target="_blank"
              className="p-2 bg-white rounded-full shadow-sm hover:shadow-md hover:bg-[#00E0C6] hover:text-white transition"
            >
              <Instagram size={18} />
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              className="p-2 bg-white rounded-full shadow-sm hover:shadow-md hover:bg-[#6C63FF] hover:text-white transition"
            >
              <Twitter size={18} />
            </Link>
            <Link
              href="https://linkedin.com"
              target="_blank"
              className="p-2 bg-white rounded-full shadow-sm hover:shadow-md hover:bg-[#00E0C6] hover:text-white transition"
            >
              <Linkedin size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* Línea inferior */}
      <div className="border-t border-gray-200 py-5 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-[#6C63FF]">UniRoom</span> — Todos
        los derechos reservados.
      </div>

      {/* Decoraciones de fondo */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-[#6C63FF]/20 blur-3xl rounded-full" />
      <div className="absolute bottom-10 right-10 w-28 h-28 bg-[#00E0C6]/20 blur-3xl rounded-full" />
    </footer>
  );
};

export default Footer;
