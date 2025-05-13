<script lang="ts">
	import Repl from '$lib/Repl.svelte';

	export let data;
</script>

<Repl outputUrl={data.outputUrl} />
