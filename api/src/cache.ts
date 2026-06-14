import Redis from "ioredis";

const client = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
	lazyConnect: true,
	enableOfflineQueue: false,
	maxRetriesPerRequest: 1,
});

client.on("error", (err) => console.warn(`Redis: ${err.message}`));

export const getCached = async <T>(key: string): Promise<T | null> => {
	try {
		const val = await client.get(key);
		return val ? (JSON.parse(val) as T) : null;
	} catch {
		return null;
	}
};

export const setCached = async (
	key: string,
	value: unknown,
	ttlSeconds: number,
): Promise<void> => {
	try {
		await client.setex(key, ttlSeconds, JSON.stringify(value));
	} catch {
		// best-effort
	}
};
