<script lang="ts">
	import Icon from "@iconify/svelte";

	const tabs = [
		"Terminal",
		"Display",
	] as const;

	// TODO: remember in localStorage
	let tabIndex = 0;

	export let console: HTMLPreElement;
	export let display: HTMLDivElement;
	export let showLink: boolean;

	let width = 640;
	let height = 480;
</script>

<div class="border-b border-stone-200 text-stone-500 text-sm flex items-center">
	{#each tabs as tab, i}
		<button
			class="px-3 py-2 border-b-2 border-transparent hover:text-stone-800"
			class:!border-orange-500={tabIndex === i}
			class:!text-orange-600={tabIndex === i}
			on:click={() => tabIndex = i}
		>
			{tab}
		</button>
	{/each}

	<div class="grow" />

	{#if showLink}
		<a href="" target="_blank" rel="noreferrer" class="px-2 py-2" title="Open in new tab">
			<Icon icon="mi:external-link" class="w-5 h-5" />
		</a>
	{/if}	
</div>

<div class="flex-1 p-3 overflow-scroll" class:hidden={tabIndex !== 0}>
	<!-- CheerpJ implicitly looks for a #console to write to -->
	<pre class="font-mono text-sm h-0" bind:this={console} id="console"></pre>
</div>
<div class="flex-1 overflow-hidden" class:hidden={tabIndex !== 1} bind:clientWidth={width} bind:clientHeight={height}>
	<div bind:this={display} class="absolute" style:width={`${width}px`} style:height={`${height}px`}></div>
</div>
