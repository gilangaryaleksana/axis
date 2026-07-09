import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { prisma } from "@/config/prisma";

/**
 * Cari user berdasarkan account OAuth (provider + providerAccountId).
 * Kalau belum ada, buat user baru sekaligus record account-nya.
 */
async function findOrCreateUser(params: {
  provider: "google" | "github";
  providerAccountId: string;
  email: string;
  name: string;
  avatarUrl?: string;
  accessToken?: string;
  refreshToken?: string;
}) {
  const existingAccount = await prisma.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider: params.provider,
        providerAccountId: params.providerAccountId,
      },
    },
    include: { user: true },
  });

  if (existingAccount) {
    return existingAccount.user;
  }

  let user = await prisma.user.findUnique({ where: { email: params.email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: params.name,
        email: params.email,
        avatarUrl: params.avatarUrl,
        role: "user",
      },
    });
  }

  await prisma.account.create({
    data: {
      userId: user.id,
      provider: params.provider,
      providerAccountId: params.providerAccountId,
      accessToken: params.accessToken,
      refreshToken: params.refreshToken,
    },
  });

  return user;
}

// Google Strategy hanya didaftarkan kalau credential-nya sudah diisi di .env
// Ini supaya server tetap bisa jalan untuk testing awal, sebelum kamu
// sempat bikin OAuth App di Google/GitHub Developer Console.
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await findOrCreateUser({
            provider: "google",
            providerAccountId: profile.id,
            email: profile.emails?.[0]?.value ?? `${profile.id}@google.local`,
            name: profile.displayName,
            avatarUrl: profile.photos?.[0]?.value,
            accessToken,
            refreshToken,
          });
          done(null, user);
        } catch (err) {
          done(err as Error, undefined);
        }
      }
    )
  );
} else {
  console.warn(
    "⚠️  GOOGLE_CLIENT_ID/SECRET belum diisi di .env — login Google dinonaktifkan sementara."
  );
}

// GitHub Strategy hanya didaftarkan kalau credential-nya sudah diisi
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID as string,
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        callbackURL: process.env.GITHUB_CALLBACK_URL as string,
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: (error: any, user?: any) => void
      ) => {
        try {
          const email =
            (profile.emails && profile.emails[0]?.value) ??
            `${profile.username}@github.local`;

          const user = await findOrCreateUser({
            provider: "github",
            providerAccountId: profile.id,
            email,
            name: profile.displayName || profile.username || "GitHub User",
            avatarUrl: profile.photos?.[0]?.value,
            accessToken,
            refreshToken,
          });
          done(null, user);
        } catch (err) {
          done(err as Error, undefined);
        }
      }
    )
  );
} else {
  console.warn(
    "⚠️  GITHUB_CLIENT_ID/SECRET belum diisi di .env — login GitHub dinonaktifkan sementara."
  );
}

export default passport;