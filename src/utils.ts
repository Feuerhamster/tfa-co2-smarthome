export function clamp(value: number, min = 0, max = 1) {
	return Math.min(Math.max(value, min), max);
}

export function ppmToFraction(ppm: number) {
	const lowerBound = 400;
	const upperBound = 1500;

	const fraction = (ppm - lowerBound) / (upperBound - lowerBound);
	const clamped = clamp(fraction);

	return clamped;
}

export function fractionToHue(fraction: number) {
	const from = 120;
	const to = 0;

	const hue = (to - from) * fraction + from;

	return hue;
}

export function ppmToHue(ppm: number) {
	return fractionToHue(ppmToFraction(ppm));
}

function ppmToPercent(ppm: number) {
	const maxPPMValue = 1500;
}

//export function ppmToFraction(ppm: number) {

/**
 * util to format sse messages
 * @param event event name
 * @param data event data
 * @param id optional event id
 * @returns formatted string
 */
export function formatSSE(event: string, data?: any, id?: number) {
	let str = "";

	if (id) str += `id: ${id}\n`;

	str += `event: ${event}\n`;
	if (data) str += `data: ${JSON.stringify(data)}\n`;

	str += `\n`;

	return str;
}

export class Timer {
	private startTime: Date;
	private timeInMinutes: number;

	constructor(timeInMinutes: number) {
		this.startTime = new Date();
		this.timeInMinutes = timeInMinutes;
	}

	isTimeUp(): boolean {
		const elapsedTime = new Date().getTime() - this.startTime.getTime();
		return elapsedTime >= this.timeInMinutes * 60 * 1000;
	}

	updateTime(): void {
		this.startTime = new Date();
	}
}

export class TimePeriod {
	start: number;
	end: number;

	constructor(startTime: [number, number], endTime: [number, number]) {
		let [startHour, startMinute] = startTime;
		let [endHour, endMinute] = endTime;
		this.start = startHour * 60 + startMinute;
		this.end = endHour * 60 + endMinute;
	}

	checkTime(time: Date): boolean {
		let minutes = time.getHours() * 60 + time.getMinutes();
		return minutes >= this.start && minutes <= this.end;
	}
}
