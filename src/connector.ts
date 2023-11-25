import { co2Monitor } from "./co2Monitor.js";
import { getWifiDevices, setLightColor, warningPhoneCall } from "./fritz.js";
import { config } from "./store.js";
import { coarsifyValue, ppmToHue } from "./utils.js";

class AbsenceChecker {
	private notAbsentCached?: boolean;
	private wifiDevicesForAbsenceSwitching: string[];

	constructor(wifiDevicesForAbsenceSwitching: string[]) {
		this.wifiDevicesForAbsenceSwitching = wifiDevicesForAbsenceSwitching;
	}

	private async asbenceCheck() {
		const wifiDevices = await getWifiDevices();
		const notAbsent = wifiDevices.some(
			(dev) =>
				this.wifiDevicesForAbsenceSwitching.includes(dev.name) &&
				dev.type === "active",
		);
		return notAbsent;
	}

	async getNotAbsent() {
		if (this.notAbsentCached !== undefined) {
			return this.notAbsentCached;
		} else {
			this.notAbsentCached = await this.asbenceCheck();
			return this.notAbsentCached;
		}
	}
}

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
		const asbenceChecker = new AbsenceChecker(wifiDevicesForAbsenceSwitching);

		console.log("co2: " + co2);

		if (shouldPhoneAlert && co2 >= phoneAlertThreshold && !phoneTriggered) {
			if (!shouldAutoAbsenceSwitching || await asbenceChecker.getNotAbsent()) {
				warningPhoneCall(phoneTemplateAIN);
				phoneTriggered = true;
				console.log("warning phone call triggered...");
			}
		}

		// do not trigger phone call every time again, only if the value has dropped below threshold before
		if (co2 < phoneAlertThreshold) phoneTriggered = false;

		const coarsifiedCo2 = coarsifyValue(co2);

		// value coarsifed to not spam the light change api
		if (shouldLightIndicate && coarsifiedCo2 !== lightChangeValue) {
			if (!shouldAutoAbsenceSwitching || await asbenceChecker.getNotAbsent()) {
				const hue = ppmToHue(co2);
				setLightColor(hue, 230, lightAIN);
				lightChangeValue = coarsifiedCo2;
				console.log("trigger light change...");
			}
		}
	});
}
