<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Icon from '@iconify/svelte';
	import { relativeTime } from 'svelte-relative-time';
	import FiddleTitle from './menu/FiddleTitle.svelte';
	import SettingsButton from './menu/SettingsButton.svelte';
	import { blur } from 'svelte/transition';
	import FavouriteButton from './menu/FavouriteButton.svelte';
	import { files, fiddleTitle, fiddleUpdated, favouriteIndex, autoRun } from './state';
	import { defaultFiddle, defaultFiddleComp } from '$lib/compress-fiddle';
	import { goto } from '$app/navigation';

	const dispatch = createEventDispatcher<{ share: undefined; run: undefined }>();

	let showShareMessage = false;
	let timeoutId: number | undefined;
	$: if (showShareMessage) {
		if (timeoutId) clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			showShareMessage = false;
		}, 800);
	}

	function onkey(e: KeyboardEvent) {
		if ((e.ctrlKey || e.metaKey) && e.key === 's') {
			e.preventDefault();
			dispatch('share', undefined);
		}
	}

	function createNewFile() {
		$files = defaultFiddle.files;
		$fiddleTitle = defaultFiddle.title;
		$fiddleUpdated = defaultFiddle.updated;
		if ($favouriteIndex !== -1) {
			$favouriteIndex = -1;
		}
		goto(`/#${defaultFiddleComp}`);
	}
</script>

<svelte:window on:keydown={onkey} />

<header
	class="px-4 h-16 flex items-center justify-between gap-4 relative shadow dark:shadow-none dark:border-b border-b-stone-700 dark:bg-stone-800"
>
	<button class="text-xl text-orange-500 dark:text-orange-400 font-bold" on:click={createNewFile}>
		<h1>JavaFiddle</h1>
	</button>

	<div class="grow flex flex-col justify-center self-stretch">
		<FiddleTitle />
		{#if $fiddleUpdated}
			<div class="h-4 leading-3 text-xs text-stone-500 dark:text-stone-400">
				<span use:relativeTime={{ date: $fiddleUpdated }} />
			</div>
		{/if}
	</div>

	<ul class="flex items-center gap-2">
		{#if showShareMessage}
			<li
				class="text-xs text-stone-600 dark:text-stone-400"
				in:blur={{ duration: 100 }}
				out:blur={{ duration: 800 }}
			>
				URL copied to clipboard
			</li>
		{/if}
		<FavouriteButton />
		{#if !$autoRun}
			<li>
				<button
					on:click={() => dispatch('run', undefined)}
					class="text-sm flex items-center rounded bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 font-semibold px-2 py-1 h-8"
				>
					<Icon icon="mi:play" class="w-5 h-5 mr-1" />
					Run
				</button>
			</li>
		{/if}
		<li>
			<button
				on:click={() => {
					dispatch('share', undefined);
					showShareMessage = true;
				}}
				class="text-sm flex items-center rounded bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 font-semibold px-2 py-1 h-8"
				title="⌘S / Ctrl+S"
			>
				<Icon icon="mi:share" class="w-5 h-5 mr-1" />
				Share
			</button>
		</li>
		<li>
			<SettingsButton />
		</li>
	</ul>
</header>
