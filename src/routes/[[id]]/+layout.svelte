<script lang="ts">
	import { files, fiddleTitle } from "$lib/repl/state";

	export let data;

	$: files.set(data.fiddle.files);
	$: if (data.fiddle) fiddleTitle.set(data.fiddle.title);
</script>

<svelte:head>
	<title>{$fiddleTitle ? `${$fiddleTitle} - JavaFiddle` : "JavaFiddle - Build and share Java code snippets in your browser"}</title>
</svelte:head>

<slot />
