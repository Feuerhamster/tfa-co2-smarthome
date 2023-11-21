import { initDevice } from "./co2Monitor.js";
import { initAPI } from "./api.js";
import { startLoggingAndPurging } from "./store.js";
import { initFritzAPI } from "./fritz.js";
import { initFritzDeviceConnector } from "./connector.js";

import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const logIntervalMinutes = process.env.LOG_INTERVAL
	? parseFloat(process.env.LOG_INTERVAL)
	: 5;
const logPurgeKeepDays = process.env.LOG_PURGE_KEEP_DAYS
	? parseFloat(process.env.LOG_PURGE_KEEP_DAYS)
	: 5;

const fritzUsername = process.env.FRITZ_USERNAME ?? "";
const fritzPassword = process.env.FRITZ_PASSWORD ?? "";

const fritzPhoneTemplateAIN = process.env.FRITZ_PHONE_TEMPLATE_AIN ?? "";
const fritzLightAIN = process.env.FRITZ_LIGHT_AIN ?? "";

const deviceNamesForAbsenceCheckRaw = process.env.WIFI_HOSTNAMES_FOR_ABSENCE_CHECK ?? "";
const deviceNamesForAbsenceCheck = deviceNamesForAbsenceCheckRaw.split(",");


initDevice();
initAPI(port);
startLoggingAndPurging(logIntervalMinutes, logPurgeKeepDays);
initFritzAPI(fritzUsername, fritzPassword);
initFritzDeviceConnector(fritzPhoneTemplateAIN, fritzLightAIN, deviceNamesForAbsenceCheck);