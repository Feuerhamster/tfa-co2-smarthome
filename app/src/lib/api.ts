import { dev } from "$app/environment";
import { get } from "svelte/store";
import { EConnectionState, connectionState, logs, ppm } from "./stores";
import type { PPM, StatsData, Timestamp } from "./types";

const apiUrl = new URL(
	"/api/",
	dev ? "http://192.168.178.31:3002" : window.location.origin,
).href;

export function sseConnection() {
	connectionState.set(EConnectionState.Connecting);
	const events = new EventSource(apiUrl + "data-stream");

	events.addEventListener("co2", (ev) => {
		ppm.set(parseInt(ev.data));
	});

	events.addEventListener("log", (ev) => {
		let data = JSON.parse(ev.data) as [number, number];
		const log = get(logs);
		log.shift();
		log.push(data);
		logs.set(log);
	});

	events.onopen = () => {
		EConnectionState.Connected;
		connectionState.set(EConnectionState.Connected);
	};
	events.onerror = () => {
		connectionState.set(EConnectionState.Disconnected);
	};
}

export async function getLogs() {
	const res = await fetch(apiUrl + "logs");

	return (await res.json()) as [Timestamp, PPM][];
}

export async function getStats() {
	const res = await fetch(apiUrl + "stats");
	return (await res.json()) as StatsData;
}
