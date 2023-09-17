<script lang="ts">
	import Repl from "$lib/Repl.svelte";

	export let data;
</script>

<Repl updated={data.fiddle?.updated} outputUrl={data.outputUrl} userFiddles={data.userFiddles} />
