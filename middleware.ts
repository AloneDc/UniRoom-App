import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Faltan variables de entorno de Supabase");
    return NextResponse.json(
      { error: "Missing Supabase env vars" },
      { status: 500 }
    );
  }

  const res = NextResponse.next();

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value, options }) => {
          res.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = req.nextUrl.pathname;

  const publicRoutes = ["/", "/login", "/register", "/buscar", "/habitacion"];

  if (publicRoutes.some((path) => pathname.startsWith(path))) {
    return res;
  }

  if (!user) {
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // 🔹 Obtener rol del usuario
  const { data: profile, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Error al obtener rol:", error.message);
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const role = profile?.role;
  const roleRoutes: Record<string, string[]> = {
    student: ["/perfil/estudiante", "/reservar"],
    landlord: ["/perfil/arrendador", "/crear-habitacion", "/editar-habitacion"],
    admin: ["/admin"],
  };

  const allowedRoutes = [
    ...(roleRoutes[role as keyof typeof roleRoutes] || []),
    ...publicRoutes,
  ];

  const hasAccess = allowedRoutes.some((path) => pathname.startsWith(path));

  if (!hasAccess) {
    return NextResponse.redirect(new URL("/no-autorizado", req.url));
  }

  return res;
}

export const config = {
  matcher: [
    "/perfil/:path*",
    "/crear-habitacion/:path*",
    "/editar-habitacion/:path*",
    "/reservar/:path*",
    "/admin/:path*",
  ],
};
