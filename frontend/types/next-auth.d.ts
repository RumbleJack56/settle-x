import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    mobile_number?: string;
    business_name?: string;
    gstin?: string;
    api_token?: string;
  }

  interface Session {
    user: User & DefaultSession["user"];
  }
}
