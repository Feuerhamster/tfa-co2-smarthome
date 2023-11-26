<script lang="ts">
	import { BarChart3, Sun } from "lucide-svelte";
	import InformationBox from "./InformationBox.svelte";
	import { stats } from "./stores";
	import LoadingSpinner from "./LoadingSpinner.svelte";
	import HeaderGroup from "./HeaderGroup.svelte";
</script>

<section>
	<HeaderGroup
		title="Statistiken"
		subtitle="Durchschnitt (letzten {$stats?.daysBack} Tage)"
	/>

	{#if $stats}
		<div>
			<InformationBox
				icon={Sun}
				title="Tagsüber ({$stats.daytimeHours[0]} bis {$stats
					.daytimeHours[1]} Uhr)"
				value="{Math.round($stats.daytimeAverage)} PPM"
				iconColor="var(--color-yellow)"
			/>
			<InformationBox
				icon={BarChart3}
				title="Gesamt"
				value="{Math.round($stats.totalAverage)} PPM"
				iconColor="var(--color-pink)"
			/>
		</div>
	{:else}
		<LoadingSpinner />
	{/if}
</section>

<style lang="scss">
	section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 0 0.8rem;

		div {
			display: flex;
			justify-content: stretch;
			gap: 1rem;
			flex-wrap: wrap;

			:global(*) {
				justify-self: stretch;
				flex: 1;
				white-space: nowrap;
			}
		}
	}
</style>
