import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { addFriendValidator } from "@/lib/validations/addFriend";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {email: emailToAdd} = addFriendValidator.parse(body.email);

        const idToAdd = await fetchRedis('get', `user:email:${emailToAdd}`) as string

        
        const session = await getServerSession(authOptions);

        if(!idToAdd){
            return new Response('Account not found', {status: 400});
        }

        if(!session){
            return new Response('Unauthorized', {status: 401});
        }

        if(idToAdd === session.user.id){
            return new Response("Can't add yourself as a friend", {status:400});
        }

        pusherServer.trigger(
            toPusherKey(`user:${idToAdd}:incoming_friend_request`),
            'incoming_friend_request',
            {
                senderId: session.user.id,
                senderEmail: session.user.email
            }
        )

        db.sadd(`user:${idToAdd}:incoming_friend_request`, session.user.id)

        

        return new Response('sent')

    } catch (error) {
        if(error instanceof z.ZodError){
            return new Response('invalid request', {status:422})
        }
        return new Response("something went wrong", {status:400});
    }
}