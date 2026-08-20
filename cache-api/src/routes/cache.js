import express from "express";
import redis from "../configs/redis.js";
import {
    getTrafficStatus
} from "../services/adaptivePolicy.js";

const router = express.Router();


router.get("/product/:slug", async (req, res) => {
    try {
        const { slug } = req.params;

        // Current traffic count
        const trafficKey = `traffic:${slug}`;

        // Your traffic service currently stores requests in Redis.
        // If using a Sorted Set:
        const traffic = await redis.zCard(trafficKey);

        // Actual remaining TTL from Redis
        const ttl = await redis.ttl(`product:${slug}`);

        const status = getTrafficStatus(traffic);

        res.json({
            slug,
            traffic,
            ttl,
            status
        });

    } catch (error) {
        console.error("Cache product error:", error);

        res.status(500).json({
            message: "Failed to get cache data"
        });
    }
});


export default router;