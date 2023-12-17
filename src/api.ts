import type { Co2Response, TemperatureResponse } from "co2-monitor";
import Express, { Request, Response } from "express";
import { formatSSE } from "./utils.js";
import { co2Monitor } from "./co2Monitor.js";
import cors from "cors";
import { logs, logDB, getAveragePPM } from "./store.js";
import path from "path";

const showLogCount = process.env.SHOW_LOG_COUNT
	? parseFloat(process.env.SHOW_LOG_COUNT)
	: 36;

const logAverageDaysBack = process.env.LOG_PURGE_KEEP_DAYS
	? parseFloat(process.env.LOG_PURGE_KEEP_DAYS)
	: 5;

const daytimeHours = process.env.STATS_DAYTIME_HOURS
	? (process.env.STATS_DAYTIME_HOURS.split(",").map((e) => parseFloat(e)) as [
			number,
			number,
	  ])
	: ([7, 2] as [number, number]);

const api = Express();

api.use(cors());
api.use(Express.json());

const appPath = path.join(process.cwd(), "/app/build");

api.use(Express.static(appPath));

api.get("/api/data-stream", (req, res) => {
	// Establish SSE
	res.writeHead(200, {
		"Cache-Control": "no-cache",
		"Content-Type": "text/event-stream",
		Connection: "Keep-Alive",
		"Transfer-Encoding": "chunked",
	});
	res.write("\n");

	// Ping interval to prevent browser error because no data received
	let pingInterval = setInterval(() => {
		res.write(formatSSE("ping"));
	}, 5 * 1000);

	// CO2
	const co2DataListener = (data: Co2Response) => {
		res.write(formatSSE("co2", data.value));
	};

	co2Monitor.on("co2", co2DataListener);

	// Temp
	const tempDataListener = (data: TemperatureResponse) => {
		res.write(formatSSE("temp", data.value));
	};

	co2Monitor.on("temperature", tempDataListener);

	// LOG
	const logDataListener = (key: number, value: number) => {
		res.write(formatSSE("log", [key, value]));
	};

	logDB.on("put", logDataListener);

	// sent initial value
	if (co2Monitor.co2) {
		res.write(formatSSE("co2", co2Monitor.co2.value));
	}

	function cleanup() {
		clearInterval(pingInterval);
		co2Monitor.off("co2", co2DataListener);
		co2Monitor.off("temperature", tempDataListener);
		logDB.off("put", logDataListener);
	}

	// Remove listener and end ping interval
	req.on("close", cleanup);
	req.on("error", cleanup);
});

api.get("/api/logs", async (req, res) => {
	const l = await logs(showLogCount);
	console.log(l);
	res.send(l);
});

api.get("/api/stats", async (req, res) => {
	const { totalAverage, daytimeAverage } = await getAveragePPM(
		logAverageDaysBack,
		daytimeHours,
	);

	res.send({
		daysBack: logAverageDaysBack,
		totalAverage,
		daytimeAverage,
		daytimeHours: daytimeHours,
	});
});

export function initAPI(port: number) {
	const server = api.listen(port, () => {
		console.info("API listening on port " + port);
	});

	process.on("SIGINT", () => {
		server.close();
		process.exit();
	});
}
