<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Icon from '@iconify/svelte';
	import { relativeTime } from 'svelte-relative-time';
	import FiddleTitle from "./menu/FiddleTitle.svelte";
	import SettingsButton from "./menu/SettingsButton.svelte";
	import { autoRun } from "$lib/settings/store";
	import { blur } from 'svelte/transition';
	import FavouriteButton from "./menu/FavouriteButton.svelte";
	import { fiddleUpdated } from "./state";

	const dispatch = createEventDispatcher<{ share: undefined, run: undefined }>();

	let showShareMessage = false;
	let timeoutId: number | undefined;
	$: if (showShareMessage) {
		if (timeoutId) clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			showShareMessage = false;
		}, 800);
	}

	function onkey(e: KeyboardEvent) {
		console.log(e.ctrlKey, e.metaKey)
		if ((e.ctrlKey || e.metaKey) && e.key === "s") {
			e.preventDefault();
			dispatch("share", undefined);
		}
	}
</script>

<svelte:window on:keydown={onkey} />

<header class="px-4 h-16 flex items-center justify-between gap-4 relative shadow dark:shadow-none dark:border-b border-b-gray-700">
	<a href="/" class="text-xl text-orange-500 dark:text-orange-400 font-bold">
		<h1>JavaFiddle</h1>
	</a>

	<div class="grow flex flex-col justify-center self-stretch">
		<FiddleTitle />
		{#if $fiddleUpdated}
			<div class="h-4 leading-3 text-xs text-gray-500 dark:text-gray-400">
				<span use:relativeTime={{ date: $fiddleUpdated }} />
			</div>
		{/if}
	</div>

	<ul class="flex items-center gap-2">
		{#if showShareMessage}
			<li class="text-xs text-gray-600 dark:text-gray-400" in:blur={{ duration: 100 }} out:blur={{ duration: 800 }}>
				URL copied to clipboard
			</li>
		{/if}
		<FavouriteButton />
		{#if !$autoRun}
			<li>
				<button on:click={() => dispatch("run", undefined)} class="text-sm flex items-center rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 font-semibold px-2 py-1 h-8">
					<Icon icon="mi:play" class="w-5 h-5 mr-1" />
					Run
				</button>
			</li>
		{/if}
		<li>
			<button
				on:click={() => {
					dispatch("share", undefined)
					showShareMessage = true;
				}}
				class="text-sm flex items-center rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 font-semibold px-2 py-1 h-8"
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
