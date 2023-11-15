<script lang="ts">
	import SwitchButton from "$lib/SwitchButton.svelte";
	import Chart from "$lib/Chart.svelte";
	import IndicatorBox from "$lib/IndicatorBox.svelte";
	import { PhoneCall, PhoneMissed, Lightbulb, LightbulbOff, Wifi, WifiOff } from "lucide-svelte";
	import { ppm } from "$lib/stores";

	/*setTimeout(() => {
		setInterval(() => $ppm += Math.round(Math.random() * 70), 2000);
	}, 1000);*/

	let active = true;
</script>

<IndicatorBox value={$ppm} />

<section>
	<Chart />
</section>

<section>
	<SwitchButton label="Telefonalarm" icon={[PhoneCall, PhoneMissed]} active={active} on:click={() => active = !active}/>
	<SwitchButton label="Lichtindikator" icon={[Lightbulb, LightbulbOff]} active={active} on:click={() => active = !active}/>
	<SwitchButton label="Autom. Abwesenheitsschaltung" icon={[Wifi, WifiOff]} active={active} on:click={() => active = !active}/>
</section>

<style lang="scss">
	section {
		display: flex;
		flex-direction: column;
		padding: 0 0.8rem;
		gap: 1rem;
	}
</style>