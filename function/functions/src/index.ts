import * as functions from "firebase-functions";
import getNextEvent from "./f1";
import * as express from "express";
import * as cors from "cors";
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const app = express();
app.use(cors({ origin: true }));
app.get("/", async (req, res) => {
	try {
		const nextEvent = await getNextEvent();
		return void res.json(nextEvent);
	} catch (error) {
		return void res.sendStatus(500);
	}
});

exports.schedule = functions.https.onRequest(app);
