import { Transaction } from "@solana/web3.js";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getCsrfToken } from "next-auth/react";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const providers = [
    CredentialsProvider({
      name: "Solana",
      credentials: {
        signature: {
          label: "Signature",
          type: "text",
        },
      },
      async authorize(credentials) {
        try {

          const recoveredTransaction = Transaction.from(
            Buffer.from(credentials!.signature, "base64")
          );

          console.log(recoveredTransaction.instructions[0].data.toString('utf8'))

          const signinMessage = JSON.parse(recoveredTransaction.instructions[0].data.toString() || "{}")

          const nextAuthUrl = new URL(process.env.NEXTAUTH_URL!);
          if (signinMessage.domain !== nextAuthUrl.host) {
            return null;
          }

          if (signinMessage.nonce !== (await getCsrfToken({ req }))) {
            return null;
          }

          const validationResult = recoveredTransaction.verifySignatures();

          if (!validationResult)
            throw new Error("Could not validate the signed message");

          return {
            id: signinMessage.publicKey,
          };
        } catch (e) {
          return null;
        }
      },
    }),
  ];

  const isDefaultSigninPage =
    req.method === "GET" && req.query.nextauth?.includes("signin");

  // Hides Sign-In with Solana from default sign page
  if (isDefaultSigninPage) {
    providers.pop();
  }

  return await NextAuth(req, res, {
    providers,
    session: {
      strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
      async session({ session, token }: any) {
        session.publicKey = token.sub;
        if (session.user) {
          session.user.name = token.sub;
          session.user.image = `https://ui-avatars.com/api/?name=${token.sub}&background=random`;
        }
        return session;
      },
    },
  });
}