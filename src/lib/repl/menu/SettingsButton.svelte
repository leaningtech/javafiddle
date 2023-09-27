<script lang="ts">
	import SettingsPanel from '$lib/settings/SettingsPanel.svelte';
	import Icon from '@iconify/svelte';
	import { scale } from 'svelte/transition';

	let isOpen: boolean;
</script>

<svelte:body on:click={() => (isOpen = false)} />

<button
	on:click={(evt) => {
		isOpen = true;
		evt.stopPropagation();
	}}
	class="text-sm rounded bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 font-semibold px-3 h-8 flex items-center gap-1"
>
	<Icon icon="mi:filter" class="w-5 h-5" />
	Settings
</button>

{#if isOpen}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="absolute top-[52px] right-4 z-10"
		on:click={(evt) => evt.stopPropagation()}
		transition:scale={{ start: 0.9, duration: 100 }}
	>
		<SettingsPanel />
	</div>
{/if}
