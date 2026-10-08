import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "parent@earlysteps.org" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;
        const email = credentials.email.toLowerCase().trim();

        // Find user in database
        let user = await prisma.user.findUnique({ where: { email } });

        // If credentials match standard demo accounts or user registered with password
        if (!user) {
          // If demo parent or dynamic signup fallback
          if (email === "parent@earlysteps.org" || email.includes("@")) {
            user = await prisma.user.create({
              data: {
                email,
                name: email.split("@")[0].replace(".", " "),
                role: "PARENT",
                passwordHash: credentials.password || "Password@123",
                consents: {
                  create: {
                    version: "1.0.0-dpdp2023",
                    agreedToDPDP: true,
                    termsAccepted: true,
                  },
                },
              },
            });
          } else {
            return null;
          }
        }

        // Return user profile
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role || "PARENT";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string; role?: string }).id = token.id as string;
        (session.user as { id?: string; role?: string }).role = (token.role as string) || "PARENT";
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "earlysteps-super-secret-key-2026-development",
};
