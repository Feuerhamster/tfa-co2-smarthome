<script lang="ts">
	import LoadingSwitchButton from "$lib/LoadingSwitchButton.svelte";
	import Chart from "$lib/Chart.svelte";
	import IndicatorBox from "$lib/IndicatorBox.svelte";
	import { PhoneCall, PhoneMissed, Lightbulb, LightbulbOff, Wifi, WifiOff } from "lucide-svelte";
	import { config, logs, ppm } from "$lib/stores";
	import { putConfig } from "$lib/api";
	import { get } from "svelte/store";
	import { onMount } from "svelte";

</script>

<IndicatorBox value={$ppm} />

<section>
	<Chart data={$logs} />
</section>

<section>
	<LoadingSwitchButton label="Telefonalarm" icon={[PhoneCall, PhoneMissed]} active={$config.phone_alert} on:click={() => putConfig("phone_alert", !$config.phone_alert)}/>
	<LoadingSwitchButton label="Lichtindikator" icon={[Lightbulb, LightbulbOff]} active={$config.light_indicator} on:click={() => putConfig("light_indicator", !$config.light_indicator)}/>
	<LoadingSwitchButton label="Autom. Abwesenheitsschaltung" icon={[Wifi, WifiOff]} active={$config.auto_absence_switching} on:click={() => putConfig("auto_absence_switching", !$config.auto_absence_switching)}/>
</section>

<style lang="scss">
	section {
		display: flex;
		flex-direction: column;
		padding: 0 0.8rem;
		gap: 1rem;
	}
</style>