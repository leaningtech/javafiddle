<script lang="ts">
	import { files } from "$lib/repl/state";

	export let data;

	$: files.set(data.files);
</script>

<slot />
