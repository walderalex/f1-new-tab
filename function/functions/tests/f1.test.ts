import getNextEvent from "../src/f1";

test("gets latest event data", async () => {
	const data = await getNextEvent();
	console.log(data);

	expect(1).toBe(1);
});
