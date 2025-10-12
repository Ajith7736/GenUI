import NextAuth, { DefaultUser, Session, type NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google";
import connectdb from "@/db/connectdb";
import User from "@/models/User";
import { JWT } from "next-auth/jwt";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }

    interface User extends DefaultUser {
        id: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],
    callbacks: {
        async signIn({ user }): Promise<boolean> {
            try {
                await connectdb();
                if (!user.email) {
                    console.log("no email returned");
                    return false;
                }
                const existinguser = await User.findOne({ Email: user.email })
                if (!existinguser) {
                    await User.create({
                        Email: user.email,
                        Name: user.name,
                        Profilepic: user.image
                    });
                }
                return true;
            } catch (err) {
                console.error("Server Error");
                return false
            }
        },
        async jwt({ token, user }) {
            if (user) {
                await connectdb();
                const dbuser = await User.findOne({ Email: user.email });
                token.id = dbuser._id;
            }
            return token;
        },


        async session({ session, token }: { session: Session, token: JWT }) {
            if (token) {
                session.user.id = token.id;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }