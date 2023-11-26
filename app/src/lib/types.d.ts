export interface ConfigStore {
	phone_alert: boolean;
	light_indicator: boolean;
	auto_absence_switching: boolean;
}

export interface StatsData {
	daysBack: number;
	totalAverage: number;
	daytimeAverage: number;
	daytimeHours: [number, number];
}

export type Timestamp = number;
export type PPM = number;
