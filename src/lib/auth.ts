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
        strategy: 'jwt'
    },
    pages: {
        signIn: '/login'
    },
    providers: [
        GoogleProvider({
            clientId: getCredentials().clientId,
            clientSecret: getCredentials().clientSecret,
            // Add these to control timeout and retries
            checks: ['pkce', 'state'],
            authorization: {
                params: {
                    prompt: 'consent',
                    access_type: 'offline',
                    response_type: 'code'
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            // Use Promise.race to set an internal timeout
            try {
                const userFetch = new Promise(async (resolve, reject) => {
                    if (user) {
                        token.id = user.id;
                        resolve(token);
                    } else if (token.id) {
                        try {
                            const dbUserResult = await fetchRedis('get', `user:${token.id}`);
                            if (dbUserResult) {
                                const dbUser = JSON.parse(dbUserResult);
                                token.id = dbUser.id;
                                token.name = dbUser.name;
                                token.email = dbUser.email;
                                token.picture = dbUser.image;
                            }
                            resolve(token);
                        } catch (error) {
                            reject(error);
                        }
                    } else {
                        resolve(token);
                    }
                });

                // Set a 5-second timeout
                return await Promise.race([
                    userFetch,
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('User fetch timeout')), 5000)
                    )
                ]);
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
        async redirect({ url, baseUrl }) { 
            // More explicit redirect handling
            return url.startsWith(baseUrl) ? url : '/dashboard';
        }
    },
    // Add global timeout configuration
    debug: process.env.NODE_ENV === 'development',
    logger: {
        error(code, metadata) {
            console.error(code, metadata);
        },
        warn(code) {
            console.warn(code);
        }
    }
};