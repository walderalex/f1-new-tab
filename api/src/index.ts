import getNextEvent from "./f1";
import { getCached, setCached } from "./cache";
import express from "express";
import cors from "cors";
import path from "path";

const CACHE_KEY = "f1:next-event";
const CACHE_TTL = 3600; // 1 hour

export const app = express();
app.use(cors({ origin: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.get("/api", async (req, res) => {
	try {
		const cached = await getCached(CACHE_KEY);
		if (cached) return void res.json(cached);

		const nextEvent = await getNextEvent();
		await setCached(CACHE_KEY, nextEvent, CACHE_TTL);
		return void res.json(nextEvent);
	} catch (error) {
		return void res.sendStatus(500);
	}
});

if (require.main === module) {
	const PORT = process.env.PORT || 3000;
	app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}
