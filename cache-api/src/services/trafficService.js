import redis from "../configs/redis.js";

const WINDOW = 60;

export async function trackTraffic(productId) {
    const key = `traffic:${productId}`;
    const now = Date.now();

    const eventId = `${now}-${Math.random()}`;

    await redis.zAdd(key, {
        score: now,
        value: eventId
    });
    

    const cutoff = now - WINDOW * 1000;

    await redis.zRemRangeByScore(
        key,
        0,
        cutoff
    );

    const requests = await redis.zCard(key);
    //const traffic = await redis.zCard(trafficKey);

    await redis.expire(key, WINDOW + 10);

    return requests;
}