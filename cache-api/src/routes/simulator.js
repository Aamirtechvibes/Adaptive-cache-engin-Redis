import express from "express";

const router = express.Router();

router.post("/spike", async (req, res) => {
    try {
        const {
            productSlug,
            requestsPerSecond = 1,
            duration = 10
        } = req.body;

        if (!productSlug) {
            return res.status(400).json({
                message: "productSlug is required"
            });
        }

        console.log("🚀 Traffic simulation started:", {
            productSlug,
            requestsPerSecond,
            duration
        });

        // Respond immediately
        res.json({
            message: "Traffic simulation started 🚀",
            productSlug,
            requestsPerSecond,
            duration,
            totalExpectedRequests:
                requestsPerSecond * duration
        });

        // Generate traffic in background
        for (let second = 0; second < duration; second++) {

            const requests = [];

            for (
                let i = 0;
                i < requestsPerSecond;
                i++
            ) {
                requests.push(
                    fetch(
                        `http://localhost:3000/products/${productSlug}`
                    ).catch((error) => {
                        console.error(
                            "Simulation request failed:",
                            error.message
                        );
                    })
                );
            }

            await Promise.all(requests);

            console.log(
                `Second ${second + 1}/${duration} completed`
            );

            await new Promise((resolve) =>
                setTimeout(resolve, 1000)
            );
        }

        console.log("✅ Traffic simulation completed");

    } catch (error) {
        console.error("Simulator error:", error);
    }
});

export default router;