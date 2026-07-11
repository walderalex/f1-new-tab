interface IEventData {
	raceHubId: string;
	locale: string;
	createdAt: string;
	updatedAt: string;
	fomRaceId: string;
	brandColourHexadecimal: string;
	circuitImage: ICircuitImage;
	links: any[];
	seasonContext: ISeasonContext;
	raceResults: any[];
	race: IRace;
	seasonYearImage: string;
	sessionLinkSets: ISessionLinkSets;
}
interface ICircuitImage {
	public_id: string;
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
	meetingName: string;
	meetingCountryName: string;
	meetingStartDate: string;
	meetingOfficialName: string;
	meetingEndDate: string;
	url: string;
	roundText: string;
	circuitShortName: string;
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
