<script lang="ts">
	import Icon from '@iconify/svelte';

	export let console: HTMLPreElement;
	export let display: HTMLElement;
	export let showLink: boolean;
</script>

<div class="grid grid-cols-2 grow">
	<section class="border-r border-stone-200 dark:border-stone-700">
		<div class="p-3 h-full overflow-scroll text-stone-800 dark:text-stone-100">
			<div class="flex text-stone-500 text-sm select-none pb-3">
				Console

				<button
					class="ml-auto text-xs hover:underline text-stone-400 dark:text-stone-600"
					on:click={() => (console.innerText = '')}
				>
					Clear
				</button>
			</div>

			<!-- CheerpJ implicitly looks for a #console to write to -->
			<pre class="font-mono text-sm h-0" bind:this={console} id="console" />
		</div>
	</section>
	<section class="flex flex-col">
		<div class="p-3 text-stone-500 text-sm select-none">Result</div>
		<div class="grow" bind:this={display} />
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
