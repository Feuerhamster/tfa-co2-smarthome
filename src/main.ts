import { initDevice } from "./co2Monitor.js";
import { initAPI } from "./api.js";
import { startLoggingAndPurging } from "./store.js";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const logIntervalMinutes = process.env.LOG_INTERVAL
	? parseFloat(process.env.LOG_INTERVAL)
	: 5;
const logPurgeKeepDays = process.env.LOG_PURGE_KEEP_DAYS
	? parseFloat(process.env.LOG_PURGE_KEEP_DAYS)
	: 5;

initDevice();
initAPI(port);
startLoggingAndPurging(logIntervalMinutes, logPurgeKeepDays);
