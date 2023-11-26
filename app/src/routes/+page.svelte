<script lang="ts">
	import LoadingSwitchButton from "$lib/LoadingSwitchButton.svelte";
	import Chart from "$lib/Chart.svelte";
	import IndicatorBox from "$lib/IndicatorBox.svelte";
	import {
		PhoneCall,
		PhoneMissed,
		Lightbulb,
		LightbulbOff,
		Wifi,
		WifiOff,
		Wind,
	} from "lucide-svelte";
	import { config, logs, ppm, stats } from "$lib/stores";
	import { putConfig } from "$lib/api";
	import InformationBox from "$lib/InformationBox.svelte";
	import { getGradient, getTimeUntilValueReached } from "$lib/prediction";
	import { get } from "svelte/store";
	import StatsComponent from "$lib/StatsComponent.svelte";
	import HeaderGroup from "$lib/HeaderGroup.svelte";

	let timePrediction = 0;
	const targetValue = 1400;
	let lastPPMUpdate = Date.now();

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
	}

	let ventlationValue = "0 Minuten";

	$: {
		ventlationValue =
			timePrediction > 0 ? `${timePrediction} Minuten` : "Jetzt lüften!";
	}
</script>

<IndicatorBox value={$ppm} />

<section>
	<InformationBox
		icon={Wind}
		title="Vorraussichtlich lüften (bei {targetValue} PPM)"
		value={ventlationValue}
		iconColor="var(--color-blue)"
	/>
</section>

<section>
	<Chart data={$logs} />
</section>

<StatsComponent />

<section>
	<HeaderGroup title="Einstellungen" />

	<LoadingSwitchButton
		label="Telefonalarm"
		icon={[PhoneCall, PhoneMissed]}
		active={$config.phone_alert}
		on:click={() => putConfig("phone_alert", !$config.phone_alert)}
	/>
	<LoadingSwitchButton
		label="Lichtindikator"
		icon={[Lightbulb, LightbulbOff]}
		active={$config.light_indicator}
		on:click={() => putConfig("light_indicator", !$config.light_indicator)}
	/>
	<LoadingSwitchButton
		label="Autom. Abwesenheitsschaltung"
		icon={[Wifi, WifiOff]}
		active={$config.auto_absence_switching}
		on:click={() =>
			putConfig("auto_absence_switching", !$config.auto_absence_switching)}
	/>
</section>

<style lang="scss">
	section {
		display: flex;
		flex-direction: column;
		padding: 0 0.8rem;
		gap: 1rem;
	}
</style>
