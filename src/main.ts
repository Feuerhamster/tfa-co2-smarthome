import { initDevice } from "./co2Monitor.js";
import { initAPI } from "./api.js";
import { startLoggingAndPurging } from "./store.js";
import dotenv from "dotenv";
import { logIntervalMinutes, logPurgeKeepDays } from "./config.js";

dotenv.config();

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

initDevice();
initAPI(port);
startLoggingAndPurging(logIntervalMinutes, logPurgeKeepDays);
