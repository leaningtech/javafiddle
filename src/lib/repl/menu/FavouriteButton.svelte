<script lang="ts">
	import Icon from "@iconify/svelte";
	import { favouriteIndex, favourites, fiddleTitle, files } from "../state";
	import { onNavigate } from "$app/navigation";

	$: isFavourite = $favouriteIndex !== -1;

	function toggle() {
		if (isFavourite) {
			$favourites = $favourites.filter((_fiddle, i) => i !== $favouriteIndex);
			$favouriteIndex = -1;
		} else {
			$favourites = [
				{
					title: $fiddleTitle,
					updated: new Date, // TODO: move updated from repl to state store
					files: $files,
				},
				...$favourites,
			];
			$favouriteIndex = 0;
		}
	}

	onNavigate(() => {
		$favouriteIndex = -1;
	});

	// Keep favourites consistent with fiddle data
	$: if (isFavourite) {
		$favourites[$favouriteIndex] = {
			title: $fiddleTitle,
			updated: new Date, // TODO: move updated from repl to state store
			files: $files,
		};
	}
</script>

<button
	on:click={toggle}
	class:text-red-600={isFavourite}
	class:dark:text-red-400={isFavourite}
>
	<Icon
		icon="mi:heart"
		class="w-6 h-6"
	/>
	<span class="sr-only">
		{#if isFavourite}
			Remove from favorites
		{:else}
			Add to favorites
		{/if}
	</span>
</button>
