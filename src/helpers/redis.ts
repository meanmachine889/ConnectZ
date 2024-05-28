const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
const authToken = process.env.UPSTASH_REDIS_REST_TOKEN;

type Commands = 'zrange' | 'sismember' | 'get' | 'smembers';

export async function fetchRedis(
    command: Commands,
    ...args: (string | number)[]
) {
    const commandUrl = `${upstashUrl}/${command}/${args.join('/')}`;

    

    const RESTResponse = await fetch(commandUrl, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
        cache: 'no-store'
    });

    if (!RESTResponse.ok) {
        const errorText = await RESTResponse.text();
        console.error(`Error response from Upstash Redis: ${RESTResponse.status} - ${RESTResponse.statusText} - ${errorText}`);
        throw new Error(`Error response from Upstash Redis: ${RESTResponse.status} - ${RESTResponse.statusText}`);
    }

    const data = await RESTResponse.json();
    
    return data.result;
}
