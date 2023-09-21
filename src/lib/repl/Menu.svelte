<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Icon from '@iconify/svelte';
	import { relativeTime } from 'svelte-relative-time';
	import { page } from "$app/stores";
	import FiddleTitle from "./menu/FiddleTitle.svelte";
	import SettingsButton from "./menu/SettingsButton.svelte";
	import { autoRun } from "$lib/settings/store";
	import { PUBLIC_GITHUB_CLIENT_ID } from "$env/static/public";
	import { invalidateAll } from "$app/navigation";

	$: isLoggedIn = typeof $page.data.session.userId === "number";

	const dispatch = createEventDispatcher<{ save: undefined, run: undefined }>();
	const githubLoginUrl = `https://github.com/login/oauth/authorize?client_id=${PUBLIC_GITHUB_CLIENT_ID}`;

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
		{#if updated}
			<div class="h-4 leading-3 text-xs text-gray-500 dark:text-gray-400">
				<span use:relativeTime={{ date: updated }} />
			</div>
		{/if}
	</div>

	<ul class="flex items-center gap-2">
		{#if !$autoRun}
			<li>
				<button on:click={() => dispatch("run", undefined)} class="text-sm flex items-center rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 font-semibold px-2 py-1 h-8">
					<Icon icon="mi:play" class="w-5 h-5 mr-1" />
					Run
				</button>
			</li>
		{/if}
		{#if isLoggedIn}
			<li>
				<button
					on:click={() => {
						if (!isSaving) dispatch("save", undefined)
					}}
					class="text-sm flex items-center rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 font-semibold px-2 py-1 h-8"
				>
					{#if isSaved}
						<Icon icon="mi:check" class="w-5 h-5 mr-1" />
					{:else}
						<Icon icon="mi:cloud-upload" class="w-5 h-5 mr-1" />
					{/if}
					Save
				</button>
			</li>
		{:else}
			<a
				href={githubLoginUrl}
				class="text-sm rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 font-semibold px-3 py-1 h-8 flex items-center"
				target="_blank"
				on:click={evt => {
					const win = window.open(githubLoginUrl, "_blank");
					if (!win) return;
					evt.preventDefault();
					win.addEventListener("message", (evt) => {
						if (evt.origin === window.location.origin && evt.data.action === "login") {
							dispatch("save", undefined);
							invalidateAll();
						}
					});
				}}
			>
				<Icon icon="mi:cloud-upload" class="w-5 h-5 mr-1" />
				Log in to save
			</a>
		{/if}
		<li>
			<SettingsButton />
		</li>
	</ul>
</header>
