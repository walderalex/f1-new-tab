import * as request from "supertest";
import { app } from "../src/index";
import getNextEvent from "../src/f1";

jest.mock("../src/f1");
const mockedGetNextEvent = getNextEvent as jest.MockedFunction<typeof getNextEvent>;

const mockEvent = { meetingName: "Monaco Grand Prix", meetingNumber: 8 };

test("GET / returns 200 with event JSON", async () => {
	mockedGetNextEvent.mockResolvedValueOnce(mockEvent as any);

	const res = await request(app).get("/");

	expect(res.status).toBe(200);
	expect(res.body).toEqual(mockEvent);
});

test("GET / returns 500 when getNextEvent throws", async () => {
	mockedGetNextEvent.mockRejectedValueOnce(new Error("upstream failure"));

	const res = await request(app).get("/");

	expect(res.status).toBe(500);
});

test("GET / sets CORS headers", async () => {
	mockedGetNextEvent.mockResolvedValueOnce(mockEvent as any);

	const res = await request(app).get("/").set("Origin", "chrome-extension://abc");

	expect(res.headers["access-control-allow-origin"]).toBe("chrome-extension://abc");
});
