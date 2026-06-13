/// <reference types="vite/client" />

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
const CACHE_TTL_MS = 12 * 60 * 60 * 1000;

chrome.runtime.onMessage.addListener(function (message, _sender, reply) {
	if (message === "initial") {
		chrome.storage.local.get(function (saved) {
			const data = saved.f1;
			const cachedAt: number | undefined = saved.f1CachedAt;
			const expired = !cachedAt || Date.now() - cachedAt > CACHE_TTL_MS;
			if (data && !expired) {
				reply(data);
			} else {
				fetchAndCache(reply);
			}
		});
	} else if (message === "refresh") {
		fetchAndCache(reply);
	} else {
		reply(null);
	}
	return true;
});

function fetchAndCache(reply: (message: unknown) => void) {
	fetch(API_URL)
		.then((resp) => resp.json())
		.then((data) => {
			chrome.storage.local.set({ f1: data, f1CachedAt: Date.now() }, () =>
				reply(data)
			);
		})
		.catch(() => reply(null));
}
