import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",

  socket: {
    reconnectStrategy: false,
  },
});

// Redis Error Event
redisClient.on("error", () => {
  console.log("⚠️ Redis Server Not Running");
});

// Connect Function
export const connectRedis = async (): Promise<void> => {
  try {
    await redisClient.connect();

    console.log("✅ Redis Connected");
  } catch (error) {
    // Optional: no extra log needed
  }
};

export default redisClient;