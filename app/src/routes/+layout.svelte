<script lang="ts">
	import { pwaInfo } from "virtual:pwa-info";
	import { registerSW } from "virtual:pwa-register";
	import "@fontsource/fira-sans/500.css";
	import "@fontsource/fira-sans/700.css";
	import { onMount } from "svelte";
	import { getConfigComplete, getLogs, sseConnection } from "$lib/api";
	import { logs } from "$lib/stores";

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

	onMount(async () => {
		sseConnection();
		getConfigComplete();
		$logs = await getLogs();
	});
</script>

<svelte:head>
	{@html webManifest}
</svelte:head>

<slot />

<style lang="scss">
	@import "../scss/colors.scss";

	:global(*) {
		box-sizing: border-box;
	}

	:global(html) {
		color: white;
		font:
			18px "Fira Sans",
			sans-serif;
		letter-spacing: 0.04rem;
	}

	:global(body) {
		background-color: var(--color-bg);
		font-weight: 400;
		font-size: 1rem;
		min-height: 100svh;
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
		gap: 1.5rem;
		min-height: 100vh;
		max-width: 580px;
		flex-grow: 1;
		padding-bottom: 1rem;
	}
</style>
