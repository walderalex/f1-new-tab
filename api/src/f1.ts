import axios from "axios";

const main = async () => {
	try {
		const year = new Date().getFullYear();
		const schedulePage = (
			await axios.get(`https://www.formula1.com/en/racing/${year}.html`)
		).data;
		const apikey = `${
			schedulePage.match(/PUBLIC_GLOBAL_EVENTTRACKER_APIKEY\\"\:\\"([^\\]+)/)[1]
		}`;
		const eventDataResponse = await axios.get(
			"https://api.formula1.com/v1/event-tracker",
			{
				headers: {
					Apikey: apikey,
					locale: "en",
				},
			}
		);

		const meetings = /\{\\"meetingName\\":[^}]+\}/g;
		const services: IEventData = eventDataResponse.data;
		let meeting;
		while (!!(meeting = meetings.exec(schedulePage))) {
			const meetText = meeting[0]
				.replace(/\\/g, "")
				.replace(/"\]\)[^\(]+\(\[\d+,"/, "");
			const meet = JSON.parse(meetText);
			if (meet.meetingKey === services.fomRaceId) {
				meeting = meet;
				break;
			}
		}
		const darkImageUrlTemplate = `https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/${encodeURIComponent(
			services.race.meetingCountryName
		)}%20carbon.png.transform/2col/image.png`;
		const lightImageUrlTemplate = `https://www.formula1.com/content/dam/fom-website/2018-redesign-assets/Track%20icons%204x3/${encodeURIComponent(
			services.race.meetingCountryName
		)}.png.transform/2col/image.png`;
		const activeRace = {
			...meeting,
			meetingNumber: Number(meeting.roundText.split(" ")[1]),
			timetables: services.seasonContext.timetables,
			...services.race,
			circuitImage: {
				light: lightImageUrlTemplate,
				dark: darkImageUrlTemplate,
				fallback: services.circuitSmallImage.url,
				title: services.circuitSmallImage.title,
			},
		};
		return activeRace;
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
