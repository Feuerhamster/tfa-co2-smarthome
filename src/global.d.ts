declare module "co2-monitor" {
	export interface Co2Response {
		value: number;
		type: "int";
		unit: "parts per million";
		symbol: "ppm";
		toString: () => string;
	}

	interface TemperatureResponse {
		value: number;
		type: "float";
		unit: "degree celcius";
		symbol: "°C";
		toString: () => string;
	}

	interface Response {
		co2: Co2Response;
		temperature: TemperatureResponse;
		humidity: unknown;
		toString: () => string;
	}

	class Co2Monitor extends require("events").EventEmitter {
		on(event: "disconnected", callback: () => void): void;
		on(
			event: "connected",
			callback: (device: import("usb").Device) => void,
		): void;
		on(event: "error", callback: (error: Error) => void): void;
		on(event: "co2", callback: (co2: Co2Response) => void): void;
		on(
			event: "temperature",
			callback: (co2: TemperatureResponse) => void,
		): void;
		on(event: "data", callback: (co2: Response) => void): void;

		off(
			event:
				| "data"
				| "co2"
				| "temperature"
				| "error"
				| "connected"
				| "disconnected",
			callback: (...args: any[]) => void,
		);

		connect(callback: (error?: Error) => void): void;
		startTransfer(callback: (error?: Error) => void): void;

		get temperature(): number;
		get co2(): Co2Response;
	}

	export = Co2Monitor;
}
