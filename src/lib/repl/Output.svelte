<script lang="ts">
	import CheerpJ from '$lib/CheerpJ.svelte';
	import Icon from '@iconify/svelte';
	import { files, loading, type File } from './state';
	import { theme } from '$lib/settings/store';
	import Loading from '$lib/Loading.svelte';

	export let showLink: boolean;
	let consoleEl: HTMLPreElement;
	let display: HTMLElement;
	let lwjglCanvas: HTMLCanvasElement;

	$: if (lwjglCanvas) window.lwjglCanvasElement = lwjglCanvas;

	let cheerpj: CheerpJ;

	async function ready() {
		if (window.parent !== window && window.parent) {
			// Tell parent frame we are ready to recieve files
			window.parent.postMessage({ action: 'ready' }, window.location.origin);
		} else {
			// Load files from load function
			files.set($files); // Force file write
			cheerpj?.compileAndRun();
		}
	}

	function onMessage(event: MessageEvent) {
		if (event.origin !== window.location.origin) return;

		const { action } = event.data;
		console.log('recv from top', event.data);

		if (action === 'reload') {
			window.location.reload();
		} else if (action === 'run') {
			files.set(event.data.files);
			cheerpj?.compileAndRun();
		} else if (action === 'theme_change') {
			$theme = JSON.parse(localStorage['theme']);
		}
	}
</script>

<svelte:window on:message={onMessage} />

<div class="w-screen h-screen" class:hidden={!$loading}>
	<Loading />
</div>

<div class="grid grid-cols-2 grow">
	<section class="border-r border-stone-200 dark:border-stone-700">
		<div class="p-3 h-full overflow-scroll text-stone-800 dark:text-stone-100">
			<div class="flex text-stone-500 text-sm select-none pb-3">
				Console

				<button
					class="ml-auto text-xs hover:underline text-stone-400 dark:text-stone-600"
					on:click={() => (consoleEl.innerText = '')}
				>
					Clear
				</button>
			</div>

			<!-- CheerpJ implicitly looks for a #console to write to -->
			<pre class="font-mono text-sm h-0" bind:this={consoleEl} id="console" />
		</div>
	</section>
	<section class="flex flex-col">
		<div class="p-3 text-stone-500 text-sm select-none">Result</div>
		<div class="grow relative" bind:this={display}>
			<canvas bind:this={lwjglCanvas} class="absolute inset-0 w-full h-full" />
			<!-- #cheerpjDisplay will be inserted here -->
		</div>
	</section>
</div>

<div class="absolute top-0 right-0 text-stone-500 text-sm flex items-center select-none">
	{#if showLink}
		<!-- svelte-ignore a11y-invalid-attribute -->
		<a href="" target="_blank" rel="noreferrer" class="px-2 py-2" title="Open in new tab">
			<Icon icon="mi:external-link" class="w-5 h-5" />
		</a>
	{/if}
</div>

<style>
	:global(#cheerpjDisplay) {
		box-shadow: none;
	}
</style>

<CheerpJ bind:this={cheerpj} on:ready={ready} {display} {consoleEl} />
