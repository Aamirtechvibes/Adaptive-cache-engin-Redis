import "dotenv/config";
import express from "express";
import cors from "cors";
import redis from "./configs/redis.js";
import productRoutes from "./routes/products.js";
import { getMetrics } from "./services/metricsService.js";
import simulatorRoutes from "./routes/simulator.js";
import cacheRoutes from "./routes/cache.js";
import resetRouter from "./routes/reset.js";



const app = express();

app.use(cors());
app.use(express.json());
app.use("/simulate", simulatorRoutes);
app.use("/products", productRoutes);
app.use("/cache", cacheRoutes);
app.use("/reset", resetRouter);

app.get("/", (req, res) => {
    res.json({
        message: "Adaptive Cache API is running"
    });
});

app.get("/metrics", async (req, res) => {

    const metrics = await getMetrics();

    res.json(metrics);
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});