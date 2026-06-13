import axios from "axios";
import getNextEvent from "../src/f1";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const RACE_ID = "test-race-id";

// The regex stops at a backslash, so the key must be followed by \" to terminate it
const mockSchedulePage = `PUBLIC_GLOBAL_EVENTTRACKER_APIKEY\\":\\"test-api-key-123\\" {\\"meetingName\\":\\"Monaco Grand Prix\\",\\"roundText\\":\\"Round 8\\",\\"meetingKey\\":\\"${RACE_ID}\\"}`;

const mockEventData: IEventData = {
	raceHubId: "hub-1",
	locale: "en",
	createdAt: "2024-01-01",
	updatedAt: "2024-01-01",
	fomRaceId: RACE_ID,
	brandColourHexadecimal: "#e8002d",
	circuitSmallImage: {
		title: "Monaco Circuit",
		path: "/path/to/image",
		url: "https://example.com/circuit.png",
		public_id: "circuit",
		raw_transformation: "",
		width: 400,
		height: 300,
	},
	links: [],
	seasonContext: {
		id: "ctx-1",
		contentType: "seasonContext",
		createdAt: "2024-01-01",
		updatedAt: "2024-01-01",
		locale: "en",
		seasonYear: "2024",
		currentOrNextMeetingKey: RACE_ID,
		state: "upcoming",
		eventState: "upcoming",
		liveEventId: "",
		liveTimingsSource: "",
		liveBlog: {
			contentType: "liveBlog",
			title: "",
			host: "",
			projectId: "",
			eventId: "",
			eventUrl: "",
		},
		seasonState: "active",
		raceListingOverride: 0,
		driverAndTeamListingOverride: 0,
		timetables: [
			{
				session: "r",
				description: "Race",
				startTime: "2024-05-26T13:00:00",
				endTime: "2024-05-26T15:00:00",
				gmtOffset: "+02:00",
				state: "upcoming",
				sessionType: "race",
				sessionNumber: 1,
			},
		],
		replayBaseUrl: "",
		seasonContextUIState: 0,
	},
	raceResults: [],
	race: {
		meetingCountryName: "Monaco",
		meetingStartDate: "2024-05-23",
		meetingOfficialName: "Formula 1 Grand Prix de Monaco 2024",
		meetingEndDate: "2024-05-26",
		url: "https://www.formula1.com/en/racing/2024/Monaco",
	},
	seasonYearImage: "",
	sessionLinkSets: { replayLinks: [] },
};

beforeEach(() => {
	jest.clearAllMocks();
	jest.spyOn(console, "error").mockImplementation(() => {});
	mockedAxios.get
		.mockResolvedValueOnce({ data: mockSchedulePage })
		.mockResolvedValueOnce({ data: mockEventData });
});

test("extracts the API key and calls event-tracker with it", async () => {
	await getNextEvent();

	expect(mockedAxios.get).toHaveBeenNthCalledWith(
		2,
		"https://api.formula1.com/v1/event-tracker",
		expect.objectContaining({
			headers: expect.objectContaining({ Apikey: "test-api-key-123" }),
		})
	);
});

test("returns the correct shape", async () => {
	const result = await getNextEvent();

	expect(result).toMatchObject({
		meetingName: "Monaco Grand Prix",
		meetingNumber: 8,
		meetingCountryName: "Monaco",
		meetingOfficialName: "Formula 1 Grand Prix de Monaco 2024",
		circuitImage: {
			light: expect.stringContaining("Monaco"),
			dark: expect.stringContaining("Monaco"),
			fallback: "https://example.com/circuit.png",
			title: "Monaco Circuit",
		},
		timetables: mockEventData.seasonContext.timetables,
	});
});

test("throws when the API key is missing from the page", async () => {
	mockedAxios.get.mockReset();
	mockedAxios.get.mockResolvedValueOnce({ data: "<html>no key here</html>" });

	await expect(getNextEvent()).rejects.toThrow();
});

test("throws when axios fails", async () => {
	mockedAxios.get.mockReset();
	mockedAxios.get.mockRejectedValueOnce({
		response: { data: "Service Unavailable" },
	});

	await expect(getNextEvent()).rejects.toThrow("Service Unavailable");
});
