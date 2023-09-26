<script lang="ts">
	import { files, fiddleTitle, fiddleUpdated } from "$lib/repl/state";

	export let data;

	$: $files = data.fiddle.files;
	$: $fiddleTitle = data.fiddle.title;
	$: $fiddleUpdated = data.fiddle.updated;
</script>

<svelte:head>
	<title>{$fiddleTitle ? `${$fiddleTitle} - JavaFiddle` : "JavaFiddle - Build and share Java code snippets in your browser"}</title>
</svelte:head>

<slot />
