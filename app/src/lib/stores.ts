import { get, writable } from "svelte/store";
import type { ConfigStore } from "./types";
import { putConfig } from "./api";

export enum EConnectionState {
	Connecting,
	Connected,
	Disconnected,
}

export const color = writable(0);
export const ppm = writable<number>();
export const connectionState = writable<EConnectionState>(
	EConnectionState.Disconnected,
);
export const themeColor = writable<string>("");

export const config = writable<ConfigStore>({
	phone_alert: false,
	light_indicator: false,
	auto_absence_switching: false,
});

export type Timestamp = number;
export type PPM = number;

export const logs = writable<[Timestamp, PPM][]>([]);
