<div class="loading-spinner">
	<span class="sr-only">loading</span>
</div>

<style lang="scss">
	.loading-spinner {
		width: 1em;
		height: 1em;
		border-radius: 50%;
		border-width: 0.15em;
		border-color: transparent;
		border-bottom-color: currentColor;
		border-right-color: currentColor;
		border-style: solid;
		animation: spin 0.8s infinite linear;

		@keyframes spin {
			0% {
				transform: rotate(0deg);
			}
			100% {
				transform: rotate(360deg);
			}
		}
	}

	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		padding: 0;
		margin: -1px;
		clip: rect(0, 0, 0, 0);
		border: 0;
	}
</style>
