<script lang="ts">
	import { pwaInfo } from "virtual:pwa-info";
	import { registerSW } from "virtual:pwa-register";
	import '@fontsource/fira-sans/500.css';
	import '@fontsource/fira-sans/700.css';
	import { onMount } from "svelte";
	import { ppm, connectionState, EConnectionState, themeColor } from "$lib/stores";

	if (pwaInfo) {
		registerSW({
			immediate: true,
			onRegistered(r) {
				console.log(`SW Registered: ${r}`);
			},
			onRegisterError(error) {
				console.log("SW registration error", error);
			},
		});
	}

	$: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : "";

	onMount(() => {
		$connectionState = EConnectionState.Connecting;
		const events = new EventSource("http://192.168.178.26:3000/data-stream");

		events.addEventListener("co2", (ev) => {
			$ppm = parseInt(ev.data);
		});

		events.onopen = () => {
			$connectionState = EConnectionState.Connected;
		};
		events.onerror = () => {
			$connectionState = EConnectionState.Disconnected;
		};
	});
	
	let i = 0;
	setInterval(() => i += 1, 1000);
</script>

<svelte:head>
	{@html webManifest}
	{#if $themeColor !== ""}
		{#key i}
			<meta name="theme-color" content={$themeColor} />
		{/key}
	{/if}
</svelte:head>

<slot />

<style lang="scss">
	@import "../scss/colors.scss";

	:global(*) {
		box-sizing: border-box;
	}

	:global(html) {
		min-height: 100%;
		color: white;
		font: 18px "Fira Sans", sans-serif;
		letter-spacing: 0.04rem;
	}

	:global(body) {
		background-color: var(--color-bg);
		font-weight: 400;
		font-size: 1rem;
		min-height: 100vh;
		width: 100%;
		padding: 0;
		margin: 0;
		display: flex;
		justify-content: center;
	}

	:global(main) {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		justify-content: flex-start;
		gap: 2rem;
		min-height: 100vh;
		max-width: 580px;
		flex-grow: 1;
	}
</style>
