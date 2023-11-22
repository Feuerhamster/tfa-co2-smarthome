<script lang="ts">
	import SwitchButton from "$lib/SwitchButton.svelte";
	import Chart from "$lib/Chart.svelte";
	import IndicatorBox from "$lib/IndicatorBox.svelte";
	import { PhoneCall, PhoneMissed, Lightbulb, LightbulbOff, Wifi, WifiOff } from "lucide-svelte";
	import { config, logs, ppm } from "$lib/stores";
	import { setConfig } from "$lib/api";
</script>

<IndicatorBox value={$ppm} />

<section>
	<Chart data={$logs} />
</section>

<section>
	<SwitchButton label="Telefonalarm" icon={[PhoneCall, PhoneMissed]} active={$config.phone_alert} on:click={() => setConfig("phone_alert", !$config.phone_alert)}/>
	<SwitchButton label="Lichtindikator" icon={[Lightbulb, LightbulbOff]} active={$config.light_indicator} on:click={() => setConfig("light_indicator", !$config.light_indicator)}/>
	<SwitchButton label="Autom. Abwesenheitsschaltung" icon={[Wifi, WifiOff]} active={$config.auto_absence_switching} on:click={() => setConfig("auto_absence_switching", !$config.auto_absence_switching)}/>
</section>

<style lang="scss">
	section {
		display: flex;
		flex-direction: column;
		padding: 0 0.8rem;
		gap: 1rem;
	}
</style>