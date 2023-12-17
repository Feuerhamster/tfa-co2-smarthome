import { ClassicLevel } from "classic-level";
import { co2Monitor } from "./co2Monitor.js";
import { calculateDaytimeAverage } from "./utils.js";

const db = new ClassicLevel<string, number>("./db.level", {
	valueEncoding: "json",
});
export const logDB = db.sublevel<number, number>("logs", {
	valueEncoding: "json",
	keyEncoding: "json",
});

export function startLoggingAndPurging(
	interval: number,
	keepNumberOfDays: number,
) {
	setInterval(
		async () => {
			await logDB.put(Date.now(), co2Monitor.co2.value);

			const d = new Date();
			d.setDate(d.getDate() - keepNumberOfDays);
			logDB.clear({ lt: d.getTime() });
		},
		interval * 1000 * 60,
	);
}

export async function logs(limit: number) {
	return (await logDB.iterator({ limit, reverse: true }).all()).reverse();
}

export async function getAveragePPM(
	daysBack: number,
	daytimeHours: [number, number],
) {
	const d = new Date();
	d.setDate(d.getDate() - daysBack);
	const allLogEntries = await logDB.iterator({ gt: d.getTime() }).all();

	let totalPPM = 0;

	allLogEntries.forEach((e) => (totalPPM += e[1]));

	const totalAverage = totalPPM / allLogEntries.length;
	const daytimeAverage = calculateDaytimeAverage(
		allLogEntries,
		daytimeHours[0],
		daytimeHours[1],
	);

	return { totalAverage, daytimeAverage };
}
