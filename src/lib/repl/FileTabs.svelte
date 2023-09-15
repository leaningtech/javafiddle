<script lang="ts">
	import { files, selectedFilePath } from "./state";
</script>

<div class="flex items-center text-gray-500 font-semibold">
	{#each $files as file}
		<button
			class="px-3 py-2 border-b-2 border-transparent hover:text-gray-800 dark:hover:text-gray-400 cursor-pointer"
			class:!border-orange-500={$selectedFilePath === file.path}
			class:!text-orange-600={$selectedFilePath === file.path}
			on:click={() => selectedFilePath.set(file.path)}
		>
			{file.path}
		</button>
	{/each}
</div>
