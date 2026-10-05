import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

const PROTECTED = ["/dashboard", "/transacoes"]
const AUTH_PAGES = ["/login", "/cadastro"]

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const redirect = (to: string) => {
    const url = request.nextUrl.clone()
    url.pathname = to
    return NextResponse.redirect(url)
  }

  if (!user && PROTECTED.some((p) => path.startsWith(p))) return redirect("/login")
  if (user && AUTH_PAGES.includes(path)) return redirect("/dashboard")

  return response
}

export const config = {
  matcher: ["/dashboard/:path*", "/transacoes/:path*", "/login", "/cadastro"],
}
