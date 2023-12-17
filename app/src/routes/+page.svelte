<script lang="ts">
	import Chart from "$lib/Chart.svelte";
	import IndicatorBox from "$lib/IndicatorBox.svelte";
	import { Wind, Cloudy } from "lucide-svelte";
	import { logs, ppm } from "$lib/stores";
	import InformationBox from "$lib/InformationBox.svelte";
	import { getGradient, getTimeUntilValueReached } from "$lib/prediction";
	import { get } from "svelte/store";
	import StatsComponent from "$lib/StatsComponent.svelte";
	import HeaderGroup from "$lib/HeaderGroup.svelte";

	let timePrediction = 0;
	const targetValue = 1400;
	let lastPPMUpdate = Date.now();
	let ppmPerHour = 0;

	setInterval(updatePrediction, 1000 * 30);
	ppm.subscribe(() => {
		lastPPMUpdate = Date.now();
		updatePrediction();
	});
	logs.subscribe(updatePrediction);

	function updatePrediction() {
		const gradient = getGradient(get(logs));
		const timeFromLastPPM = getTimeUntilValueReached(
			get(ppm),
			gradient,
			targetValue,
		);
		const timeToLastPPMUpdate = (Date.now() - lastPPMUpdate) / 1000;
		timePrediction = Math.floor((timeFromLastPPM - timeToLastPPMUpdate) / 60);
		ppmPerHour = Math.round(gradient * 60 * 60);
	}

	let ventlationValue = "0 Minuten";

	$: {
		ventlationValue =
			timePrediction > 0 ? `${timePrediction} Minuten` : "Jetzt lüften!";

		if (timePrediction > 120) {
			const h = parseFloat((timePrediction / 60).toFixed(1));
			ventlationValue = `${h} Stunden`;
		} else if (timePrediction <= 120 && timePrediction > 0) {
			ventlationValue = `${timePrediction} Minuten`;
		} else {
			ventlationValue = "Jetzt lüften!";
		}
	}
</script>

<IndicatorBox value={$ppm} />

<section>
	<HeaderGroup
		title="Aktueller Bericht"
		subtitle="Basierend auf den letzten 3 Stunden"
	/>
	<InformationBox
		icon={Wind}
		title="Vorraussichtlich lüften (bei {targetValue} PPM)"
		value={ventlationValue}
		iconColor="var(--color-blue)"
	/>
	<InformationBox
		icon={Cloudy}
		title="Anstieg CO2 pro Stunde"
		value={`${ppmPerHour} PPM`}
		iconColor="var(--color-secondary)"
	/>
</section>

<section>
	<Chart data={$logs} />
</section>

<StatsComponent />

<style lang="scss">
	section {
		display: flex;
		flex-direction: column;
		padding: 0 0.8rem;
		gap: 1rem;
	}
</style>
