export const logIntervalMinutes = process.env.LOG_INTERVAL
	? parseFloat(process.env.LOG_INTERVAL)
	: 5;
export const logPurgeKeepDays = process.env.LOG_PURGE_KEEP_DAYS
	? parseFloat(process.env.LOG_PURGE_KEEP_DAYS)
	: 5;

export const showLogCount = process.env.SHOW_LOG_COUNT
	? parseFloat(process.env.SHOW_LOG_COUNT)
	: 36;

export const logAverageDaysBack = process.env.LOG_PURGE_KEEP_DAYS
	? parseFloat(process.env.LOG_PURGE_KEEP_DAYS)
	: 5;

export const daytimeHours = process.env.STATS_DAYTIME_HOURS
	? (process.env.STATS_DAYTIME_HOURS.split(",").map((e) => parseFloat(e)) as [
			number,
			number,
	  ])
	: ([7, 2] as [number, number]);

export const ppmTargetValue = process.env.PPM_TARGET_VALUE
	? parseFloat(process.env.PPM_TARGET_VALUE)
	: 1400;
