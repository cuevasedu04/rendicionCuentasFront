import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      id: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        drfToken: { label: 'Token', type: 'text' },
      },
      async authorize({ email, drfToken }) {
        if (!drfToken) return null;
        try {
          const res = await fetch(`${API_BASE}/api/v1/auth/me/`, {
            headers: { Authorization: `Token ${drfToken}` },
          });
          if (!res.ok) return null;
          const user = await res.json();
          return { ...user, drfToken };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.drfToken = user.drfToken;
        token.nombre = user.nombre;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.drfToken = token.drfToken;
      if (session.user) {
        session.user.nombre = token.nombre;
        session.user.email = token.email;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours — matches the Django OTP window
  },
  cookies: {
    sessionToken: {
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
});
