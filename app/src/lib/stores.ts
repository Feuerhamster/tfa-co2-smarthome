import { writable } from "svelte/store";

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
