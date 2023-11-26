<script lang="ts">
	import Chart from "chart.js/auto";
	import { onMount } from "svelte";

	export let data: [number, number][];

	let chartCanvas: HTMLCanvasElement;

	let chart: Chart;

	onMount(async () => {
		chart = new Chart(chartCanvas, {
			type: "line",
			data: {
				xLabels: [],
				datasets: [
					{
						label: "PPM",
						borderColor: "#fff",
						data: [],
						tension: 0.4,
						cubicInterpolationMode: "monotone",
					},
				],
			},
			options: {
				color: "#FFF",
				responsive: true,
				borderColor: "#FFFFFF00",
				plugins: {
					legend: {
						display: false,
					},
				},
				scales: {
					x: {
						ticks: {
							display: false,
						},
					},
					y: {
						min: 400,
						max: 1800,
					},
				},
			},
		});

		updateChartData(data);
	});

	function updateChartData(data: [number, number][]) {
		chart.data.datasets[0].data = data.map((a) => a[1]);
		chart.data.xLabels = data.map((a) => new Date(a[0]).toLocaleString());
		chart.update();
	}

	$: {
		if (chart) {
			updateChartData(data);
		}
	}

	$: {
		console.log(data);
	}
</script>

<article>
	<hgroup>
		<h2>Verlauf</h2>
		<h3>letzen 3 Stunden</h3>
	</hgroup>

	<canvas bind:this={chartCanvas}></canvas>
</article>

<style lang="scss">
	article {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	canvas {
		max-width: 100%;
	}

	hgroup {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;

		h2 {
			font-size: 1.4rem;
			font-weight: 800;
		}

		h3 {
			opacity: 0.75;
			font-weight: normal;
			font-size: 0.8rem;
		}
	}
</style>
