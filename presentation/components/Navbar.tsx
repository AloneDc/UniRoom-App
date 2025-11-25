"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/presentation/context/AuthContext";
import { useEffect, useState, type FC } from "react";
import { supabase } from "@/infrastructure/supabase/supabaseClient";
import { useRouter } from "next/navigation";
import { AuthService } from "@/domain/services/AuthService";
import { toast } from "sonner";
import { Menu, X, User, LogOut, PlusCircle, Search, Mail } from "lucide-react";

const Navbar: FC = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const router = useRouter();
  // ✅ Cargar rol del usuario
  useEffect(() => {
    let isMounted = true;

    const fetchRole = async (): Promise<void> => {
      if (!user) {
        if (isMounted) setRole(null);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error al cargar rol:", error.message);
        return;
      }

      if (isMounted) {
        setRole(data?.role || null);
      }
    };

    void fetchRole();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handleLogout = async (): Promise<void> => {
    try {
      await AuthService.signOut();
      toast.success("Sesión cerrada correctamente 👋");
      setRole(null);
      setMenuOpen(false);
      router.push("/login");
    } catch (error) {
      console.error(error);
      toast.error("No se pudo cerrar sesión");
    }
  };

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <nav
        className="w-full md:max-w-6xl bg-gradient-to-r from-[#ffffff]/90 via-[#F8FAFF]/80 to-[#ffffff]/90 
                   border border-white/60 shadow-[0_8px_32px_rgba(31,38,135,0.1)] 
                   backdrop-blur-2xl rounded-full px-4 md:px-10 py-3 
                   flex justify-between items-center transition-all duration-300 hover:shadow-xl"
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 text-xl md:text-2xl font-extrabold text-[#1A1A2E] tracking-tight hover:opacity-80 transition-opacity"
        >
          {/* Logo Image */}
          <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden shadow-md ring-2 ring-[#6C63FF]/20">
            <Image
              src="/assets/Logo.jpg"
              alt="UniRoom Logo"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Texto del logo */}
          <span className="hidden sm:inline">UniRoom</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-7">
          <Link
            href="/buscar"
            className="flex items-center gap-1 text-gray-700 hover:text-[#6C63FF] font-medium transition-colors"
          >
            <Search size={18} /> Buscar
          </Link>

          {role === "landlord" && (
            <Link
              href="/publicar"
              className="flex items-center gap-1 text-[#00E0C6] hover:text-[#00bba1] font-semibold transition-colors"
            >
              <PlusCircle size={18} /> Publicar
            </Link>
          )}

          <Link
            href="/contacto"
            className="flex items-center gap-1 text-gray-700 hover:text-[#6C63FF] font-medium transition-colors"
          >
            <Mail size={18} /> Contacto
          </Link>

          {user ? (
            <>
              <Link
                href={
                  role === "landlord"
                    ? "/perfil/arrendador"
                    : "/perfil/estudiante"
                }
                className="flex items-center gap-1 text-[#6C63FF] hover:text-[#584dfc] font-semibold transition-colors"
              >
                <User size={18} /> Mi Perfil
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium px-4 py-2 rounded-full hover:from-red-600 hover:to-red-700 transition-colors shadow-md hover:shadow-lg"
              >
                <LogOut size={18} /> Salir
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1 bg-gradient-to-r from-[#6C63FF] to-[#00E0C6] text-white font-semibold px-4 py-2 rounded-full shadow-md hover:shadow-lg hover:opacity-90 transition"
            >
              <User size={18} /> Iniciar sesión
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-gray-700 hover:text-[#6C63FF] transition rounded-full hover:bg-gray-100"
          aria-label="Abrir menú"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          />

          {/* Menu */}
          <div className="absolute top-[80px] w-[90%] bg-white/95 backdrop-blur-md border border-gray-100 rounded-3xl shadow-xl py-5 px-6 space-y-3 animate-slideDown md:hidden z-50">
            <Link
              href="/buscar"
              className="flex items-center gap-2 text-gray-700 hover:text-[#6C63FF] transition px-3 py-2 rounded-lg hover:bg-gray-50"
              onClick={() => setMenuOpen(false)}
            >
              <Search size={18} /> Buscar
            </Link>

            {role === "landlord" && (
              <Link
                href="/publicar"
                className="flex items-center gap-2 text-[#00E0C6] hover:text-[#00bba1] font-semibold transition px-3 py-2 rounded-lg hover:bg-[#00E0C6]/5"
                onClick={() => setMenuOpen(false)}
              >
                <PlusCircle size={18} /> Publicar
              </Link>
            )}

            <Link
              href="/contacto"
              className="flex items-center gap-2 text-gray-700 hover:text-[#6C63FF] transition px-3 py-2 rounded-lg hover:bg-gray-50"
              onClick={() => setMenuOpen(false)}
            >
              <Mail size={18} /> Contacto
            </Link>

            {user ? (
              <>
                <div className="h-px bg-gray-200 my-3" />

                <Link
                  href={
                    role === "landlord"
                      ? "/perfil/arrendador"
                      : "/perfil/estudiante"
                  }
                  className="flex items-center gap-2 text-[#6C63FF] font-semibold hover:text-[#584dfc] transition px-3 py-2 rounded-lg hover:bg-[#6C63FF]/5"
                  onClick={() => setMenuOpen(false)}
                >
                  <User size={18} /> Mi Perfil
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 text-red-600 hover:text-red-700 transition px-3 py-2 rounded-lg hover:bg-red-50"
                >
                  <LogOut size={18} /> Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <div className="h-px bg-gray-200 my-3" />

                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#6C63FF] to-[#00E0C6] text-white font-semibold px-4 py-3 rounded-xl shadow-md hover:shadow-lg transition"
                  onClick={() => setMenuOpen(false)}
                >
                  <User size={18} /> Iniciar sesión
                </Link>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;
