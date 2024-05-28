'use client'

import { User } from "lucide-react";
import { FC, useEffect, useState } from "react";
import Link from "next/link";
import { pusherClient } from "@/lib/pusher";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import PersonIcon from '@mui/icons-material/Person';

interface FriendRequestsProps {
    sessionId: string
    initialCount: number
}

const FriendRequests: FC<FriendRequestsProps> = ({sessionId, initialCount}) => {

    const [reqcount, setreqcount] = useState<number>(initialCount)

    useEffect(() => {
        pusherClient.subscribe(
          toPusherKey(`user:${sessionId}:incoming_friend_request`)
        );
        const friendRequestHandler = () => {
          setreqcount((prev) => prev+1)
        };
        pusherClient.bind("incoming_friend_request", friendRequestHandler);
        return () => {
          pusherClient.unsubscribe(
            toPusherKey(`user:${sessionId}:incoming_friend_request`)
          );
          pusherClient.unbind("incoming_friend_request", friendRequestHandler);
        };
      }, [sessionId]);

    return (
        <Link href="/dashboard/requests">
            <div className="text-gray-200 hover:bg-gray-800 bg-gray-700 shadow-xl p-4 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold">
                <div className="text-gray-400 group-hover:border-indigo-600 group-hover:text-indigo-400 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[0.625rem] font-md">
                    <PersonIcon className="h-7 w-7"/>
                </div>
                <p className="truncate text-lg">Friend Requests</p>
                {reqcount > 0 ? (
                    <div className="rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-indigo-600">{reqcount}</div>
                ):null}
            </div>
        </Link>
    );
}

export default FriendRequests;
