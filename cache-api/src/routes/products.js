import express from "express";
import supabase from "../configs/supabase.js";
import {
    getCachedProduct,
    cacheProduct
} from "../services/cacheService.js";
import {
    trackTraffic
} from "../services/trafficService.js";
import redis from "../configs/redis.js";
import { calculateTTL } from "../services/adaptivePolicy.js";
import { recordCacheHit,
    recordCacheMiss,
    recordDatabaseRequest } from "../services/metricsService.js";

const router = express.Router();

router.get("/:slug", async (req, res) => {

    const { slug } = req.params;

    // Track current traffic
    const requestsPerMinute = await trackTraffic(slug);

    // Calculate adaptive TTL
    const ttl = calculateTTL(requestsPerMinute);

    // 1. Check Redis first
    const cachedProduct = await getCachedProduct(slug);

    // CACHE HIT
    if (cachedProduct) {

        await recordCacheHit();

        // Update TTL based on current traffic
        await redis.expire(
            `product:${slug}`,
            ttl
        );

        return res.json({
            source: "redis",
            cacheHit: true,
            ttl,
            requestsPerMinute,
            data: cachedProduct
        });
    }

    // CACHE MISS
    await recordCacheMiss();

    // This request is now going to Supabase
    await recordDatabaseRequest();

    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

    if (error) {
        return res.status(500).json({
            message: "Database error",
            error: error.message
        });
    }

    if (!data) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    // Store product in Redis with adaptive TTL
    await cacheProduct(slug, data, ttl);

    return res.json({
        source: "supabase",
        cacheHit: false,
        ttl,
        requestsPerMinute,
        data
    });

});


export default router;



// router.get("/:slug", async (req, res) => {

//     const { slug } = req.params;
//     const requestsPerMinute = await trackTraffic(slug);

//     const ttl = calculateTTL(requestsPerMinute);
//     // 1. Check Redis first
//     const cachedProduct = await getCachedProduct(slug);
//     await recordCacheHit();
//     await redis.expire(
//         `product:${slug}`,
//         ttl
//     );
//     if (cachedProduct) {
//         return res.json({
//             source: "redis",
//             cacheHit: true,
//             data: cachedProduct
//         });
//     }

//     // 2. Cache MISS → go to Supabase
//     await recordCacheHit();
//     const { data, error } = await supabase
//         .from("products")
//         .select("*")
//         .eq("slug", slug)
//         .maybeSingle();

//     if (error) {
//         return res.status(500).json({
//             message: "Database error",
//             error: error.message
//         });
//     }

//     if (!data) {
//         return res.status(404).json({
//             message: "Product not found"
//         });
//     }

//     // 3. Store the product in Redis
//     await cacheProduct(slug, data, ttl);

//     // 4. Return database result
//     return res.json({
//         source: "supabase",
//         cacheHit: false,
//         data
//     });

    
// });

