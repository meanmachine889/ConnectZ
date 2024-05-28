import { fetchRedis } from "./redis"


async function getFriendsByuserId(userId:string){
    const friendsIds = (await fetchRedis(
        'smembers',
        `user:${userId}:friends`
    )) as string[]

    const friends = await Promise.all(
        friendsIds.map(async (friendId) => {
            const friend = await fetchRedis('get', `user:${friendId}`) as string
            const f = JSON.parse(friend) as User
            return f
        })
    )

    return friends;
}

export default getFriendsByuserId;