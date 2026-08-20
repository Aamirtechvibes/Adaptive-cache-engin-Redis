import { useEffect, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

const PRODUCTS = [
  {
    name: "1 Urban Eclipse Shoulder Bag",
    slug: "urban-eclipse-shoulder-bag"
  },
  {
    name: "2 Midnight Lock Pouch",
    slug: "midnight-lock-pouch"
  },

  // Add your remaining real product slugs here
  {
    name: "3 Everyday Leather Carry",
    slug: "everyday-soft-leather-carry"
  },
  {
    name: "4 Noir Atelier Tote",
    slug: "noir-atelier-tote"
  },
  {
    name: "5 Classic Day Mini",
    slug: "classic-day-mini"
  },
  {
    name: "6 Luxury Structured Carry",
    slug: "luxury-structured-carry"
  },
  {
    name: "7 Premium Shoulder Bag",
    slug: "premium-chain-shoulder-bag"
  },
  {
    name: "8 Elegant Office Tote",
    slug: "elegant-office-tote"
  },
  {
    name: "9 Gift Edit Mini Carry",
    slug: "gift-edit-mini-carry"
  },
  {
    name: "10 Sand Dune Crossbody",
    slug: "sand-dune-crossbody"
  },
  {
    name: "11 Cloudline Carryall",
    slug: "cloudline-carryall"
  },
  {
    name: "12 Cedar Travel Clutch",
    slug: "cedar-travel-clutch"
  }
];

function App() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productSlug, setProductSlug] = useState(
    PRODUCTS[0].slug
  );

  const [productData, setProductData] = useState(null);
  const [productsData, setProductsData] = useState([]);

  const [isSimulating, setIsSimulating] = useState(false);

  async function simulateTraffic(mode) {

    if (isSimulating) {
      console.log("Simulation already running");
      return;
    }

    const selectedMode = trafficModes[mode];

    if (!selectedMode) return;

    setIsSimulating(true);

    try {

      const response = await fetch(
        `${API_URL}/simulate/spike`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            productSlug,
            requestsPerSecond:
              selectedMode.requestsPerSecond,
            duration:
              selectedMode.duration
          })
        }
      );

      const data = await response.json();

      console.log("Simulation started:", data);

      // Keep button disabled until simulation should finish
      setTimeout(() => {
        setIsSimulating(false);
      }, selectedMode.duration * 1000);

    } catch (error) {

      console.error("Traffic simulation failed:", error);

      setIsSimulating(false);

    }

  }
  async function fetchProductData() {
    try {
      const response = await fetch(
        `${API_URL}/cache/product/${productSlug}`
      );

      const data = await response.json();

      setProductData(data);

    } catch (error) {
      console.error(
        "Failed to fetch product cache data:",
        error
      );
    }
  }

  const trafficModes = {
    COLD: {
      requestsPerSecond: 1,
      duration: 5
    },

    WARM: {
      requestsPerSecond: 3,
      duration: 10
    },

    HOT: {
      requestsPerSecond: 5,
      duration: 15
    }
  };
  // const trafficModes = {
  //   COLD: {
  //     requestsPerSecond: 1,
  //     duration: 10
  //   },

  //   WARM: {
  //     requestsPerSecond: 3,
  //     duration: 40
  //   },

  //   HOT: {
  //     requestsPerSecond: 10,
  //     duration: 60
  //   }
  // };

  async function simulateTraffic(mode) {
    const selectedMode = trafficModes[mode];

    if (!selectedMode) {
      console.error("Invalid traffic mode:", mode);
      return;
    }

    const {
      requestsPerSecond,
      duration
    } = selectedMode;

    console.log("🚀 Starting simulation:", {
      mode,
      productSlug,
      requestsPerSecond,
      duration
    });

    const intervalTime = 1000 / requestsPerSecond;

    const totalRequests =
      requestsPerSecond * duration;

    let requestsSent = 0;

    const interval = setInterval(() => {

      if (requestsSent >= totalRequests) {
        clearInterval(interval);

        console.log("✅ Traffic simulation completed");

        return;
      }

      fetch(
        `${API_URL}/products/${productSlug}`
      )
        .then((response) => response.json())
        .then(() => {
          requestsSent++;
        })
        .catch((error) => {
          console.error(
            "Request failed:",
            error
          );
        });

    }, intervalTime);
  }

  async function fetchMetrics() {
    try {
      const response = await fetch(`${API_URL}/metrics`);
      const data = await response.json();

      setMetrics(data);
    } catch (error) {
      console.error("Failed to fetch metrics:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchAllProductsData() {
    try {

      const results = await Promise.all(
        PRODUCTS.map(async (product) => {

          const response = await fetch(
            `${API_URL}/cache/product/${product.slug}`
          );

          const cacheData = await response.json();

          return {
            name: product.name,
            slug: product.slug,
            traffic: cacheData.traffic,
            ttl: cacheData.ttl,
            status: cacheData.status
          };

        })
      );

      const topProducts = results
        .sort((a, b) => b.traffic - a.traffic)
        .slice(0, 4);

      setProductsData(topProducts);

    } catch (error) {

      console.error(
        "Failed to fetch all products data:",
        error
      );

    }
  }

  useEffect(() => {
    fetchProductData();

    const interval = setInterval(
      fetchProductData,
      1000
    );

    return () => clearInterval(interval);

  }, [productSlug]);

  useEffect(() => {

    fetchAllProductsData();

    const interval = setInterval(
      fetchAllProductsData,
      1000
    );

    return () => clearInterval(interval);

  }, []);

  useEffect(() => {
    fetchMetrics();

    const interval = setInterval(fetchMetrics, 2000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="loading">Loading cache metrics...</div>;
  }

  return (
    <div className="app">

      <header className="header">
        <div>
          <p className="eyebrow">INFRASTRUCTURE</p>
          <h1>Adaptive Cache Engine</h1>
          <p className="subtitle">
            Real-time Redis caching intelligence
          </p>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          Redis Online
        </div>
      </header>


      <main>

        {/* METRIC CARDS */}

        <section className="metrics-grid">

          <MetricCard
            title="Cache Hit Rate"
            value={`${metrics?.hitRate || 0}%`}
            description="Requests served from Redis"
          />

          <MetricCard
            title="Total Requests"
            value={metrics?.totalRequests?.toLocaleString() || "0"}
            description="Requests processed"
          />

          <MetricCard
            title="Database Requests"
            value={metrics?.dbRequests?.toLocaleString() || "0"}
            description="Requests reaching Supabase"
          />

          <MetricCard
            title="DB Requests Avoided"
            value={metrics?.hits?.toLocaleString() || "0"}
            description="Requests served by cache"
          />

        </section>


        {/* CACHE PERFORMANCE */}

        <section className="panel">

          <div className="panel-header">
            <div>
              <p className="eyebrow">PERFORMANCE</p>
              <h2>Cache Performance</h2>
            </div>

            <span className="live">
              LIVE
            </span>
          </div>

          <div className="performance">

            <div className="performance-item">
              <span>Cache Hits</span>
              <strong>
                {metrics?.hits?.toLocaleString() || 0}
              </strong>
            </div>

            <div className="performance-item">
              <span>Cache Misses</span>
              <strong>
                {metrics?.misses?.toLocaleString() || 0}
              </strong>
            </div>

            <div className="performance-item">
              <span>Hit Rate</span>
              <strong>
                {metrics?.hitRate || 0}%
              </strong>
            </div>

          </div>

        </section>


        {/* PRODUCT INTELLIGENCE */}

        <section className="panel">

          <div className="panel-header">

            <div className="product-selector">

              <label>Select Product  </label>

              <select
                value={productSlug}
                onChange={(e) =>
                  setProductSlug(e.target.value)
                }
              >
                {PRODUCTS.map((product) => (
                  <option
                    key={product.slug}
                    value={product.slug}
                  >
                    {product.name}
                  </option>
                ))}
              </select>

            </div>

            <div className="live-product-stats">

              <div className="live-stat">
                <span>Traffic </span>

                <strong>
                  {productData?.traffic ?? 0} req/min
                </strong>
              </div>


              <div className="live-stat">
                <span>Remaining TTL </span>

                <strong>
                  {productData?.ttl === -2
                    ? "Not Cached"
                    : productData?.ttl === -1
                      ? "No Expiry"
                      : `${productData?.ttl ?? 0}s`}
                </strong>
              </div>


              <div className="live-stat">
                <span>Cache Status   </span>

                <strong
                  className={
                    `status-${productData?.status?.toLowerCase()}`
                  }
                >
                  {productData?.status || "COLD"}
                </strong>
              </div>

            </div>

            <div>
              <p className="eyebrow">ADAPTIVE ENGINE</p>
              <h2>Product Intelligence</h2>
            </div>

            <button
              onClick={() => simulateTraffic("HOT")}
              disabled={isSimulating}
            >
              {isSimulating ? "Simulation Running..." : "🔥 Traffic Spike"}
            </button>

          </div>

          <div className="traffic-buttons">

            <button
              onClick={() => simulateTraffic("COLD")}
              disabled={isSimulating}
            >
              🧊 Cold Traffic
            </button>

            <button
              onClick={() => simulateTraffic("WARM")}
              disabled={isSimulating}
            >
              🟡 Warm Traffic
            </button>

            <button
              onClick={() => simulateTraffic("HOT")}
              disabled={isSimulating}
            >
              {isSimulating
                ? "⏳ Simulation Running..."
                : "🔥 Traffic Spike"}
            </button>

          </div>

          <div className="table">

            <div className="table-row table-heading">
              <span>Product</span>
              <span>Traffic</span>
              <span>Score</span>
              <span>TTL</span>
              <span>Status</span>
            </div>




            {/* <button
              className="hot-button"
              onClick={() => simulateTraffic("HOT")}
            >
              🔥 Traffic Spike
            </button> */}

            {productsData.map((product) => (
              <ProductRow
                key={product.slug}
                product={product.name}
                traffic={product.traffic}
                score="—"
                ttl={
                  product.ttl === -2
                    ? "Not Cached"
                    : `${product.ttl}s`
                }
                status={product.status}
              />
            ))}

          </div>

        </section>


        {/* ARCHITECTURE */}

        <section className="architecture">

          <div className="architecture-step">
            <span>01</span>
            <strong>Request</strong>
            <small>Product request</small>
          </div>

          <div className="arrow">→</div>

          <div className="architecture-step">
            <span>02</span>
            <strong>Redis</strong>
            <small>Cache check</small>
          </div>

          <div className="arrow">→</div>

          <div className="architecture-step">
            <span>03</span>
            <strong>Traffic Analysis</strong>
            <small>Demand detection</small>
          </div>

          <div className="arrow">→</div>

          <div className="architecture-step highlight">
            <span>04</span>
            <strong>Adaptive TTL</strong>
            <small>Dynamic decision</small>
          </div>
          <a
            className="store-link"
            href="https://ecommerce-instagramstore.vercel.app/"
            target="_blank"
            rel="noreferrer"
          >
            ↗ View E-Commerce Store
          </a>
        </section>

      </main>

    </div>
  );
}


function MetricCard({ title, value, description }) {
  return (
    <div className="metric-card">

      <p>{title}</p>

      <h2>{value}</h2>

      <span>{description}</span>

    </div>
  );
}


function ProductRow({
  product,
  traffic,
  score,
  ttl,
  status
}) {
  return (
    <div className="table-row">

      <strong>{product}</strong>

      <span>{traffic} req/min</span>

      <span>{score}</span>

      <span>{ttl}</span>

      <span className={`badge ${status.toLowerCase()}`}>
        {status}
      </span>

    </div>
  );
}


export default App;