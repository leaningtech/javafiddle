<script lang="ts">
	import { files, fiddleTitle, fiddleUpdated } from "$lib/repl/state";

	export let data;

	$: $files = data.fiddle.files;
	$: $fiddleTitle = data.fiddle.title;
	$: $fiddleUpdated = data.fiddle.updated;

	const description = $files[0].content;
</script>

<svelte:head>
	<title>{$fiddleTitle ? `${$fiddleTitle} - JavaFiddle` : "JavaFiddle - Build and share Java code snippets in your browser"}</title>
	<meta name="description" content={description}>
</svelte:head>

<slot />
