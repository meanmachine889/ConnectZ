import FriendRequests from "@/components/FriendRequests";
import Requests from "@/components/Requests";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";


const page = async ({}) =>{
    const session = await getServerSession(authOptions);
    if(!session) notFound();

    const sendersId = await fetchRedis('smembers', `user:${session.user.id}:incoming_friend_request`) as string[];

    const incomingFriendRequests = await Promise.all(
        sendersId.map(async (senderId) =>{
            const s = await fetchRedis('get', `user:${senderId}`) as string
            const sender = JSON.parse(s);
            return {
                senderId,
                senderEmail: sender.email
            }
        })
    )

    return(
        <main className="pt-8">
            <h1 className="font-bold text-5xl text-gray-200 mb-8">Connection Requests</h1>
            <div className="flex flex-col gap-4">
                <Requests incomingFriendRequests={incomingFriendRequests} sessionId={session.user.id}/>
            </div>
        </main>
    )
}

export default page;