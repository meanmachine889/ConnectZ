"use client";

import { cn } from "@/lib/utils";
import { FC, useRef, useState, useEffect } from "react";
import { Message } from "@/lib/validations/message";
import { format } from 'date-fns';
import Image from "next/image";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";


interface MessageProps {
  initialMessages: Message[];
  sessionId: string;
  chatId:string
  sessionImg: string|null|undefined;
  chatPartner: User
}

const Messages: FC<MessageProps> = ({ initialMessages, sessionId, chatId, sessionImg, chatPartner }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`chat:${chatId}`)
    );

    const messsageHandler = (message:Message) => {
      setMessages((prev) => [message, ...prev])
    };

    pusherClient.bind("incoming-message", messsageHandler);
    
    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`chat:${chatId}`)
      );
      pusherClient.unbind("incoming-message", messsageHandler);
    };
  }, [chatId]);

  const scrollDownRef = useRef<HTMLDivElement | null>(null);

  const formatTimestamp = (timestamp: number) => {
    return format(timestamp, 'HH:mm')
  }

  return (
    <div
      id="messages"
      className="z-[-1] rounded-xl flex bg-gradient-to-r from-gray-900 to-black h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-dark scrollbar-w-2 scrolling-touch"
    >
      <div ref={scrollDownRef} />
      {messages.map((message, index) => {
        const isCurrentUser = message.senderId === sessionId;
        const hasNextSameUser =
          messages[index - 1]?.senderId === messages[index].senderId;

        return (
          <div key={`${message.id}-${message.timestamp}`}>
            <div
              className={cn("flex items-end", { "justify-end": isCurrentUser })}
            >
              <div
                className={cn(
                  "flex flex-col space-y-2 text-base max-w-xs mx-2",
                  {
                    "order-1 items-end": isCurrentUser,
                    "order-2 items-start": !isCurrentUser,
                  }
                )}
              >
                <span
                  className={cn("px-4 py-2 rounded-lg inline-block", {
                    "bg-indigo-400 text-gray-900": isCurrentUser,
                    "bg-indigo-200 text-gray-900": !isCurrentUser,
                    "rounded-br-none": !hasNextSameUser && isCurrentUser,
                    "rounded-bl-none": !hasNextSameUser && !isCurrentUser,
                  })}
                >
                  {message.text}{" "}
                  <span className="ml-2 text-xs text-gray-700">
                    {formatTimestamp(message.timestamp)}
                  </span>
                </span>
              </div>

              <div className={cn('relative w-6 h-6', {
                'order-2' : isCurrentUser,
                'order-1': !isCurrentUser,
                'invisible': hasNextSameUser
              })}>
                <Image alt="profile picture" fill src={isCurrentUser ? (sessionImg as string) : chatPartner.image} className="rounded-full" referrerPolicy="no-referrer"/>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
