<script lang="ts">
	import { goto } from '$app/navigation';
	import { compress } from '$lib/compress-fiddle';
	import { favourites, favouriteIndex } from '../state';
	import { relativeTime } from 'svelte-relative-time';
</script>

<p class="text-sm p-3 text-stone-500 dark:text-stone-400 leading-tight">
	Click the heart icon on a fiddle to have it appear in this list.
</p>

<ul class="text-stone-600 dark:text-stone-200 text-sm">
	{#each $favourites as fiddle, index}
		<li>
			<button
				class="w-full text-left flex items-center px-4 py-2 hover:bg-stone-200 dark:hover:bg-stone-900"
				on:click={async () => {
					const fiddle = $favourites[index];
					const id = compress(fiddle);
					await goto(`/${id}`);
					$favouriteIndex = index;
				}}
			>
				<div class="grow">{fiddle.title || 'Untitled'}</div>
				{#if fiddle.updated}
					<div class="text-xs opacity-50" use:relativeTime={{ date: fiddle.updated }}>
						{fiddle.updated.toLocaleString()}
					</div>
				{/if}
			</button>
		</li>
	{/each}
</ul>
