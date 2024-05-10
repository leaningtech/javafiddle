<script lang="ts">
	import { PUBLIC_CHEERPJ_ORIGIN } from '$env/static/public';
	import { onMount, createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{ ready: undefined }>();

	export let display: HTMLElement;

	let promise: Promise<string | void> = new Promise(() => {});
	let error = false;

	// Load build of CheerpJ by getting url from LATEST.txt and placing it in script tag
	onMount(() => {
		promise = fetch(`${PUBLIC_CHEERPJ_ORIGIN}/LATEST.txt`)
			.then((res) => res.text())
			.then((text) => text.trim())
			.catch((err) => {
				console.error('Error loading CheerpJ', err);
				error = true;
			});
	});

	async function onLoad() {
		// CheerpJ funcs should be available now
		if (!cheerpjInit || !display) {
			error = true;
			return;
		}

		await cheerpjInit({
			status: 'none',
			javaProperties: ['java.library.path=/app/cheerpj-natives/natives']
		});
		cheerpjCreateDisplay(-1, -1, display);
		dispatch('ready');
	}
</script>

<svelte:head>
	{#await promise}
		<!-- CheerpJ is loading -->
	{:then src}
		{#if src}
			<script {src} on:load={onLoad}></script>
		{/if}
	{/await}
</svelte:head>

{#if error}
	<strong class="p-3">Error loading CheerpJ</strong>
{/if}
