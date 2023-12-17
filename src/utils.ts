/**
 * util to format sse messages
 * @param event event name
 * @param data event data
 * @param id optional event id
 * @returns formatted string
 */
export function formatSSE(event: string, data?: any, id?: number) {
	let str = "";

	if (id) str += `id: ${id}\n`;

	str += `event: ${event}\n`;
	if (data) str += `data: ${JSON.stringify(data)}\n`;

	str += `\n`;

	return str;
}

/**
 * Calculate the average of values logged during a specific period of the day.
 *
 * @param logData - An array of log entries.
 * @param startTime - The start of the period (in hours, 24-hour format).
 * @param endTime - The end of the period (in hours, 24-hour format).
 * @return The average of the values logged during the specified period, or 0 if no entries were logged during this period.
 */
export function calculateDaytimeAverage(
	logData: [number, number][],
	startTime: number,
	endTime: number,
): number {
	let sum = 0; // Initialize the sum of the values.
	let count = 0; // Initialize the count of the values.

	// Loop through the log data using the for...of loop.
	for (let entry of logData) {
		let date = new Date(entry[0]); // Convert the Unix timestamp to a Date object.
		let hours = date.getHours(); // Get the hour of the day.

		// Check if the hour is within the specified period.
		if (startTime < endTime) {
			// If the start time is less than the end time, then the period does not cross midnight.
			if (hours >= startTime && hours <= endTime) {
				sum += entry[1]; // Add the value to the sum.
				count++; // Increment the count.
			}
		} else {
			// If the start time is greater than the end time, then the period crosses midnight.
			if (hours >= startTime || hours <= endTime) {
				sum += entry[1]; // Add the value to the sum.
				count++; // Increment the count.
			}
		}
	}

	// Calculate and return the average, or return 0 if no entries were logged during the specified period.
	return count > 0 ? sum / count : 0;
}
