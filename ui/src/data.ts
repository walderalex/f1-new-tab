import { F1Data } from "./main";

export const fetchData = async (forceRefresh = false): Promise<F1Data> => {
	try {
		const data = await chrome.runtime.sendMessage(
			forceRefresh ? "refresh" : "initial"
		);
		return data as F1Data;
	} catch {
		const resp = await fetch(
			import.meta.env.VITE_API_URL ?? "/api"
		);
		return resp.json();
	}
};
