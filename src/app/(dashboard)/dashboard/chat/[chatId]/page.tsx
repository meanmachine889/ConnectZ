import { fetchRedis } from "@/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { messageArrayValidator } from "@/lib/validations/message";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FC } from "react";
import Image from "next/image";
import Messages from "@/components/Messages";
import ChatInput from "@/components/ChatInput";

interface PageProps {
    params: {
        chatId: string;
    };
}

async function getChatMessages(chatId: string) {
    try {
        const result: string[] = await fetchRedis('zrange', `chat:${chatId}:messages`, 0, -1);
        
        const dbMessages = result.map((message) => JSON.parse(message) as Message);

        const reversedMessages = dbMessages.reverse();

        const messages = messageArrayValidator.parse(reversedMessages);

        return messages;
    } catch (error) {
        console.error(error);
        notFound();
    }
}


const page: FC<PageProps> = async ({ params } : PageProps) => {
    const { chatId } = params;
    const session = await getServerSession(authOptions);

    if (!session) {
        notFound();
    }

    const { user } = session;

    const [userId1, userId2] = chatId.split("--");

    if (user.id !== userId1 && user.id !== userId2) {
        notFound();
    }

    const chatPartnerId = user.id === userId1 ? userId2 : userId1;
    const chatPartnerRaw = (await fetchRedis('get', `user:${chatPartnerId}`)) as string;
    const chatPartner = JSON.parse(chatPartnerRaw) as User;
    const initialMessages = await getChatMessages(chatId);

    return (
        <div className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]">
            <div className=" mb-2 flex sm:items-center justify-between py-3 border-b border-gray-700">
                <div className="relative flex items-center space-x-4">
                    <div className="relative">
                        <div className="relative w-8 sm:w-12 h-8 sm:h-12">
                            <Image src={chatPartner.image} fill referrerPolicy="no-referrer" alt={chatPartner.name} className="rounded-full" />
                        </div>
                    </div>
                    <div className="flex flex-col leading-tight">
                        <div className="text-xl flex items-center">
                            <span className="text-gray-300 mr-3 font-semibold">{chatPartner.name}</span>
                        </div>
                        <span className="text-sm text-gray-400">{chatPartner.email}</span>
                    </div>
                </div>
            </div>
            <Messages chatId={chatId} initialMessages={initialMessages} sessionId={session.user.id} sessionImg={session.user.image} chatPartner={chatPartner}/>
            <ChatInput chatPartner={chatPartner} chatId={chatId} />
        </div>
    );
};

export default page;
