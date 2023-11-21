import { co2Monitor } from "./co2Monitor.js";
import { getWifiDevices, setLightColor, warningPhoneCall } from "./fritz.js";
import { config } from "./store.js";
import { ppmToHue } from "./utils.js";

export function initFritzDeviceConnector(phoneTemplateAIN: string, lightAIN: string, wifiDevicesForAbsenceSwitching: string[]) {
	co2Monitor.on("co2", async ({ value: co2 }) => {
		const shouldPhoneAlert = await config("phone_alert");
		const shouldLightIndicate = await config("light_indicator");
		const shouldAutoAbsenceSwitching = await config("auto_absence_switching");

		let allowedToTrigger = true;

		if (shouldAutoAbsenceSwitching && wifiDevicesForAbsenceSwitching.length > 0) {
			const wifiDevices = await getWifiDevices();
			const notAbsent = wifiDevices.some((dev) => wifiDevicesForAbsenceSwitching.includes(dev.name) && dev.type === "active");
			allowedToTrigger = notAbsent;
		}

		if (shouldPhoneAlert && allowedToTrigger) {
			//warningPhoneCall(phoneTemplateAIN);
		}

		if (shouldLightIndicate && allowedToTrigger) {
			const hue = ppmToHue(co2);
			setLightColor(hue, 230, lightAIN);
		}
	});
}