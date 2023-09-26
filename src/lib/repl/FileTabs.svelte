<script lang="ts">
	import { files, selectedFilePath } from "./state";
	import FileTab from "./FileTab.svelte";
	import Icon from "@iconify/svelte";

	function getNewFilePath(): string {
		let i = 2;
		let path = `Class.java`;
		while ($files.find((f) => f.path === path)) {
			path = `Class${i}.java`;
			i++;
		}
		return path;
	}
</script>

<div class="flex items-stretch text-gray-500 font-semibold h-10">
	{#each $files as file}
		<FileTab {file} />
	{/each}
	<button
		class="mx-1 mb-1"
		title="New file"
		on:click={() => {
			const path = getNewFilePath();
			const className = path.replace(/\.java$/, "");
			$files = [
				...$files,
				{
					path,
					content: `package fiddle;

class ${className} {
    public ${className}() {
        // TODO
    }
}
`
				},
			];
			$selectedFilePath = path;
		}}
	>
		<Icon icon="mi:add" class="w-4 h-4 ml-2" />
	</button>
</div>
