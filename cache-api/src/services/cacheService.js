import redis from "../configs/redis.js";

export async function getCachedProduct(slug) {

    const key = `product:${slug}`;

    const cached = await redis.get(key);

    if (!cached) {
        return null;
    }

    return JSON.parse(cached);
}

export async function cacheProduct(slug, product, ttl) {

    const key = `product:${slug}`;

    await redis.set(
        key,
        JSON.stringify(product),
        {
            EX: ttl
        }
    );
}