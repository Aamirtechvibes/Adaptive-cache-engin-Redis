import express from "express";
import redis from "../configs/redis.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const keys = await redis.keys("*");

    const demoKeys = keys.filter(
      (key) =>
        key.startsWith("product:") ||
        key.startsWith("traffic:") ||
        key.startsWith("metrics:")
    );

    if (demoKeys.length > 0) {
      await redis.del(demoKeys);
    }

    return res.json({
      success: true,
      message: "Demo reset successfully",
      deletedKeys: demoKeys.length
    });
  } catch (error) {
    console.error("Reset failed:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reset demo"
    });
  }
});

export default router;