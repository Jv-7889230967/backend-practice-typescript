import { createClient } from "redis";

const connectRedis = async () => {
    try {
        const client = createClient();
        client.on('error', err => console.log('Redis Client Error', err));

        await client.connect();
        console.log('Connected to Redis');
    } catch (error: any) {
        console.log("Errr occurred while connecting to redis DB", error)
    }
}

export default connectRedis;