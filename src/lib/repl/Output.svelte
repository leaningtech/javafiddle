<script lang="ts">
	import CheerpJ from '$lib/CheerpJ.svelte';
	import Icon from '@iconify/svelte';
	import { isRunning } from './state';
	import Loading from '$lib/Loading.svelte';
	import { browser } from '$app/environment';

	let cjConsole: HTMLPreElement;
	export let isOutputMode = true;

	function viewInOutputMode() {
		if (browser) {
			const url = `/output/${window.location.hash}`;
			window.open(url, "_blank", "noreferrer");
		}
	}
</script>

<div class="w-full h-full" class:hidden={!$isRunning}>
	<Loading />
</div>

<div class="w-full h-full grid grid-cols-2 grow">
	<section class="border-r border-stone-200 dark:border-stone-700">
		<div class="p-3 h-full overflow-scroll text-stone-800 dark:text-stone-100">
			<div class="flex text-stone-500 text-sm select-none pb-3">
				Console

				<button
					class="ml-auto text-xs hover:underline text-stone-400 dark:text-stone-600"
					on:click={() => (cjConsole.innerText = '')}
				>
					Clear
				</button>
			</div>

			<!-- CheerpJ implicitly looks for a #console to write to -->
			<pre class="font-mono text-sm h-0" bind:this={cjConsole} id="console" />
		</div>
	</section>
	<section class="flex flex-col">
		<div class="p-3 text-stone-500 text-sm select-none">Result</div>
		<div class="grow relative" id="output">
			<!-- #cheerpjDisplay will be inserted here -->
		</div>
	</section>
</div>

{#if isOutputMode}
	<div class="absolute top-1/2 right-0 text-stone-500 text-sm flex items-center select-none">
		<!-- svelte-ignore a11y-invalid-attribute -->
		<button class="px-2 py-2" title="Open in new tab" on:click={viewInOutputMode}>
			<Icon icon="mi:external-link" class="w-5 h-5" />
		</button>
	</div>
{/if}

<style>
	:global(#cheerpjDisplay) {
		box-shadow: none;
	}
</style>

<CheerpJ/>
