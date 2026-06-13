import getNextEvent from "./f1";
import * as express from "express";
import * as cors from "cors";

export const app = express();
app.use(cors({ origin: true }));
app.get("/", async (req, res) => {
	try {
		const nextEvent = await getNextEvent();
		return void res.json(nextEvent);
	} catch (error) {
		return void res.sendStatus(500);
	}
});

if (require.main === module) {
	const PORT = process.env.PORT || 3000;
	app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
}
