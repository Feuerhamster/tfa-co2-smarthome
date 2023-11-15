import type { Co2Response } from "co2-monitor";
import Express from "express";
import { formatSSE } from "./utils.js";
import { co2Monitor } from "./co2Monitor.js";
import cors from "cors";

const api = Express();

api.use(cors())

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const listeners = new Set<(data: Co2Response) => void>();



api.get("/data-stream", (req, res) => {
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

	// sent initial value
	if (co2Monitor.co2) {
		res.write(formatSSE("co2", co2Monitor.co2.value));
	}
	
	function cleanup() {
		clearInterval(pingInterval);
		co2Monitor.off("co2", co2DataListener)
	}

	// Remove listener and end ping interval
	req.on("close", cleanup);
	req.on("error", cleanup);
});

export function initAPI() {
	const server = api.listen(port, () => {
		console.info("API listening on port " + port);
	});	

	process.on("SIGINT", () => {
		server.close()
		process.exit();
	});
}