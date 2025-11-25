import { supabase } from "@/infrastructure/supabase/supabaseClient";

export const UserService = {
  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
  },

  async getUserProfile(id: string) {
    const { data, error } = await supabase
      .from("users")
      .select("id, full_name, email, role, created_at")
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async updateProfile(id: string, updates: { full_name?: string }) {
    const { error } = await supabase.from("users").update(updates).eq("id", id);

    if (error) throw new Error(error.message);
    return true;
  },
};
