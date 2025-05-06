<script lang="ts">
	import '../app.css';
	import { effectiveTheme } from '$lib/settings/store';
	import { fiddleTitle, description } from '$lib/repl/state';
</script>

<svelte:head>
	<title
		>{$fiddleTitle
			? `${$fiddleTitle} - JavaFiddle`
			: 'JavaFiddle - Build and share Java code snippets in your browser'}</title
	>
	<meta name="description" content={$description} />
</svelte:head>

<div class="contents" class:dark={$effectiveTheme === 'dark'}>
	<div class="bg-white text-black dark:bg-stone-900 dark:text-white">
		<slot />
	</div>
</div>
