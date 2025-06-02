<script lang="ts">
	import Output from '$lib/repl/Output.svelte';
	import { loading } from '$lib/repl/state';
	import { onMount } from 'svelte';

	let isTop = false;
	let isShared = false;
	onMount(() => {
		isTop = window.top === window;
		isShared = window.location.pathname !== '/output';
	});
</script>

<div class="flex flex-col w-screen h-screen overflow-hidden" class:hidden={$loading}>
	<Output showLink={!isTop && isShared} />
</div>
