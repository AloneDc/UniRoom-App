"use client";

import { useRouter } from "next/navigation";
import { useState, type FC, type FormEvent, ChangeEvent } from "react";
import { MapPin, Home, DollarSign, Search } from "lucide-react";
import { motion } from "framer-motion";

const SearchFilters: FC = () => {
  const router = useRouter();

  const [filters, setFilters] = useState({
    location: "",
    type: "",
    min: "",
    max: "",
  });

  const handleChange =
    (key: keyof typeof filters) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
      setFilters({ ...filters, [key]: e.target.value });
    };

  const handleSearch = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const params = new URLSearchParams(
      Object.entries(filters).filter(([, v]) => v !== "")
    );
    router.push(`/buscar?${params.toString()}`);
  };

  return (
    <motion.form
      onSubmit={handleSearch}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white/80 backdrop-blur-xl border border-gray-100 p-5 rounded-3xl shadow-xl
                 grid gap-3 md:grid-cols-[2fr_1.2fr_1fr_1fr_auto] items-center 
                 w-full max-w-5xl mx-auto mt-6 transition-all hover:shadow-2xl"
    >
      {/* Ubicación */}
      <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 bg-white/70 hover:border-[#6C63FF] transition">
        <MapPin size={18} className="text-[#6C63FF]" />
        <input
          type="text"
          placeholder="Ubicación (ej. Madrid, Lima...)"
          className="bg-transparent w-full outline-none placeholder-gray-500 text-gray-700"
          value={filters.location}
          onChange={handleChange("location")}
        />
      </div>

      {/* Tipo */}
      <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 bg-white/70 hover:border-[#6C63FF] transition">
        <Home size={18} className="text-[#6C63FF]" />
        <select
          className="bg-transparent w-full outline-none text-gray-700"
          value={filters.type}
          onChange={handleChange("type")}
        >
          <option value="">Tipo</option>
          <option value="individual">Individual</option>
          <option value="compartida">Compartida</option>
          <option value="departamento">Departamento</option>
        </select>
      </div>

      {/* Precio mínimo */}
      <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 bg-white/70 hover:border-[#6C63FF] transition">
        <DollarSign size={18} className="text-[#6C63FF]" />
        <input
          type="number"
          placeholder="Mínimo"
          className="bg-transparent w-full outline-none placeholder-gray-500 text-gray-700"
          value={filters.min}
          onChange={handleChange("min")}
          min={0}
        />
      </div>

      {/* Precio máximo */}
      <div className="flex items-center gap-2 border border-gray-200 rounded-full px-4 py-2 bg-white/70 hover:border-[#6C63FF] transition">
        <DollarSign size={18} className="text-[#6C63FF]" />
        <input
          type="number"
          placeholder="Máximo"
          className="bg-transparent w-full outline-none placeholder-gray-500 text-gray-700"
          value={filters.max}
          onChange={handleChange("max")}
          min={0}
        />
      </div>

      {/* Botón Buscar */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        type="submit"
        className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#6C63FF] to-[#00E0C6]
                   text-white font-semibold px-5 py-3 rounded-full shadow-md hover:shadow-lg transition"
      >
        <Search size={18} /> Buscar
      </motion.button>
    </motion.form>
  );
};

export default SearchFilters;
