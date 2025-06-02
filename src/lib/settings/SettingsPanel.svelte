<script lang="ts">
	import ThemeSwitcher from './ThemeSwitcher.svelte';
	import { autoRun } from '$lib/repl/state';
</script>

<!-- triangle pointing above -->
<svg
	width="16"
	height="8"
	viewBox="0 0 20 10"
	class="ml-auto mr-[44px]"
	xmlns="http://www.w3.org/2000/svg"
>
	<path d="M0 10L10 0L20 10H0Z" class="fill-stone-200 dark:fill-stone-950" />
</svg>

<div
	class="bg-stone-200 dark:bg-stone-950 w-[300px] max-w-full rounded-md shadow-sm px-4 py-3 text-sm accent-orange-600 dark:accent-orange-400 leading-relaxed"
>
	<h3 class="font-semibold">Appearance</h3>
	<div class="w-1/3">
		Theme:
		<ThemeSwitcher />
	</div>

	<div class="border-t border-stone-300 dark:border-stone-700 my-3" />

	<h3 class="font-semibold">Behaviour</h3>
	<div class="flex items-center gap-1.5">
		<input type="checkbox" bind:checked={$autoRun} id="auto-run" />
		<label for="auto-run" class="grow">Run code automatically</label>
	</div>
</div>
