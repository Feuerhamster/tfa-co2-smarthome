import type { Co2Response } from "co2-monitor";
import Express, { Request, Response } from "express";
import { formatSSE } from "./utils.js";
import { co2Monitor } from "./co2Monitor.js";
import cors from "cors";
import {
	configKeys,
	config,
	logs,
	ConfigKey,
	logDB,
	configDB,
	getAveragePPM,
} from "./store.js";
import path from "path";

const showLogCount = process.env.SHOW_LOG_COUNT
	? parseFloat(process.env.SHOW_LOG_COUNT)
	: 36;

const logAverageDaysBack = process.env.LOG_PURGE_KEEP_DAYS
	? parseFloat(process.env.LOG_PURGE_KEEP_DAYS)
	: 5;

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

	const co2DataListener = (data: Co2Response) => {
		res.write(formatSSE("co2", data.value));
	};

	co2Monitor.on("co2", co2DataListener);

	const logDataListener = (key: number, value: number) => {
		res.write(formatSSE("log", [key, value]));
	};

	logDB.on("put", logDataListener);

	const configDataListener = (key: ConfigKey, value: boolean) => {
		console.log(key, value);
		res.write(formatSSE("config", { key, value }));
	};

	configDB.on("put", configDataListener);

	// sent initial value
	if (co2Monitor.co2) {
		res.write(formatSSE("co2", co2Monitor.co2.value));
	}

	function cleanup() {
		clearInterval(pingInterval);
		co2Monitor.off("co2", co2DataListener);
		logDB.off("put", logDataListener);
		configDB.off("put", configDataListener);
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

api.get("/api/config", async (req, res) => {
	const conf = {
		phone_alert: await config("phone_alert"),
		light_indicator: await config("light_indicator"),
		auto_absence_switching: await config("auto_absence_switching"),
	};

	res.send(conf);
});

api.get("/api/stats", async (req, res) => {
	const averagePPM = await getAveragePPM(logAverageDaysBack);

	res.send({
		daysBack: logAverageDaysBack,
		average: averagePPM,
	});
});

api.put(
	"/api/config/:key",
	async (
		req: Request<{ key: ConfigKey }, {}, { value: boolean }>,
		res: Response<boolean>,
	) => {
		if (
			!configKeys.includes(req.params.key) ||
			typeof req.body.value !== "boolean"
		) {
			return res.status(422).end();
		}

		console.log(req.body);

		const r = await config(req.params.key, req.body.value);
		res.send(r);
	},
);

export function initAPI(port: number) {
	const server = api.listen(port, () => {
		console.info("API listening on port " + port);
	});

	process.on("SIGINT", () => {
		server.close();
		process.exit();
	});
}
