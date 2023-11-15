<script lang="ts">
	export let icon: [ConstructorOfATypedSvelteComponent, ConstructorOfATypedSvelteComponent];
	export let label: string;
	export let active: boolean;
</script>

<button class:active on:click role="switch" aria-checked={active}>
	<svelte:component this={active ? icon[0] : icon[1]} size={26} />
	<span class="label">{label}</span>
	<span class="track">
		<div class="dot" class:active></div>
	</span>
</button>

<style lang="scss">
	button {
		background-color: rgba(255, 255, 255, 0.06);
		border-radius: 1rem;
		padding: 0.8rem 1rem;

		border: none;
		display: flex;
		cursor: pointer;

		transition: background-color 0.2s;

		@media (prefers-reduced-motion) {
			transition: none;
		}
		
		display: flex;
		align-items: center;
		gap: 0.8rem;

		&:active {
			background-color: rgba(255, 255, 255, 0.04);
		}

		:global(svg) {
			display: inline-flex;
			color: var(--color-secondary);
			transition: color 0.2s;
		}

		&.active {
			:global(svg) {
				color: var(--color-primary);
			}
		}
		
		.label {
			flex: 1;
			text-align: left;
		}
		
		.track {
			background-color: #4f5153;
			width: 40px;
			height: 20px;
			border-radius: 10px;
			position: relative;
			
			.dot {
				position: absolute;
				width: 20px;
				height: 20px;
				border-radius: 10px;
				
				left: 0;
				background-color: var(--color-secondary);
				
				transition: left 0.2s;
				
				&.active {
					left: 20px;
					background-color: var(--color-primary);
				}
			}
		}
	}
</style>