"use client";

import { useRoleGuard } from "@/presentation/hooks/useRoleGuard";
import ProfileForm from "@/presentation/components/ProfileForm";
import { AuthService } from "@/domain/services/AuthService";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function StudentConfigPage() {
  const { user, profile, loading } = useRoleGuard("student");
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      toast.success("Sesión cerrada correctamente 👋");
      router.push("/login");
    } catch (error) {
      toast.error("Error al cerrar sesión");
      console.error(error);
    }
  };

  if (loading) return <p className="text-center py-10">Cargando...</p>;
  if (!user || !profile) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Encabezado */}
        <h1 className="text-3xl font-bold text-blue-700 text-center">
          Configuración de tu Perfil
        </h1>
        <p className="text-center text-gray-500">
          Actualiza tu información personal y mantén tu cuenta al día.
        </p>

        {/* Formulario reutilizable */}
        <ProfileForm
          initialData={{
            full_name: profile.full_name,
            phone: profile.phone ?? "",
            photo_url: profile.photo_url ?? "",
          }}
        />

        {/* Botón de cierre de sesión */}
        <div className="text-center pt-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
