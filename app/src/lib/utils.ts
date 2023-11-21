function clamp(value: number, min = 0, max = 1) {
	return Math.min(Math.max(value, min), max);
}

function ppmToFraction(ppm: number) {
	const lowerBound = 400;
	const upperBound = 1500;

	const fraction = (ppm - lowerBound) / (upperBound - lowerBound);
	const clamped = clamp(fraction);

	return clamped;
}

function fractionToHue(fraction: number) {
	const from = 140;
	const to = 0;

	const hue = (to - from) * fraction + from;

	return hue;
}

export function ppmToHue(ppm: number) {
	return fractionToHue(ppmToFraction(ppm));
}
