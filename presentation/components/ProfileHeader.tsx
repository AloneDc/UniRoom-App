"use client";
import { useAuth } from "@/presentation/context/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/infrastructure/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import { AuthService } from "@/domain/services/AuthService";

export default function ProfileHeader() {
  const { user, loading } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadRole = async () => {
      if (user) {
        const { data } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();
        setRole(data?.role || "student");
      }
    };
    loadRole();
  }, [user]);

  if (loading) return <p className="text-center py-10">Cargando perfil...</p>;
  if (!user)
    return <p className="text-center py-10 text-red-500">No autenticado</p>;

  return (
    <header className="bg-blue-600 text-white py-6 px-8 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-semibold">
          Hola, {user.user_metadata.full_name || "Usuario"} 👋
        </h1>
        <p className="text-blue-100">
          {role === "landlord" ? "Arrendador 🏠" : "Estudiante 🎓"}
        </p>
      </div>
      <button
        onClick={() => AuthService.logout().then(() => router.push("/"))}
        className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200 transition"
      >
        Cerrar sesión
      </button>
    </header>
  );
}
