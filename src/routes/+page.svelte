<script lang="ts">
	import Repl from '$lib/Repl.svelte';
	import { files, fiddleTitle, fiddleUpdated, description } from '$lib/repl/state';
	import { decompress, type Fiddle, defaultFiddle } from '$lib/compress-fiddle.js';
	import { onMount } from 'svelte';

	export let data;

	function setFiddle() {
		const fragmentURL: string = window.location.hash.slice(1);
		let fiddle: Fiddle;
		let newDescription: string;
		if (!fragmentURL) {
			fiddle = defaultFiddle;
			newDescription = 'JavaFiddle is an online, browser-based Java IDE. Create and share Swing applications for free!';
		} else {
			fiddle = decompress(fragmentURL);
			newDescription = fiddle.files[0].content;
		}
		$files = fiddle.files;
		$fiddleTitle = fiddle.title;
		$fiddleUpdated = fiddle.updated;
		$description = newDescription;
	}

	onMount(() => {
		window.addEventListener('popstate', setFiddle);
		setFiddle();
		return () => {
			window.removeEventListener('popstate', setFiddle);
		};
	});
</script>

	<Repl outputUrl={data.outputUrl} />
