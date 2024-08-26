interface F1Data {
	path: string;
	linkText: string;
	meetingKey: number;
	meetingNumber: number;
	image: string;
	startAndEndDate: string;
	driverOrTeamOrRaceSecondaryNavigation: boolean;
	timetables: Session[];
	meetingCountryName: string;
	meetingStartDate: string;
	meetingOfficialName: string;
	meetingEndDate: string;
	circuitImage: {
		light: string;
		dark: string;
		fallback: string;
		title: string;
	};
}

interface Session<T = string> {
	state: string;
	session: ("q" | "r" | "p1" | "p2" | "p3") | string;
	gmtOffset: string;
	description: string;
	endTime: string;
	startTime: T;
}

chrome.runtime.onMessage.addListener(function (message, sender, reply) {
	if (message == "initial") {
		chrome.storage.local.get(function (saved) {
			const savedData = saved.f1;
			if (savedData) {
				console.log(`from saved`);
				reply(savedData);
			} else {
				console.log(`from api`);
				fetchFromApi(reply);
			}
		});
	} else if (message == "refresh") {
		fetchFromApi(reply);
	} else {
		reply(null);
	}
	return true;
});

function fetchFromApi(reply: (message: any) => void) {
	fetch(`https://us-central1-als-site-test.cloudfunctions.net/schedule`)
		.then((resp) => resp.json())
		.then((data) => {
			chrome.storage.local.set({ f1: data }, function () {
				reply(data);
			});
		});
}
