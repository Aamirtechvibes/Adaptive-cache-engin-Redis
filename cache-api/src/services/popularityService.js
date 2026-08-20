import redis from "../configs/redis.js";

const POPULARITY_KEY = "products:popularity";

export async function trackProduct(slug) {

    await redis.zIncrBy("products:popularity", 1, productId)
    // await redis.zIncrBy(
    //     POPULARITY_KEY,
    //     1,
    //     slug
    // );
}