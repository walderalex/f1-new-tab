interface IEventData {
	raceHubId: string;
	locale: string;
	createdAt: string;
	updatedAt: string;
	fomRaceId: string;
	brandColourHexadecimal: string;
	circuitSmallImage: ICircuitSmallImage;
	links: any[];
	seasonContext: ISeasonContext;
	raceResults: any[];
	race: IRace;
	seasonYearImage: string;
	sessionLinkSets: ISessionLinkSets;
}
interface ICircuitSmallImage {
	title: string;
	path: string;
	url: string;
	public_id: string;
	raw_transformation: string;
	width: number;
	height: number;
}
interface ISeasonContext {
	id: string;
	contentType: string;
	createdAt: string;
	updatedAt: string;
	locale: string;
	seasonYear: string;
	currentOrNextMeetingKey: string;
	state: string;
	eventState: string;
	liveEventId: string;
	liveTimingsSource: string;
	liveBlog: ILiveBlog;
	seasonState: string;
	raceListingOverride: number;
	driverAndTeamListingOverride: number;
	timetables: ITimetablesItem[];
	replayBaseUrl: string;
	seasonContextUIState: number;
}
interface ILiveBlog {
	contentType: string;
	title: string;
	host: string;
	projectId: string;
	eventId: string;
	eventUrl: string;
}
interface ITimetablesItem {
	session: string;
	description: string;
	startTime: string;
	endTime: string;
	gmtOffset: string;
	state: string;
	sessionType: string;
	sessionNumber: number;
}
interface IRace {
	meetingCountryName: string;
	meetingStartDate: string;
	meetingOfficialName: string;
	meetingEndDate: string;
	url: string;
}
interface ISessionLinkSets {
	replayLinks: IReplayLinksItem[];
}
interface IReplayLinksItem {
	text: string;
	url: string;
	linkType: string;
	session: string;
}
