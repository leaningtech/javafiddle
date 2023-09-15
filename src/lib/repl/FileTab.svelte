<script lang="ts">
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
	class="px-3 py-2 border-b-2 border-transparent hover:text-gray-800 dark:hover:text-gray-400 cursor-pointer"
	class:!border-orange-500={isSelected}
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
			files.update($files => {
				const index = $files.findIndex(f => f.path === file.path);
				$files[index].path = path + ".java";
				return $files;
			});
			$selectedFilePath = path + ".java";
		}}
		class="focus:text-orange-600 focus:ring-0"
		class:pointer-events-none={!isSelected || file.path === "Main.java"}
		class:cursor-text={isSelected}
		contenteditable
		bind:innerText={path}
	/>
</button>
