<script lang="ts">
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';
	import { color, ppm } from './stores';

	let chartCanvas: HTMLCanvasElement;

	let chart: Chart;

	Chart.defaults.plugins.legend.display = false;
	Chart.defaults.borderColor = "rgba(255, 255, 255, 0)";
	Chart.defaults.color = '#FFF';

	onMount(async () => {
		chart = new Chart(chartCanvas, {
			type: 'line',
			data: {
				xLabels: [],
				datasets: [{
					label: 'PPM',
					borderColor: '#fff',
					data: [],
					tension: 0.4,
					cubicInterpolationMode: 'monotone'
				}]
			},
			options: {
				responsive: true,
				scales: {
					x: {
						ticks: {
							display: false
						}
					},
					y: {
						min: 400
					}
				}
			}
		});
	})

	$: {
		if(chart) {
			chart.data.datasets[0].borderColor = `hsl(${$color}, 55%, 52%)`
			chart.update();
		}
	}
	
	ppm.subscribe((value) => {
		if(chart) {

			if (chart.data.datasets[0].data.length <= 24) {
				chart.data.datasets[0].data.push(value)
				chart.data.xLabels?.push(1)
			}

			chart.update();
		}
	})
</script>


<article>
	<h2>
		Verlauf
	</h2>
	
	<canvas bind:this={chartCanvas}></canvas>
</article>

<style lang="scss">

	article {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	h2 {
		font-size: 1.4rem;
		font-weight: 800;
	}
</style>