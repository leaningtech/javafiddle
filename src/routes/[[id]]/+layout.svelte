<script lang="ts">
	import { files, fiddleTitle, isFiddleOwner } from "$lib/repl/state";

	export let data;

	$: files.set(data.files);
	$: if (data.fiddle) fiddleTitle.set(data.fiddle.title);
	$: if (data.fiddle) isFiddleOwner.set(data.session.userId === data.fiddle.userId);
</script>

<svelte:head>
	<title>{$fiddleTitle ? `${$fiddleTitle} - JavaFiddle` : "JavaFiddle - Build and share Java code snippets in your browser"}</title>
</svelte:head>

<slot />
