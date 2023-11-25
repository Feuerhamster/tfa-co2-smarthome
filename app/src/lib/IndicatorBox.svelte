<script lang="ts">
	import { tick } from "svelte";
	import PulseIndicator from "./PulseIndicator.svelte";
	import { EConnectionState, color, connectionState, themeColor } from "./stores";
	import { ppmToHue } from "./colorConversion.js";

	export let value: number;

	$: $color = ppmToHue(value);

	let notification = "Gute Luftqualität";
	let connectionNotice = ""

	$: {
		if (value > 900 && value < 1400) {
			notification = "Warnung"
		} else if(value >= 1400) {
			notification = "CO2 Kritsch"
		}

		switch($connectionState) {
			case EConnectionState.Connected:
				connectionNotice = "Verbunden";
				break;
			case EConnectionState.Disconnected:
				connectionNotice = "Nicht verbunden";
				break;
				case EConnectionState.Connecting:
				connectionNotice = "Verbinde...";
				break;
			default:
				break;
		}
	}

	let metaElement: Element;
	
	color.subscribe(async () => {
		await tick();
		if (metaElement) {
			const color = getComputedStyle(metaElement).backgroundColor;
			if (!color.startsWith("color")) {
				return;
			}
			
			const [_, r, g, b] = /color\(srgb ([0-9.]+) ([0-9.]+) ([0-9.]+)\)/.exec(color) as unknown as [string, string, string, string];
			const to255 = (n: string) => Math.floor(parseFloat(n) * 255);
			$themeColor = `#${to255(r).toString(16)}${to255(g).toString(16)}${to255(b).toString(16)}`;
		}
	});
</script>

<article style="--background-color: hsl({$color}, 55%, 52%)">
	<section class="meta-info" bind:this={metaElement}>
		<p>{notification}</p>
		<span class="inline">
			{#if $connectionState === EConnectionState.Connected}
				<PulseIndicator />
			{/if}
			{connectionNotice}
		</span>
	</section>
	<hgroup>
		<h1>Raumluft CO2 (PPM)</h1>
		<h2>
			{#if value}
				{ value }
			{:else}
				Lade...
			{/if}
		</h2>
	</hgroup>
</article>

<style lang="scss">
	article {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: center;
		gap: 1rem;
		user-select: none;

		border-radius: 0 0 1.4rem 1.4rem;
		background-color: var(--background-color);
		
		hgroup {
			display: flex;
			align-items: center;
			padding: 0rem 0 1.2rem 0;
			flex-direction: column-reverse;
			text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
			font-weight: 700;

			h1 {
				font-size: 1rem;
			}

			h2 {
				font-size: 5rem;
			}
		}

		section {
			display: flex;
			align-items: center;

			padding: 0.4rem 0.8rem;
			justify-content: space-between;
			
			background-color: color-mix(in srgb, rgb(0, 0, 0) 25%, var(--background-color));
			border-radius: 0 0 0.8rem 0.8rem;
			font-weight: 500;
			height: 2rem;

			.inline {
				display: flex;
				align-items: center;
				gap: 0.2rem;
			}
		}
	}
</style>