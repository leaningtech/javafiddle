<script lang="ts">
	import Output from '$lib/repl/Output.svelte';
	import { effectiveTheme } from '$lib/settings/store';
</script>

<div class="w-screen h-screen bg-white text-black dark:bg-stone-900 dark:text-white" class:dark={$effectiveTheme === 'dark'}>
	<Output isOutputMode={false} />
</div>
