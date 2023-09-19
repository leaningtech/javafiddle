<script lang="ts">
	import SessionButton from "./menu/SessionButton.svelte";
	import { createEventDispatcher } from "svelte";
	import Icon from '@iconify/svelte';
	import ThemeSwitcher from "$lib/settings/ThemeSwitcher.svelte";
	import { relativeTime } from 'svelte-relative-time';
	import { page } from "$app/stores";
	import FiddleTitle from "./menu/FiddleTitle.svelte";

	$: isLoggedIn = typeof $page.data.session.userId === "number";

	const dispatch = createEventDispatcher<{ save: undefined, run: undefined }>();

	export let updated: Date | undefined;
	export let isSaving = false;
	export let isSaved = true;

	function onkey(e: KeyboardEvent) {
		console.log(e.ctrlKey, e.metaKey)
		if ((e.ctrlKey || e.metaKey) && e.key === "s") {
			e.preventDefault();
			dispatch("save", undefined);
		}
	}
</script>

<svelte:window on:keydown={onkey} />

<header class="px-4 h-16 flex items-center justify-between gap-4 relative shadow dark:shadow-none">
	<a href="/" class="text-xl text-orange-500 dark:text-orange-400 font-bold">
		<h1>JavaFiddle</h1>
	</a>

	<div class="grow flex flex-col justify-center self-stretch">
		<FiddleTitle />
		<div class="h-4 leading-3 text-xs text-gray-500 dark:text-gray-400">
			{#if updated}
				<span use:relativeTime={{ date: updated }} />
			{/if}
		</div>
	</div>

	<ul class="flex items-center gap-4">
		<li>
			<ThemeSwitcher />
		</li>
		<li>
			<button on:click={() => dispatch("run", undefined)} class="flex items-center rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 font-semibold px-2 py-1 h-8">
				<Icon icon="mi:play" class="w-5 h-5 mr-1" />
				Run
			</button>
		</li>
		<li class="flex gap-2 items-center">
			{#if isLoggedIn}
				<button
					on:click={() => {
						if (!isLoggedIn) alert("Log in to save")
						else if (!isSaving) dispatch("save", undefined)
					}}
					class="flex items-center rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 font-semibold px-2 py-1 h-8"
				>
					<Icon icon="mi:cloud-upload" class="w-5 h-5 mr-1" />
					Save
				</button>
			{/if}
			<span class="text-xs dark:text-gray-500">
				{#if isSaving}
					Saving...
				{:else if isSaved}
					Saved
				{/if}
			</span>
		</li>
		<li>
			<SessionButton />
		</li>
	</ul>
</header>
