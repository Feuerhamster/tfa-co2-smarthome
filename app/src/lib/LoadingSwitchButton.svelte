<script lang=ts>
	import { createEventDispatcher } from "svelte";
	import SwitchButton from "./SwitchButton.svelte";
	export let icon: [ConstructorOfATypedSvelteComponent, ConstructorOfATypedSvelteComponent];
	export let label: string;
	export let active: boolean;

	const dispatch = createEventDispatcher();

	let value = false;
	let loading = false;
	let debouncedLoading = false;
	let debounceTimeout: ReturnType<typeof setTimeout> | undefined;

	$: active, onActive();
	function onActive() {
		value = active;
		loading = false;
	}

	$: loading, onLoading();
	function onLoading() {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(() => debouncedLoading = loading, 200);
	}

	function onClick() {
		value = !value;
		loading = true;
		dispatch("click", value);
	}

</script>

<SwitchButton {icon} {label} active={value} loading={debouncedLoading} on:click={onClick} />
