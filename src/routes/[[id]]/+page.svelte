<script lang="ts">
	import Repl from '$lib/Repl.svelte';
	import UpdateDialog from '$lib/UpdateDialog.svelte';
	import { files, selectedFilePath } from '$lib/repl/state.js';
	import { onMount } from 'svelte';

	export let data;

	onMount(async () => {
		const data = window.location.hash.substring(1);
		if (data) {
			const { decompressFromEncodedURIComponent } = await import('lz-string');
			$files = [
				{
					path: 'JavaFiddle.java',
					content: decompressFromEncodedURIComponent(data)
				}
			];
			$selectedFilePath = 'JavaFiddle.java';
		}
	});

	// Old JavaFiddle used cookies (for GA), but we don't use any cookies.
	// So if there are any cookies, we know this user used the old JavaFiddle before.
	let usedOldJavaFiddle = false;
	onMount(() => {
		if (document.cookie.length) {
			usedOldJavaFiddle = true;
		}
	});
</script>

<Repl outputUrl={data.outputUrl} />

{#if usedOldJavaFiddle}
	<UpdateDialog />
{/if}
