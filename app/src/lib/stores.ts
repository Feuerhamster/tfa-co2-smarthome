import { writable } from "svelte/store";
import type { PPM, StatsData, Timestamp } from "./types";

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

export const logs = writable<[Timestamp, PPM][]>([]);

export const stats = writable<StatsData | null>(null);
