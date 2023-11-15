import Co2Monitor from "co2-monitor";

export const co2Monitor = new Co2Monitor();

export function initDevice() {
	co2Monitor.connect((error) => {
		if (error) {
			console.error(error);
			process.exit(1);
		}
	
		co2Monitor.startTransfer((error) => {
			if (error) {
				console.error(error);
				process.exit(1);
			}
		});
	});

	co2Monitor.setMaxListeners(64);
}

co2Monitor.on("connected", () => {
	console.log("Co2Monitor connected");
});

co2Monitor.on("disconnected", () => {
	console.log("Co2Monitor disconnected");
});

co2Monitor.on("error", (error) => {
	console.error(error);

	co2Monitor.disconnect(() => {
		process.exit(1);
	});
});