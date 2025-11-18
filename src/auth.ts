import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account }) {
      // Save access token from Google if desired
      if (account?.provider === "google") {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      // Expose access token to client if stored
      if (token?.accessToken) session.accessToken = token.accessToken
      return session
    },
  },
})
