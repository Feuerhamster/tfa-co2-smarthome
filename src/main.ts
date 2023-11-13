import Co2Monitor from "co2-monitor";
import { login, setLightColor, warningCall } from "./fritz.js";
import { ppmToHue } from "./utils.js";

let co2Monitor = new Co2Monitor();

let sid = "";

co2Monitor.on("connected", async () => {
	console.log("Co2Monitor connected");

	sid = await login();
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

let warned = false;

co2Monitor.on("co2", (co2) => {
	console.log("co2: " + co2.toString());

	if (sid.length < 1) return;

	const hue = ppmToHue(co2.value);
	setLightColor(sid, hue, 255, "***");

	if (co2.value > 1500 && !warned) {
		warned = true;
		warningCall(sid);
	} else if (co2.value < 1400) {
		warned = false;
	}
});

co2Monitor.on("temperature", (temperature) => {
	//console.log("temperature: " + temperature.toString());
});

/*co2Monitor.on("data", (data) => {
	console.log("data: " + data.toString());
});*/

co2Monitor.connect((error) => {
	if (error) {
		console.error(error);
		process.exit(1);
	}

	co2Monitor.startTransfer((error) => {
		if (error) {
			console.error(error);
		}
	});
});
