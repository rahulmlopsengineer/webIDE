/**
 * lib/auth.ts
 *
 * TWO EXPORTS:
 *
 * 1. `authConfig`  — pure JWT config, NO Mongoose imports.
 *    Used by middleware.ts (Edge Runtime safe).
 *
 * 2. `{ handlers, auth, signIn, signOut }` — full NextAuth with
 *    Mongoose callbacks. Used ONLY by:
 *      - app/api/auth/[...nextauth]/route.ts
 *      - Server components / API routes (Node.js runtime)
 *
 * NEVER import `auth` (the full version) in middleware.ts.
 */

import NextAuth, { type NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { authConfig } from "@/lib/authConfig";

// ── 2. Full NextAuth (Node.js only — has DB callbacks) ────────
// Lazy-import Mongoose models so the heavy callbacks only run
// when this module is imported on the server (not in Edge).
export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,

  callbacks: {
    // Runs on sign-in: upsert the user in MongoDB
    async signIn({ user, account }) {
      if (!account || !user.email) return false;
      try {
        const { connectDB } = await import("@/lib/mongoose");
        const { User }      = await import("@/models/User");
        await connectDB();
        await User.findOneAndUpdate(
          { email: user.email },
          {
            name:       user.name       ?? "",
            email:      user.email,
            image:      user.image      ?? "",
            provider:   account.provider as "google" | "github",
            providerId: account.providerAccountId,
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        return true;
      } catch {
        return false;
      }
    },

    // Attach the MongoDB _id to the JWT session
    async session({ session, token }) {
      if (token.sub) {
        (session.user as typeof session.user & { id: string }).id = token.sub;
      }
      if (session.user?.email && !token.dbId) {
        try {
          const { connectDB } = await import("@/lib/mongoose");
          const { User }      = await import("@/models/User");
          await connectDB();
          const dbUser = await User.findOne({ email: session.user.email }).lean();
          if (dbUser) {
            (session.user as typeof session.user & { id: string }).id =
              (dbUser._id as { toString(): string }).toString();
          }
        } catch { /* non-fatal */ }
      }
      return session;
    },
  },
});