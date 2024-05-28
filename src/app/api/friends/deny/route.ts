import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { db } from "@/lib/db";

export async function POST(req : Request){
    try {
        const body = await req.json();
        const session = await getServerSession(authOptions)

        if(!session){
            throw new Response('unauthorized', {status:401});
        }

        const {id: idToDeny} = z.object({id: z.string()}).parse(body);

        await db.srem(`user:${session.user.id}:incoming_friend_request`, idToDeny)

        return new Response('OK', {status:200});
    } catch (error) {
        console.error("Error in POST /api/friends/accept:", error);

        if(error instanceof z.ZodError){
            return new Response('invalid request payload', {status:422});
        }
    }
}