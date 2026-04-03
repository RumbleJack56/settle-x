import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "OTP",
      credentials: {
        mobile_number: { label: "Mobile Number", type: "text" },
        otp_code: { label: "OTP Code", type: "text" },
        name: { label: "Name", type: "text" }
      },
      async authorize(credentials) {
        if (!credentials?.mobile_number || !credentials?.otp_code) {
          return null;
        }
        
        try {
          const apiBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api/v1";
          const res = await fetch(`${apiBase}/auth/verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              mobile_number: credentials.mobile_number,
              otp_code: credentials.otp_code,
              name: credentials.name
            })
          });
          
          const data = await res.json();
          
          if (res.ok && data.user) {
            // NextAuth merges this object into the token payload
            return {
              id: String(data.user.id),
              mobile_number: data.user.mobile_number,
              business_name: data.user.business_name,
              gstin: data.user.gstin,
              api_token: data.access_token // Persist FastAPI JWT inside NextAuth
            };
          }
          return null;
        } catch (error) {
          console.error("Auth API Error:", error);
          return null;
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.mobile_number = user.mobile_number;
        token.business_name = user.business_name;
        token.gstin = user.gstin;
        token.api_token = user.api_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        // @ts-ignore - bypassing strict types for prototyping flexibility
        session.user = {
          ...session.user,
          id: token.id as string,
          mobile_number: token.mobile_number as string,
          business_name: token.business_name as string,
          gstin: token.gstin as string,
          api_token: token.api_token as string
        };
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/" // Reroute to dashboard where our modal renders naturally
  }
};
