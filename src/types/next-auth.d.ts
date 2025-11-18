import { DefaultSession } from "next-auth"
import "next-auth/jwt"

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string
    // Add other custom properties if needed
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
  }
}
