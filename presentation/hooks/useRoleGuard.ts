"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/infrastructure/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import type { UserProfile } from "@/shared/types";

/**
 * 🔒 Protege rutas según el rol del usuario autenticado.
 * Si el usuario no tiene sesión o su rol no coincide, redirige automáticamente.
 *
 * @param allowedRole - Rol requerido para acceder (student | landlord | admin)
 * @returns Objeto con `user`, `profile`, y `loading`
 */
export const useRoleGuard = (allowedRole: "student" | "landlord" | "admin") => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const checkRole = async () => {
      try {
        // 1️⃣ Obtener sesión actual
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;

        const currentUser = data.user;

        if (!currentUser) {
          router.replace("/login");
          return;
        }

        // 2️⃣ Obtener perfil desde tabla `users`
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", currentUser.id)
          .single<UserProfile>();

        if (userError) throw userError;

        // 3️⃣ Validar rol permitido
        if (userData && userData.role !== allowedRole) {
          const redirectTo =
            userData.role === "landlord"
              ? "/perfil/arrendador"
              : userData.role === "student"
              ? "/perfil/estudiante"
              : "/";

          router.replace(redirectTo);
          return;
        }

        // 4️⃣ Asignar estado solo si el componente sigue montado
        if (isMounted) {
          setUser(currentUser);
          setProfile(userData);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error en useRoleGuard:", err);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkRole();

    return () => {
      isMounted = false;
    };
  }, [allowedRole, router]);

  return { user, profile, loading };
};
