import { get, writable } from "svelte/store";
import type { ConfigStore, PPM, StatsData, Timestamp } from "./types";
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

export const logs = writable<[Timestamp, PPM][]>([]);

export const stats = writable<StatsData | null>(null);
