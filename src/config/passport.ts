import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { prisma } from "@/config/prisma";

/**
 * Find a user based on the OAuth account (provider + providerAccountId).
 * If it does not exist, create a new user and its account record.
 */
export async function findOrCreateUser(params: {
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
    return { ...existingAccount.user, isNewUser: false };
  }

  let user = await prisma.user.findUnique({ where: { email: params.email } });
  let isNewUser = false; 

  if (!user) {
    user = await prisma.user.create({
      data: {
        name: params.name,
        email: params.email,
        avatarUrl: params.avatarUrl,
        role: "user",
      },
    });
    isNewUser = true;
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

  return { ...user, isNewUser };
}

// Google Strategy is only registered when credentials are present in .env
// This keeps the server running for early testing before you
// have set up the Google/GitHub OAuth app.
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
      },
    ),
  );
} else {
  console.warn(
    "⚠️  GOOGLE_CLIENT_ID/SECRET have not been set in .env — Google login is temporarily disabled.",
  );
}

// GitHub Strategy is only registered when credentials are present
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
        done: (error: any, user?: any) => void,
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
      },
    ),
  );
} else {
  console.warn(
    "⚠️  GITHUB_CLIENT_ID/SECRET have not been set in .env — GitHub login is temporarily disabled.",
  );
}

export default passport;
