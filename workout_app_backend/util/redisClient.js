import redis from "redis";

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

(async () => {
  await redisClient.connect();
})();

export default redisClient;
