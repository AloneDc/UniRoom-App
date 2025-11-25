"use client";

import { type FC } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const Hero: FC = () => {
  return (
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Fondo con imagen + overlay + gradiente */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/Header1.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#6C63FF]/60 via-[#00E0C6]/40 to-white/10 backdrop-blur-sm" />

      {/* Contenido principal */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 bg-white/70 backdrop-blur-lg px-8 py-10 md:px-12 md:py-14 rounded-3xl shadow-2xl text-center max-w-2xl mx-4"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-3xl md:text-5xl font-extrabold text-[#1A1A2E] mb-4 leading-tight"
        >
          Tu habitación ideal cerca de la universidad 🏡
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-gray-700 text-lg md:text-xl mb-8"
        >
          Explora, reserva y vive una experiencia universitaria cómoda, segura y
          personalizada con{" "}
          <span className="font-semibold text-[#6C63FF]">UniRoom</span>.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Link
            href="/buscar"
            className="inline-block bg-gradient-to-r from-[#6C63FF] to-[#00E0C6] text-white font-semibold text-lg px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-transform transform hover:scale-[1.05] active:scale-[0.98]"
          >
            Buscar habitaciones
          </Link>
        </motion.div>
      </motion.div>

      {/* Decoraciones animadas */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 2, delay: 0.3 }}
        className="absolute top-16 left-10 w-32 h-32 bg-[#6C63FF]/30 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1 }}
        transition={{ duration: 2, delay: 0.6 }}
        className="absolute bottom-16 right-10 w-40 h-40 bg-[#00E0C6]/30 rounded-full blur-3xl"
      />
    </section>
  );
};

export default Hero;
