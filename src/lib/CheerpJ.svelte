<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { browser } from '$app/environment';
	import { files } from './repl/state';

	const dispatch = createEventDispatcher<{ ready: undefined }>();

	export let display: HTMLElement;

	async function onLoad() {

		await cheerpjInit({
			status: 'none',
			javaProperties: ['java.library.path=/app/cheerpj-natives/natives']
		});
		cheerpjCreateDisplay(-1, -1, display);
		// now that cheerpj modules are imported force update
		// of $files so that now they will be stored in the cheerpj fs
		files.update(files => files);
		dispatch('ready');
	}

	if (browser) {	// so it doesn't run server-side
		onLoad();
	}
</script>
