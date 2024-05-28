'use client'

import { chatHrefConstructor, toPusherKey } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import Image from "next/image";
import { pusherClient } from "@/lib/pusher";
import toast from "react-hot-toast";
import UnseenToast from "./UnseenToast";

interface SideBarChatListProps {
    friends: User[],
    sessionId: string
}

interface ExtendedMessage extends Message {
    senderImg: string
    senderName: string
}

const SideBarChatList: FC<SideBarChatListProps> = ({ friends, sessionId }) => {

    const router = useRouter();
    const pathname = usePathname();

    const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
    const [activeChat, setChat] = useState<User[]>(friends)

    useEffect(() => {
        const chatChannel = toPusherKey(`user:${sessionId}:chats`);
        const friendsChannel = toPusherKey(`user:${sessionId}:friends`);

        pusherClient.subscribe(chatChannel);
        pusherClient.subscribe(friendsChannel);

        console.log(`Subscribed to Pusher channels: ${chatChannel} and ${friendsChannel}`);

        const newFriendHandler = (newFriend: User) => {
            setChat((prev) => [...prev, newFriend])
        };

        const chatHandler = (message: ExtendedMessage) => {
            console.log('Received new message:', message);

            const isInCurrentChat = pathname === `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`;

            if (isInCurrentChat) return;

            toast.custom((t) => (
                <UnseenToast
                    t={t}
                    sessionId={sessionId}
                    senderId={message.senderId}
                    senderImage={message.senderImg}
                    senderMsg={message.text}
                    senderName={message.senderName}
                />
            ));

            setUnseenMessages((prev) => [...prev, message]);
        };

        pusherClient.bind('new_message', chatHandler);
        pusherClient.bind('new_friend', newFriendHandler);

        return () => {
            pusherClient.unsubscribe(chatChannel);
            pusherClient.unsubscribe(friendsChannel);
            pusherClient.unbind('new_message', chatHandler);
            pusherClient.unbind('new_friend', newFriendHandler);
        };
    }, [pathname, sessionId, router]);

    useEffect(() => {
        if (pathname?.includes('chat')) {
            setUnseenMessages((prev) => {
                return prev.filter((msg) => !pathname.includes(msg.senderId));
            });
        }
    }, [pathname]);

    return (
        <ul role="list" className="h-fit p-2 w-[100%] scrollbar-w-2 scrollbar-track-dark scrollbar-thumb-darker scrollbar-thumb-rounded scrolling-touch overflow-y-auto rounded-lg bg-black pl-2 pt-2 shadow-xl space-y-1 max-h-[14.7rem]">
            {friends.sort().map((friend) => {
                const unseenMessagesCount = unseenMessages.filter((unseenMsg) => unseenMsg.senderId === friend.id).length;

                return (
                    <li key={friend.id} className="bg-gray-800 shadow-xl rounded-lg hover:rounded-xl w-[100%] -mr-9">
                        <a href={`/dashboard/chat/${chatHrefConstructor(sessionId, friend.id)}`} className="text-gray-200 hover:bg-gray-700 group flex items-center rounded-xl gap-x-3 p-2 text-sm leading-6">
                            <div className="h-[2rem] w-[2rem] relative">
                                <Image src={friend.image} referrerPolicy="no-referrer" fill alt={friend.name} className="rounded-full" />
                            </div>
                            {friend.name}
                            {unseenMessagesCount > 0 && (
                                <div className="bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center">
                                    {unseenMessagesCount}
                                </div>
                            )}
                        </a>
                    </li>
                );
            })}
        </ul>
    );
};

export default SideBarChatList;
