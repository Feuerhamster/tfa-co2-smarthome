<script lang="ts">
	export let title: string;
	export let subtitle: string | null = null;
</script>

<hgroup>
	<h2>{title}</h2>
	{#if subtitle}
		<h3>{subtitle}</h3>
	{/if}
</hgroup>

<style lang="scss">
	hgroup {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;

		h2 {
			font-size: 1.25rem;
			font-weight: bold;
		}

		h3 {
			opacity: 0.75;
			font-weight: normal;
			font-size: 0.8rem;
		}
	}
</style>
