import AddFriendButton from "@/components/AddFriendsButton";
import { FC } from "react";

const page:FC = () =>{
    return(
        <main className="pt-8">
            <h1 className="font-bold text-5xl mb-8 text-gray-200">Connect With A Friend</h1>
            <AddFriendButton/>
        </main>
    )
}

export default page;