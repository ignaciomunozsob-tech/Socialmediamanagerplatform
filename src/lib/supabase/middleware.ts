import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const url = request.nextUrl.clone();
  const isPortal = url.pathname.startsWith("/portal");
  const isAuth = url.pathname.startsWith("/auth");

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && !isPortal && !isAuth) {
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }

    if (user && isAuth) {
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  } catch {
    if (!isPortal && !isAuth) {
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
