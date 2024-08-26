import "./style.css";
// import templateData from "./race data template.json";
import { fetchData } from "./data";
export interface F1Data {
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

const serverDateToDate = (date: Date, gmtOffset: string) => {
	const localeOffset = date.getTimezoneOffset();
	const minsOut =
		((gmtOffset: string) => {
			const { hours, minutes, sign } =
				/(?<sign>\+|-)(?<hours>[0-9]+)\:(?<minutes>[0-9]+)/.exec(gmtOffset)
					?.groups ?? {
					hours: "0",
					minutes: "0",
					sign: "+",
				};
			const mins = parseInt(hours) * 60 + parseInt(minutes);
			if (sign == "+") {
				return mins * -1;
			} else return mins;
		})(gmtOffset) - localeOffset;
	date.setMinutes(date.getMinutes() + minsOut);
	return date;
};

const animationInterval = (
	ms: number,
	signal: AbortSignal,
	callback: (time: number) => void
) => {
	// Prefer currentTime, as it'll better sync animtions queued in the
	// same frame, but if it isn't supported, performance.now() is fine.
	const start = document.timeline
		? document.timeline.currentTime!
		: performance.now();

	function frame(time: number) {
		if (signal.aborted) return;
		callback(time);
		scheduleFrame(time);
	}

	function scheduleFrame(time: number) {
		const elapsed = time - start;
		const roundedElapsed = Math.round(elapsed / ms) * ms;
		const targetNext = start + roundedElapsed + ms;
		const delay = targetNext - performance.now();
		setTimeout(() => requestAnimationFrame(frame), delay);
	}

	scheduleFrame(start);
};

const sessionMarkup = (session: Session) => {
	const now = new Date();
	const startTime = serverDateToDate(
		new Date(session.startTime),
		session.gmtOffset
	);
	const endTime = serverDateToDate(
		new Date(session.endTime),
		session.gmtOffset
	);
	const dateToTimeString = (date: Date) => {
		const hours = date.getHours().toString().padStart(2, "0");
		const mins = date.getMinutes().toString().padStart(2, "0");
		return `${hours}:${mins}`;
	};
	const day = ((day: number) => {
		if (day == 5) return "fri";
		if (day == 6) return "sat";
		if (day == 0) return "sun";
		return "fri";
	})(startTime.getDay());
	const sessionEl = document.createElement("div");
	sessionEl.className = "session";
	const nameEl = document.createElement("div");
	nameEl.className = `name`;
	const dayEl = document.createElement("div");
	dayEl.className = "day";
	const timeEl = document.createElement("div");
	timeEl.className = `time`;
	nameEl.textContent = session.description;
	dayEl.textContent = `${day}`;
	timeEl.textContent = `${dateToTimeString(startTime)} - ${dateToTimeString(
		endTime
	)}`;
	sessionEl.appendChild(nameEl);
	sessionEl.appendChild(dayEl);
	sessionEl.appendChild(timeEl);
	const statusEl = document.createElement("div");
	statusEl.className = `status`;
	if (endTime <= now) {
		statusEl.textContent = "finished";
	} else if (startTime <= now && now <= endTime) {
		statusEl.textContent = "live";
		statusEl.classList.add("live");
	} else if (session.session == calculateNextSession()?.session) {
		statusEl.textContent = "next";
	}
	if (statusEl.textContent) sessionEl.appendChild(statusEl);
	return sessionEl;
};

const calculateNextSession = (now = new Date().getTime()) =>
	data.timetables
		.map((s) => {
			const startTime = serverDateToDate(new Date(s.startTime), s.gmtOffset);
			const endTime = serverDateToDate(new Date(s.endTime), s.gmtOffset);
			return { ...s, startTime, endTime };
		})
		.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
		.find(
			(s) =>
				(s.startTime.getTime() <= now && s.endTime.getTime() >= now) ||
				s.startTime.getTime() > now
		);

const updateCountdown = (dots: boolean, lastTimeToNext?: number) => {
	const now = new Date();
	const nextSession = calculateNextSession(now.getTime());
	if (!nextSession) {
		countdownEls.daysEl!.textContent = `--`;
		countdownEls.hoursEl!.textContent = `--`;
		countdownEls.minsEl!.textContent = `--`;
		countdownEls.dotsEls!.forEach((d) => (d.textContent = ""));
		countdownController.abort();
		fetchData(true).then(refreshUI);
		return 0;
	}
	if (dots) {
		countdownEls.dotsEls!.forEach((d) => (d.textContent = ":"));
	} else {
		countdownEls.dotsEls!.forEach((d) => (d.textContent = ""));
	}
	const timeToNext = nextSession.startTime.getTime() - now.getTime();
	const millis = {
		day: 1000 * 60 * 60 * 24,
		min: 1000 * 60,
		hour: 1000 * 60 * 60,
		second: 1000,
	};
	const daysToNext = Math.floor(timeToNext / millis.day);
	const hoursToNext = Math.floor((timeToNext % millis.day) / millis.hour);
	const minsToNext = Math.ceil(
		((timeToNext % millis.day) % millis.hour) / millis.min
	);

	if (timeToNext > 0) {
		countdownEls.majorEl!.textContent = `days`;
		countdownEls.minorEl!.textContent = `hours`;
		countdownEls.minowEl!.textContent = `mins`;
		countdownEls.daysEl!.textContent = `${daysToNext}`.padStart(2, "0");
		countdownEls.hoursEl!.textContent = `${hoursToNext}`.padStart(2, "0");
		countdownEls.minsEl!.textContent = `${
			minsToNext == 60 ? 59 : minsToNext
		}`.padStart(2, "0");
		countdownEls.dotsEls!.forEach((d) => (d.className = `dots`));
	} else {
		countdownEls.dotsEls!.forEach((d) => (d.className = `dots live`));
		const timeToEnd = nextSession.endTime.getTime() - now.getTime();
		const hoursToEnd = Math.floor((timeToEnd % millis.day) / millis.hour);
		const minsToEnd = Math.floor(
			((timeToEnd % millis.day) % millis.hour) / millis.min
		);
		const secsToEnd = Math.round(
			(((timeToEnd % millis.day) % millis.hour) % millis.min) / millis.second
		);
		countdownEls.majorEl!.textContent = `hours`;
		countdownEls.minorEl!.textContent = `mins`;
		countdownEls.minowEl!.textContent = `secs`;
		countdownEls.daysEl!.textContent = `${`${hoursToEnd}`.padStart(2, "0")}`;
		countdownEls.hoursEl!.textContent = `${minsToEnd}`.padStart(2, "0");
		countdownEls.minsEl!.textContent = `${
			secsToEnd == 60 ? 59 : secsToEnd
		}`.padStart(2, "0");
	}
	if (timeToNext > 0 && lastTimeToNext && lastTimeToNext < 0) renderSessions();
	return timeToNext;
};

const renderSessions = () => {
	const sessions = data.timetables.sort(
		(a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
	);
	const children: Node[] = [];
	for (let i = 0; i < sessions.length; i++) {
		const session = sessions[i];
		const sessionEl = sessionMarkup(session);
		children.push(sessionEl);
	}
	sessionsEl.replaceChildren(...children);
};

let data: F1Data;

let roundEl: Element;
let countryEl: Element;
let titleEl: Element;
let eventDatesEl: Element;
let lightImageEl: HTMLImageElement;
let darkImageEl: HTMLSourceElement;
let sessionsEl: Element;
let countdownEls: {
	majorEl?: Element;
	minorEl?: Element;
	minowEl?: Element;
	daysEl?: Element;
	hoursEl?: Element;
	minsEl?: Element;
	dotsEls?: [Element, Element];
} = {};

let countdownController: AbortController;

const main = async () => {
	data = await fetchData();
	roundEl = document.querySelector("#round")!;
	countryEl = document.querySelector("#country")!;
	titleEl = document.querySelector(`#title`)!;
	eventDatesEl = document.querySelector(`#dates`)!;
	lightImageEl = document.querySelector(`#light-img`) as HTMLImageElement;
	darkImageEl = document.querySelector(`#dark-img`) as HTMLSourceElement;
	sessionsEl = document.querySelector(`#sessions`)!;
	countdownEls.daysEl = document.querySelector(`#days`)!;
	countdownEls.hoursEl = document.querySelector(`#hours`)!;
	countdownEls.minsEl = document.querySelector(`#mins`)!;
	countdownEls.majorEl = document.querySelector(`#major`)!;
	countdownEls.minorEl = document.querySelector(`#minor`)!;
	countdownEls.minowEl = document.querySelector(`#minow`)!;
	countdownEls.dotsEls = Array.from(document.querySelectorAll(`.dots`)!) as [
		Element,
		Element
	];
	roundEl.textContent = `Round ${data.meetingNumber} - up next`;
	countryEl.textContent = data.meetingCountryName;
	titleEl.textContent = data.meetingOfficialName;
	eventDatesEl.textContent = data.startAndEndDate;
	lightImageEl.src = data.circuitImage.dark;
	lightImageEl.alt = data.circuitImage.title;
	darkImageEl.srcset = data.circuitImage.light;
	renderSessions();
	countdownController = new AbortController();
	let lastTimeToNext = updateCountdown(true, 0);
	let dots = false;
	animationInterval(1000, countdownController.signal, () => {
		const timeToNext = updateCountdown(dots, lastTimeToNext);
		dots = !dots;
		lastTimeToNext = timeToNext;
	});
};

const refreshUI = (newData: F1Data) => {
	data = newData;
	renderSessions();
	countdownController = new AbortController();
	let lastTimeToNext = updateCountdown(true, 0);
	let dots = false;
	animationInterval(1000, countdownController.signal, () => {
		const timeToNext = updateCountdown(dots, lastTimeToNext);
		dots = !dots;
		lastTimeToNext = timeToNext;
	});
};

window.onload = main;
