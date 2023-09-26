<script lang="ts">
	import Repl from "$lib/Repl.svelte";
	import { files, selectedFilePath } from "$lib/repl/state.js";
	import { onMount } from "svelte";

	export let data;

	onMount(async () => {
		const data = window.location.hash.substring(1);
		if (data) {
			const { decompressFromEncodedURIComponent } = await import("lz-string")
			$files = [
				{
					path: "JavaFiddle.java",
					content: decompressFromEncodedURIComponent(data)
				},
			];
			$selectedFilePath = "JavaFiddle.java";
		}
	});
</script>

<Repl updated={data.fiddle.updated} outputUrl={data.outputUrl} />
