<script lang="ts">
	import SessionButton from "./menu/SessionButton.svelte";
	import { createEventDispatcher } from "svelte";

	const dispatch = createEventDispatcher<{ save: undefined }>();
</script>

<header class="px-4 flex items-center justify-between gap-4 bg-white text-black relative shadow">
	<h1>JavaFiddle</h1>

	<ul class="my-4 text-sm flex gap-2 items-center">
		<li>
			<a href="/">
				New
			</a>
		</li>
		<li>
			<button on:click={() => dispatch("save", undefined)}>
				Save
			</button>
		</li>
	</ul>

	<ul class="flex-1 text-right">
		<li>
			<SessionButton />
		</li>
	</ul>
</header>
