<script lang="ts">
	import { relativeTime } from "svelte-relative-time";

	export let fiddles: { id: string, title: string, updated: Date }[];
</script>

<ul class="text-gray-500 text-sm">
	{#each fiddles as fiddle}
		<li>
			<a href={`/${fiddle.id}`} class="flex items-center px-4 py-2 border-t border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700">
				<div class="grow">{fiddle.title || fiddle.id}</div>
				<div class="text-xs opacity-50" use:relativeTime={{ date: fiddle.updated }}>
					{fiddle.updated.toLocaleString()}
				</div>
			</a>
		</li>
	{/each}
</ul>

{#if fiddles.length === 0}
	<div class="text-gray-500 p-4 leading-tight">
		Sign in and save your fiddles to view them here.
	</div>
{/if}
