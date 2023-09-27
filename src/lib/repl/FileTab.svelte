<script lang="ts">
	import Icon from "@iconify/svelte";
	import { files, selectedFilePath, type File } from "./state";

	export let file: File;

	let isEditing = false;

	$: isSelected = $selectedFilePath === file.path;

	// Remove extension (.java) from path
	let path: string;
	$: {
		if (!isEditing) {
			path = file.path.substring(0, file.path.lastIndexOf("."));
		}
	}
</script>

<button
	class="group px-3 py-2 hover:text-gray-800 dark:hover:text-gray-400 cursor-pointer flex items-center justify-center"
	class:!text-gray-600={isSelected}
	class:dark:!text-gray-200={isSelected}
	on:click={() => selectedFilePath.set(file.path)}
>
	<button
		on:click={() => {
			if (isSelected) isEditing = true
		}}
		on:focusin={() => isEditing = true}
		on:focusout={() => {
			isEditing = false;
			if ((path + ".java") !== file.path) {
				const existingFile = $files.find(f => f.path === path + ".java");
				if (existingFile) {
					alert(`A file with the name '${path}' already exists!`);
					return;
				}

				files.update($files => {
					const index = $files.findIndex(f => f.path === file.path);
					$files[index].path = path + ".java";
					return $files;
				});
				$selectedFilePath = path + ".java";
			}
		}}
		class="focus:text-orange-600 ring-0"
		class:pointer-events-none={!isSelected || file.path === "Main.java"}
		class:cursor-text={isSelected}
		contenteditable
		bind:innerText={path}
	/>
	<button
		on:click={() => {
			if (!confirm(`Are you sure you want to delete '${path}'?`)) {
				return;
			}
			files.update($files => $files.filter(f => f.path !== file.path));
			$selectedFilePath = $files[0].path;
		}}
		class="ml-1 -mr-3 opacity-0 group-hover:opacity-50"
		class:!opacity-0={!isSelected}
		class:pointer-events-none={!isSelected}
	>
		<Icon icon="mi:close" class="w-3 h-3" />
	</button>
</button>
