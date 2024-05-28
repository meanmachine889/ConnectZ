import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FC, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import SignOutButton from "@/components/SignOutButton";
import FriendRequests from "@/components/FriendRequests";
import { fetchRedis } from "@/helpers/redis";
import getFriendsByuserId from "@/helpers/get-friends-by-user-id";
import SideBarChatList from "@/components/SideBarChatList";
import SideBarOption from "@/types/typings";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MobileChatLayout from "@/components/MobileChatLayout";

interface LayoutProps {
  children: ReactNode;
}

const sideBarOptions: SideBarOption[] = [
  {
    id: 1,
    name: "Add Friend",
    href: "/dashboard/add",
    Icon: "UserPlus",
  },
];

const Layout: FC<LayoutProps> = async ({ children }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    notFound();
  }

  const friends = await getFriendsByuserId(session.user.id);

  const reqCount = (
    (await fetchRedis(
      "smembers",
      `user:${session.user.id}:incoming_friend_request`
    )) as User[]
  ).length;

  return (
    <div className="w-full flex h-screen">
      <div className="md:hidden">
        <MobileChatLayout
          friends={friends}
          session={session}
          SideBarChatOptions={sideBarOptions}
          unseenRequestCount={reqCount}
        />
      </div>
      <div className="hidden md:flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto bg-gradient-to-r from-gray-900 to-black px-6">
        <Link href="/dashboard" className="flex h-16 justify-left items-center w-fit mt-6 -mx-8 p-0">
          <span className="text-white p-0 m-0">
          <svg width="100" height="80" viewBox="0 0 318 555" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M284 289.2L279.2 352C272.267 363.467 263.467 373.733 252.8 382.8C242.4 391.6 230 398.667 215.6 404C201.467 409.067 185.2 411.6 166.8 411.6C139.067 411.333 114.4 405.2 92.8 393.2C71.2 381.2 54.2667 364.4 42 342.8C30 320.933 24 295.2 24 265.6C24 236.533 30 211.2 42 189.6C54 167.733 70.8 150.8 92.4 138.8C114.267 126.533 139.867 120.4 169.2 120.4C188.933 120.4 206.667 123.067 222.4 128.4C238.4 133.467 252.267 139.867 264 147.6L272 204H268.4C262.533 180.533 250.533 162.8 232.4 150.8C214.267 138.533 193.2 132.4 169.2 132.4C145.733 132.4 125.333 138 108 149.2C90.9333 160.133 77.6 175.6 68 195.6C58.6667 215.333 54 238.533 54 265.2C54 291.867 58.6667 315.2 68 335.2C77.6 355.2 90.8 370.8 107.6 382C124.667 393.2 144.4 399.067 166.8 399.6C185.733 399.6 203.2 396.133 219.2 389.2C235.467 382 249.067 370.4 260 354.4C270.933 338.133 277.867 316.4 280.8 289.2H284Z" fill="#5D17EB"/>
          <path d="M280.499 14.906L317.637 14.906L181.425 292.151L144 292.151L280.499 14.906Z" fill="#5D17EB"/>
          <line x1="144" y1="15" x2="318" y2="15" stroke="#5D16EC" stroke-width="8"/>
          <line x1="144" y1="292" x2="318" y2="292" stroke="#5D16EC" stroke-width="8"/>
          </svg>
          </span>
          <h1 className="text-indigo-200 text-4xl ml-[-1rem]"><span className="text-5xl">C</span>onnect <span className="text-5xl">Z</span></h1>
        </Link>
        {friends.length > 0 && (
          <div className="text-xl font-semibold leading-6 text-gray-400">
            Chats
          </div>
        )}
        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <SideBarChatList sessionId={session.user.id} friends={friends} />
            </li>
            <li>
              <div className="text-xl mb-4 font-semibold leading-6 text-gray-400">
                Overview
              </div>
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {sideBarOptions.map((option) => (
                  <li key={option.id}>
                    <Link
                      href={option.href}
                      className="text-gray-200 bg-gray-700 hover:bg-gray-800 p-4 hover:bg-gray-100 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold items-center"
                    >
                      <span className="text-gray-400 border-gray-200 group-hover:border-indigo-400 group-hover:text-indigo-400 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[0.625rem] font-md">
                        <FavoriteIcon className="h-7 w-7" />
                      </span>
                      <span className="truncate text-lg">{option.name}</span>
                    </Link>
                  </li>
                ))}
                <li>
                  <FriendRequests
                    sessionId={session.user.id}
                    initialCount={reqCount}
                  />
                </li>
              </ul>
            </li>
            <li className="mt-auto flex flex-col items-left justify-left w-full">
              <div className="flex flex-1 items-center gap-x-4 py-3 text-sm font-semibold leading-6 text-gray-400">
                <div className="relative h-8 w-8 bg-gray-50 rounded-full">
                  <Image
                    fill
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                    src={session.user.image || " "}
                    alt="profile image"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-300">{session.user.name}</span>
                  <span className="truncate text-xs text-zinc-400">
                    {session.user.email}
                  </span>
                </div>
              </div>
              <SignOutButton className="h-full text-gray-200 px-6" />
            </li>
          </ul>
        </nav>
      </div>
      <aside className="max-h-screen container py-16 md:py-12 w-full">
        {children}
      </aside>
    </div>
  );
};

export default Layout;
