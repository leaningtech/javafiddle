<script lang="ts">
	import Icon from "@iconify/svelte";
	import { isSidebarOpen } from "./state";
	import { fade } from 'svelte/transition';
</script>

<aside class="w-10 bg-gray-100 dark:bg-gray-800 flex-shrink-0 transition-[width]" class:!w-80={$isSidebarOpen}>
	<div class="p-2 text-right">
		<button class="w-6 h-6 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-500 rounded inline-flex items-center justify-center" on:click={() => $isSidebarOpen = !$isSidebarOpen}>
			{#if $isSidebarOpen}
				<Icon icon="mi:close" />
			{:else}
				<Icon icon="mi:chevron-right" />
			{/if}
		</button>
	</div>

	{#if $isSidebarOpen}
		<div class="w-80 p-4 leading-tight text-gray-700 dark:text-gray-400 text-sm" transition:fade={{ duration: 150 }}>
			<p>
				JavaFiddle is an online tool to test and share snippets of Java code.
			</p>

			<hr class="my-4 dark:border-gray-700" />

			<ul class="list-disc space-y-2 ml-4">
				<li>
					Runs entirely <b>in your browser</b>.
				</li>
				<li>
					Works <b>offline</b>.
				</li>
				<li>
					Supports Swing, audio, printing - any Java SE component.
				</li>
			</ul>
		</div>
	{/if}
</aside>
