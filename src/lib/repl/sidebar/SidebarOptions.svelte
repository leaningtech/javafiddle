<script lang="ts">
	import Icon from "@iconify/svelte";
	import { createEventDispatcher } from "svelte";
	import Favourites from "./Favourites.svelte";
	import { browser } from "$app/environment";
	import Examples from "./Examples.svelte";

	const dispatch = createEventDispatcher<{ selectOption: number }>();

	export let forceClose = false;

	const options = [
		{
			label: (browser && navigator.language === "en-GB") ? "Favourites" : "Favorites",
			icon: "mi:heart",
			color: "red",
		},
		{
			label: "Examples",
			icon: "mi:archive",
			color: "teal",
		},
	];
	let selectedOptionIndex = -1;
	
	$: selectedOption = selectedOptionIndex === -1 ? undefined : options[selectedOptionIndex];

	$: if (forceClose) selectedOptionIndex = -1;

	$: if (selectedOptionIndex !== -1) dispatch("selectOption", selectedOptionIndex);
</script>

{#if selectedOption}
	<div class="border-y dark:border-stone-700">
		<button
			class="flex items-center gap-3 px-2.5 h-10 w-full font-medium"
			on:click={() => selectedOptionIndex = -1}
		>
			<Icon icon="mi:chevron-left" class="w-5 h-5" />
			{selectedOption.label}
		</button>
	</div>
	{#if selectedOptionIndex === 0}
		<Favourites />
	{:else if selectedOptionIndex === 1}
		<Examples />
	{/if}
{:else}
	<ul>
		{#each options as option, index}
			<li class="border-b first:border-t dark:border-stone-700">
				<button
					class="group flex items-center gap-3 px-2.5 h-10 w-full text-stone-600 dark:text-stone-400"
					class:hover:text-red-600={option.color === "red"}
					class:dark:hover:text-red-400={option.color === "red"}
					class:hover:text-teal-600={option.color === "teal"}
					class:dark:hover:text-teal-400={option.color === "teal"}
					on:click={() => selectedOptionIndex = index}
				>
					<Icon icon={option.icon} class="w-5 h-5" />
					<span class="grow text-left font-medium">{option.label}</span>
					<Icon icon="mi:chevron-right" class="opacity-0 group-hover:opacity-100" />
				</button>
			</li>
		{/each}
	</ul>
{/if}
