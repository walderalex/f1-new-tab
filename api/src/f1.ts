import axios from "axios";
import { writeFileSync } from "fs";

interface Session {
	session: string;
	shortName: string;
	description: string;
	startTime: string;
	endTime: string;
	gmtOffset: string;
	state: string;
	sessionType: string;
	sessionNumber: number;
	meetingSessionKey: number;
	timezone: string;
}

export interface ActiveRace {
	meetingName: string;
	meetingLocation: string;
	meetingCountryName: string;
	meetingCountryCode: string;
	meetingOfficialName: string;
	meetingTimezone: string;
	url: string;
	isTestEvent: boolean;
	roundText: string;
	circuitShortName: string;
	meetingStartDate: string;
	meetingEndDate: string;
	meetingNumber: number;
	startAndEndDate: string;
	timetables: Session[];
	circuitImage: {
		url: string;
		title: string;
	};
}

const formatDateRange = (start: string, end: string) => {
	const s = new Date(start);
	const e = new Date(end);
	const month = s.toLocaleString("en", { month: "short" });
	return `${s.getUTCDate()} - ${e.getUTCDate()} ${month}`;
};

const main = async (): Promise<ActiveRace> => {
	try {
		const year = new Date().getFullYear();
		const schedulePage = (
			await axios.get(`https://www.formula1.com/en/racing/${year}.html`)
		).data;
		const apikey =
			schedulePage.match(/PUBLIC_GLOBAL_EVENTTRACKER_APIKEY\\"\:\\"([^\\]+)/)[1];
		const eventDataResponse = await axios.get(
			"https://api.formula1.com/v1/event-tracker",
			{
				headers: {
					Apikey: apikey,
					locale: "en",
				},
			},
		);
		writeFileSync("event-data.json", JSON.stringify(eventDataResponse.data));

		const { race, seasonContext, circuitImage } = eventDataResponse.data;

		return {
			...race,
			meetingNumber: Number((race.roundText as string).replace("R", "")),
			timetables: seasonContext.timetables,
			startAndEndDate: formatDateRange(race.meetingStartDate, race.meetingEndDate),
			circuitImage: {
				url: `https://media.formula1.com/image/upload/${circuitImage.public_id}`,
				title: race.circuitShortName,
			},
		};
	} catch (e) {
		const error = e as any;
		console.error(error);
		if (error.response) {
			throw new Error(error.response.data);
		}
		throw new Error(`Unkown error: ${error}`);
	}
};

export default main;
