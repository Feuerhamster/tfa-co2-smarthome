import { co2Monitor } from "./co2Monitor.js";
import { getWifiDevices, setLightColor, warningPhoneCall } from "./fritz.js";
import { config } from "./store.js";
import { coarsifyValue, ppmToHue } from "./utils.js";

export function initFritzDeviceConnector(
	phoneTemplateAIN: string,
	phoneAlertThreshold: number,
	lightAIN: string,
	wifiDevicesForAbsenceSwitching: string[]
) {
	let phoneTriggered = false;
	let lightChangeValue = 0;

	co2Monitor.on("co2", async ({ value: co2 }) => {
		const shouldPhoneAlert = await config("phone_alert");
		const shouldLightIndicate = await config("light_indicator");
		const shouldAutoAbsenceSwitching = await config("auto_absence_switching");

		console.log("co2: " + co2);

		let allowedToTrigger = true;

		// automatic absence detection
		if (
			shouldAutoAbsenceSwitching &&
			wifiDevicesForAbsenceSwitching.length > 0
		) {
			const wifiDevices = await getWifiDevices();
			const notAbsent = wifiDevices.some(
				(dev) =>
					wifiDevicesForAbsenceSwitching.includes(dev.name) &&
					dev.type === "active",
			);
			allowedToTrigger = notAbsent;
		}

		if (shouldPhoneAlert && allowedToTrigger && co2 >= phoneAlertThreshold && !phoneTriggered) {
			warningPhoneCall(phoneTemplateAIN);
			phoneTriggered = true;
			console.log("warning phone call triggered...");
		}

		// do not trigger phone call every time again, only if the value has dropped below threshold before
		if (co2 < phoneAlertThreshold) phoneTriggered = false;

		const coarsifiedCo2 = coarsifyValue(co2);

		// value coarsifed to not spam the light change api
		if (shouldLightIndicate && allowedToTrigger && coarsifiedCo2 !== lightChangeValue) {
			const hue = ppmToHue(co2);
			setLightColor(hue, 230, lightAIN);
			lightChangeValue = coarsifiedCo2;
			console.log("trigger light change...");
		}
	});
}
