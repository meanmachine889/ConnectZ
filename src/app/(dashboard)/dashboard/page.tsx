import getFriendsByuserId from "@/helpers/get-friends-by-user-id";
import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { chatHrefConstructor } from "@/lib/utils";
import { ArrowUpRightSquare, ArrowUpSquare, ArrowUpSquareIcon, ChevronRight, Link2 } from "lucide-react";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FC } from "react";
import Image from "next/image";
import Link from "next/link";

interface PageProps {};

const page: FC<PageProps> = async ({}) => {

  const session = await getServerSession(authOptions);

  if (!session) notFound();

  const friends = await getFriendsByuserId(session.user.id);

  const friendsWithLastMsg = await Promise.all(
    friends.map(async (friend) => {
      const lastMsgRaw = await fetchRedis('zrange', `chat:${chatHrefConstructor(session.user.id, friend.id)}:messages`, -1, -1) as string[];
      
      let lastMsg = null;

      if (lastMsgRaw.length > 0) {
        try {
          lastMsg = JSON.parse(lastMsgRaw[0]) as Message;
        } catch (error) {
          console.error('Failed to parse message:', error);
        }
      }

      return {
        ...friend,
        lastMsg
      };
    })
  );

  return (
    <div className="container py-12 bg-gradient-to-b from-gray-900 to-black h-full rounded-2xl">
      <h1 className="font-semibold text-5xl mb-6 text-gray-200">Recent Chats</h1>
      {friendsWithLastMsg.length === 0 ? (
        <p className="text-sm text-zinc-500">Nothing to show here...</p>
      ) : (
        <div className="space-y-4 overflow-y-auto h-[70vh] px-4 scrollbar-w-2 scrollbar-track-dark scrollbar-thumb-darker scrollbar-thumb-rounded">
          {friendsWithLastMsg.map((friend) => (
            <Link key={friend.id} href={`/dashboard/chat/${chatHrefConstructor(session.user.id, friend.id)}`} className="flex items-center bg-gray-800 p-4 rounded-xl transition hover:bg-gray-700">
              <div className="relative flex-shrink-0 h-12 w-12 mr-4">
                <Image referrerPolicy="no-referrer" className="rounded-full" alt={friend.name} src={friend.image} fill />
              </div>
              <div className="flex-grow">
                <h4 className="text-lg text-gray-200">{friend.name}</h4>
                <p className="mt-1 text-sm text-zinc-500">
                  {friend.lastMsg ? (
                    <>
                      <span className="text-zinc-400">
                        {friend.lastMsg.senderId === session.user.id ? 'You: ' : `${friend.name}: `}
                      </span>
                      {friend.lastMsg.text}
                    </>
                  ) : (
                    <span className="text-zinc-400">No messages yet</span>
                  )}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default page;
