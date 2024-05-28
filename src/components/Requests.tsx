"use client";

import { Check, UserPlus, X } from "lucide-react";
import { FC, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import Image from "next/image";

interface RequestsProps {
  incomingFriendRequests: IncomingFriendRequest[];
  sessionId: string;
}

const Requests: FC<RequestsProps> = ({ incomingFriendRequests, sessionId }) => {
  const router = useRouter();

  const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(
    incomingFriendRequests
  );

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_request`)
    );
    const friendRequestHandler = ({senderId, senderEmail}:IncomingFriendRequest) => {
      setFriendRequests((prev) =>[...prev, {senderId, senderEmail}])
    };
    pusherClient.bind("incoming_friend_request", friendRequestHandler);
    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_request`)
      );
      pusherClient.unbind("incoming_friend_request", friendRequestHandler);
    };
  }, [sessionId]);

  const acceptFriend = async (senderId: string) => {
    try {
      await axios.post("/api/friends/accept", { id: senderId });
      setFriendRequests((prev) =>
        prev.filter((request) => request.senderId !== senderId)
      );
      router.refresh();
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const rejectFriend = async (senderId: string) => {
    try {
      await axios.post("/api/friends/deny", { id: senderId });
      setFriendRequests((prev) =>
        prev.filter((request) => request.senderId !== senderId)
      );
      router.refresh();
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  return (
    <>
      {friendRequests.length === 0 ? (
        <p className="text-gray-400">Nothing to show...</p>
      ) : (
        friendRequests.map((r) => (
          <div key={r.senderId} className="w-full md:w-fit flex gap-4 bg-gray-800 rounded-xl p-4 items-center justify-between md:justify-center">
            <p className="font-medium text-sm md:text-lg text-gray-400">{r.senderEmail}</p>
            <div className="flex gap-2">
              <button
                className="w-6 h-6 md:w-8 md:h-8 bg-gray-400 shadow-sm hover:bg-indigo-700 flex text-white items-center justify-center transition hover:shadow-md rounded-full"
                onClick={() => acceptFriend(r.senderId)}
              >
                <Check className="w-4 h-4 md:w-3/4 md:h-3/4" />
              </button>
              <button
                className="w-6 h-6 md:w-8 md:h-8 bg-red-400 shadow-sm hover:bg-red-700 flex text-white items-center justify-center transition hover:shadow-md rounded-full"
                onClick={() => rejectFriend(r.senderId)}
              >
                <X className="w-4 h-4 md:w-3/4 md:h-3/4" />
              </button>
            </div>
          </div>
        ))
      )}
    </>
  );
};

export default Requests;
