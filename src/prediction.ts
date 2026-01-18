import { co2Monitor } from "./co2Monitor.js";
import { ppmTargetValue, showLogCount } from "./config.js";
import { logs } from "./store.js";
import type { PPM, Timestamp } from "./types.d";

const outlierFilterRatio = 0.2;

// gradient in ppm per second
export function getGradient(values: [Timestamp, PPM][]) {
	const gradients = values.flatMap((value, index) => {
		const next = values[index + 1];

		if (!next) {
			return [];
		}

		return [gradientForDifference(value, next)];
	});

	const positiveGradients = gradients.filter((gradient) => gradient > 0);

	positiveGradients.sort((a, b) => b - a);

	const outlierCount = Math.round(
		positiveGradients.length * outlierFilterRatio,
	);
	const outliersEdge = Math.ceil(outlierCount / 2);

	const gradientsFiltered = positiveGradients.filter(
		(_, index) =>
			index >= outliersEdge && index < positiveGradients.length - outliersEdge,
	);

	const averageGradient =
		gradientsFiltered.reduce((accumalator, value) => accumalator + value, 0) /
		gradientsFiltered.length;

	return averageGradient;
}

// gradient in seconds
function gradientForDifference(a: [Timestamp, PPM], b: [Timestamp, PPM]) {
	const timeDifference = b[0] - a[0];
	const ppmDifference = b[1] - a[1];

	return (ppmDifference * 1000) / timeDifference;
}

// time in seconds
export function getTimeUntilValueReached(
	valueNow: number,
	gradient: number,
	targetValue: number,
) {
	return (targetValue - valueNow) / gradient;
}

let lastPPMUpdate = Date.now();
export async function getUpdatedPrediction(ppm: number) {
	const gradient = getGradient(await logs(showLogCount));
	const timeFromLastPPM = getTimeUntilValueReached(
		ppm,
		gradient,
		ppmTargetValue,
	);
	const timeToLastPPMUpdate = (Date.now() - lastPPMUpdate) / 1000;
	const timePrediction = Math.floor(
		(timeFromLastPPM - timeToLastPPMUpdate) / 60,
	);
	const ppmPerHour = Math.round(gradient * 60 * 60);

	// timePrediction in minutes
	return { timePrediction, ppmPerHour };
}
