"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * 🔹 Tipado seguro
 */
interface RoomPhoto {
  url: string;
}

export default function RoomGallery({ photos }: { photos: RoomPhoto[] }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setModalOpen] = useState(false);

  if (!photos || photos.length === 0) {
    return (
      <div className="w-full h-80 bg-gray-200 rounded-xl flex items-center justify-center text-gray-500 text-lg">
        Sin fotos disponibles
      </div>
    );
  }

  const selectedPhoto = photos[selectedIndex]?.url ?? "/assets/placeholder.png";

  return (
    <>
      {/* 🖼️ Imagen principal */}
      <div className="relative w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden cursor-pointer">
        <Image
          src={selectedPhoto}
          alt={`Imagen ${selectedIndex + 1} de la habitación`}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
          onClick={() => setModalOpen(true)}
          sizes="(max-width: 768px) 100vw, 80vw"
        />
        <div className="absolute bottom-3 right-4 bg-black/60 text-white px-3 py-1 rounded-md text-sm">
          {selectedIndex + 1} / {photos.length}
        </div>
      </div>

      {/* 🔹 Miniaturas */}
      <div className="flex gap-3 mt-3 overflow-x-auto scrollbar-hide">
        {photos.map((photo, i) => (
          <button
            key={i}
            onClick={() => setSelectedIndex(i)}
            className={`relative w-24 h-20 rounded-lg overflow-hidden border-2 transition-all ${
              selectedIndex === i
                ? "border-blue-600 scale-105"
                : "border-transparent hover:border-gray-300"
            }`}
          >
            <Image
              src={photo.url || "/assets/placeholder.png"}
              alt={`Miniatura ${i + 1}`}
              fill
              className="object-cover"
              sizes="96px"
            />
          </button>
        ))}
      </div>

      {/* 🔍 Modal ampliado */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setModalOpen(false)}
        >
          <button
            onClick={() => setModalOpen(false)}
            className="absolute top-5 right-5 text-white text-3xl font-bold hover:text-gray-300"
          >
            ×
          </button>

          <div className="relative w-full max-w-4xl h-[80vh]">
            <Image
              src={selectedPhoto}
              alt="Vista ampliada"
              fill
              className="object-contain rounded-lg"
              sizes="(max-width: 1200px) 90vw, 60vw"
            />
          </div>
        </div>
      )}
    </>
  );
}
