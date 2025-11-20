import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/auth" // Adjust the path if your auth file is elsewhere

export async function middleware(request: NextRequest) {
  // Check if the pathname is /overview
  if (request.nextUrl.pathname === "/overview") {
    // Check authentication
    const session = await auth()
    console.log(session)
    if (!session) {
      // Redirect to /login if not authenticated
      const loginUrl = new URL("/login", request.url)
      return NextResponse.redirect(loginUrl)
    }
  }
  // Proceed normally otherwise
  return NextResponse.next()
}

//protected routes
export const config = {
  matcher:[ "/overview",
  "/overview/:id*",
  "/overview/:id/:filetype*"]
}
