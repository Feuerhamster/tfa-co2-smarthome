import { dev } from "$app/environment";
import { get } from "svelte/store";
import { EConnectionState, config, connectionState, logs, ppm } from "./stores";
import type { ConfigStore } from "./types";

const apiUrl = new URL(
	"/api/",
	dev ? "http://localhost:3000" : window.location.origin,
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
	})

	events.onopen = () => {
		EConnectionState.Connected;
		connectionState.set(EConnectionState.Connected);
	};
	events.onerror = () => {
		connectionState.set(EConnectionState.Disconnected);
	};
}

export async function setConfig(key: keyof ConfigStore, value: boolean) {
	const res = await fetch(apiUrl + "config/" + key, {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ value }),
	});

	const data = (await res.json()) as boolean;
	return data;
}

export async function getConfigComplete() {
	const res = await fetch(apiUrl + "config");

	const data = (await res.json()) as ConfigStore;

	config.set(data);
}

export async function getLogs() {
	const res = await fetch(apiUrl + "logs");

	return (await res.json()) as [number, number][];
}
