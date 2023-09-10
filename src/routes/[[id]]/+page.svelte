<script>
	import Repl from "$lib/Repl.svelte";
	import { files } from "$lib/repl/state";

	export let data;

	$: files.set(data.files);
</script>

<Repl />
