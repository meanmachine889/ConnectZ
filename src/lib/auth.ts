import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "./db";
import { UserId } from "@/types/next-auth";
import { fetchRedis } from "@/helpers/redis";

function getCredentials(){
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if(!clientId || clientId.length === 0){
        throw new Error('missing client id');
    }

    if(!clientSecret || clientSecret.length === 0){
        throw new Error('missing client secret');
    }

    return {clientId, clientSecret};
}

export const authOptions: NextAuthOptions = {
    adapter: UpstashRedisAdapter(db),
    session: {
        strategy: 'jwt' // used as session tokens
    },
    pages: {
        signIn: '/login'
    },
    providers: [
        GoogleProvider({
            clientId: getCredentials().clientId,
            clientSecret: getCredentials().clientSecret
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            try {
                if (user) {
                    token.id = user.id;
                } else if (token.id) {
                    const dbUserResult = (await fetchRedis('get', `user:${token.id}`)) as string | null;
                    if (dbUserResult) {
                        const dbUser = JSON.parse(dbUserResult) as User;
                        token.id = dbUser.id;
                        token.name = dbUser.name;
                        token.email = dbUser.email;
                        token.picture = dbUser.image;
                    }
                }
                return token;
            } catch (error) {
                console.error("JWT Callback Error:", error);
                return token;
            }
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as UserId;
                session.user.email = token.email;
                session.user.name = token.name;
                session.user.image = token.picture;
            }
            return session;
        },
        async redirect() { 
             return '/dashboard';
        }
    }
};
