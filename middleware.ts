import { updateSession } from "@/lib/supabase/middleware"
import { getSecurityHeaders } from "@/lib/security/headers"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const response = await updateSession(request)

  const securityHeaders = getSecurityHeaders()
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
