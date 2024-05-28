import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { fetchRedis } from "@/helpers/redis";
import { db } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { id: idToAdd } = z.object({ id: z.string() }).parse(body);
        

        const session = await getServerSession(authOptions);

        if (!session) {
            return new Response('unauthorized', { status: 401 });
        }

        

        const alreadyFriend = await fetchRedis('sismember', `user:${session.user.id}:friends`, idToAdd);

        

        if (alreadyFriend) {
            return new Response('already friends', { status: 400 });
        }

        const friendRequest = await fetchRedis('sismember', `user:${session.user.id}:incoming_friend_request`, idToAdd);

        

        if (!friendRequest) {
            return new Response('no friend request found', { status: 400 });
        }

        await db.sadd(`user:${session.user.id}:friends`, idToAdd);
        await db.sadd(`user:${idToAdd}:friends`, session.user.id);
        await db.srem(`user:${session.user.id}:incoming_friend_request`, idToAdd);

        const req1 = await fetchRedis('sismember', `user:${idToAdd}:incoming_friend_request`, session.user.id);

        if(req1){
            await db.srem(`user:${idToAdd}:incoming_friend_request`, session.user.id);
        }

        return new Response('OK');
    } catch (error) {
        console.error("Error in POST /api/friends/accept:", error);

        if (error instanceof z.ZodError) {
            return new Response('invalid request payload', { status: 422 });
        }

        return new Response('internal server error', { status: 500 });
    }
}
