import { supabase } from "@/infrastructure/supabase/supabaseClient";

export const AuthService = {
  /**
   * 🔹 Iniciar sesión con email y contraseña
   */
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);

    const user = data.user;
    if (!user) throw new Error("No se pudo iniciar sesión");

    // Obtener el rol desde la tabla "users"
    const { data: userData, error: roleError } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (roleError) throw new Error(roleError.message);

    return {
      user,
      role: userData?.role || user.user_metadata?.role || "student",
    };
  },

  /**
   * 🔹 Registrar nuevo usuario (student | landlord)
   * Incluye: full name, role y phone opcional
   */
  async register(
    email: string,
    password: string,
    fullName: string,
    role: "student" | "landlord",
    phone?: string
  ) {
    // Crear usuario en el sistema de autenticación de Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role, phone },
      },
    });

    if (error) throw new Error(error.message);

    const user = data.user;
    if (!user) throw new Error("No se pudo registrar el usuario.");

    // Insertar registro adicional en la tabla `users`
    const { error: upsertError } = await supabase.from("users").upsert({
      id: user.id,
      email,
      full_name: fullName,
      role,
      phone: phone || null,
      verified: false, // 🔹 Default según tu schema
      created_at: new Date().toISOString(),
    });

    if (upsertError) throw new Error(upsertError.message);

    return data;
  },

  /**
   * 🔹 Recuperar contraseña
   */
  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password`,
    });

    if (error) throw new Error(error.message);
    return true;
  },

  /**
   * 🔹 Cerrar sesión
   */
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
  },

  /**
   * 🔹 Alias alternativo
   */
  async signOut() {
    return this.logout();
  },
};
