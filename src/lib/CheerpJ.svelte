<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { browser } from '$app/environment';

	const dispatch = createEventDispatcher<{ ready: undefined }>();

	export let display: HTMLElement;

	async function onLoad() {

		await cheerpjInit({
			status: 'none',
			javaProperties: ['java.library.path=/app/cheerpj-natives/natives']
		});
		cheerpjCreateDisplay(-1, -1, display);
		dispatch('ready');
	}

	if (browser) {	// so it doesn't run server-side
		onLoad();
	}
</script>
