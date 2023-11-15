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