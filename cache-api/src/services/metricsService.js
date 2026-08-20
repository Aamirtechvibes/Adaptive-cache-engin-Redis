import redis from "../configs/redis.js";

const METRICS_KEY = "cache:metrics";

export async function recordCacheHit() {
    await redis.hIncrBy(METRICS_KEY, "hits", 1);
}

export async function recordCacheMiss() {
    await redis.hIncrBy(METRICS_KEY, "misses", 1);
}

export async function recordDatabaseRequest() {
    await redis.hIncrBy(METRICS_KEY, "dbRequests", 1);
}

export async function getMetrics() {
    const metrics = await redis.hGetAll(METRICS_KEY);

    const hits = Number(metrics.hits || 0);
    const misses = Number(metrics.misses || 0);
    const dbRequests = Number(metrics.dbRequests || 0);

    const totalRequests = hits + misses;

    return {
        totalRequests,
        hits,
        misses,
        dbRequests,
        hitRate: totalRequests
            ? ((hits / totalRequests) * 100).toFixed(2)
            : "0.00"
    };
}