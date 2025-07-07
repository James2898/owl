import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions = {
  providers: [
    CredentialsProvider({
      id: "app-password-login",
      name: "App Password Login",
      credentials: {
        password: {
          label: "App Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        console.log(
          "Login attempt received at:",
          new Date().toLocaleString("en-US", { timeZone: "Asia/Manila" })
        );
        console.log("Submitted password:", credentials?.password);
        console.log("Expected password (from .env):", process.env.APP_PASSWORD);
        console.log(
          "Are passwords strictly equal?",
          credentials?.password === process.env.APP_PASSWORD
        );
        if (credentials && credentials.password === process.env.APP_PASSWORD) {
          return { id: "teacher-farah", name: "Teacher Farah" }; // Must match the User type expected by NextAuth
        } else {
          console.log("Invalid password attempt.");
          return null; // Return null if the password is incorrect
        }
        return null;
      },
    }),
  ],

  pages: {
    signIn: "/login", // Redirect to custom login page
  },

  session: {
    strategy: "jwt" as const, // Use JWT for session management
  },

  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id; // Add user ID to the token
        token.name = user.name; // Add user name to the token
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.id as string; // Add user ID to session
        session.user.name = token.name as string; // Add user name to session
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
