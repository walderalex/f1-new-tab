import { F1Data } from "./main";
import template from "./race data template.json";
export const fetchData = async (forceRefresh = false) => {
	try {
		const data = await chrome.runtime.sendMessage(
			forceRefresh ? "refresh" : "initial"
		);
		return data as F1Data;
	} catch (error) {
		return template;
	}
};
