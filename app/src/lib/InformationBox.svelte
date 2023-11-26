<script lang="ts">
	export let icon: ConstructorOfATypedSvelteComponent;
	export let title: string;
	export let value: string;
	export let iconColor: string | undefined = undefined;
</script>

<article style="--icon-color: {iconColor}">
	<h2>{title}</h2>
	<svelte:component this={icon} class="icon" size={48} />
	<span>{value}</span>
</article>

<style lang="scss">
	article {
		background-color: rgba(255, 255, 255, 0.06);
		border-radius: 1rem;
		padding: 1rem 1rem;
		border: none;
		display: grid;
		grid-template-areas:
			"i v"
			"i h";

		grid-template-columns: auto 1fr;
		column-gap: 0.8rem;
		row-gap: 0.4rem;

		:global(.icon) {
			grid-area: i;
			align-self: center;
			color: var(--icon-color, inherit);
		}

		h2 {
			grid-area: h;
			font-size: 0.8rem;
			opacity: 0.75;
		}

		span {
			grid-area: v;
			font-size: 1.5rem;
		}
	}
</style>
