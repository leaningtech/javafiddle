<script lang="ts">
	import SessionButton from "./menu/SessionButton.svelte";
	import { createEventDispatcher } from "svelte";
	import Icon from '@iconify/svelte';
	import ThemeSwitcher from "$lib/settings/ThemeSwitcher.svelte";
	import { relativeTime } from 'svelte-relative-time';

	const dispatch = createEventDispatcher<{ save: undefined, run: undefined }>();

	export let updated: Date | undefined;
	export let isSaving = false;
	export let isSaved = true;
</script>

<header class="px-4 flex items-center justify-between gap-4 relative shadow dark:shadow-none">
	<a href="/" class="text-xl text-orange-500 dark:text-orange-400 font-bold">
		<h1>JavaFiddle</h1>
	</a>

	<ul class="my-3 text-sm flex gap-2 items-center">
		<li>
			<button on:click={() => dispatch("run", undefined)} class="flex items-center rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 font-semibold px-2 py-1">
				<Icon icon="mi:play" class="w-5 h-5 mr-1" />
				New
			</button>
		</li>
		<li class="flex gap-2 items-center">
			<button
				on:click={() => {
					if (!isSaving) dispatch("save", undefined)
				}}
				class="flex items-center rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 font-semibold px-2 py-1"
			>
				<Icon icon="mi:cloud-upload" class="w-5 h-5 mr-1" />
				Save
			</button>
			<span class="text-xs dark:text-gray-500">
				{#if isSaving}
					Saving...
				{:else if isSaved}
					Saved
				{:else if updated}
					<span use:relativeTime={{ date: updated }} />
				{/if}
			</span>
		</li>
	</ul>
	<div class="grow" />
	<ul class="flex items-center gap-4">
		<li>
			<SessionButton />
		</li>
		<li>
			<ThemeSwitcher />
		</li>
	</ul>
</header>
