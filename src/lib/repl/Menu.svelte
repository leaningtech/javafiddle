<script lang="ts">
	import SessionButton from "./menu/SessionButton.svelte";
	import { createEventDispatcher } from "svelte";
	import Icon from '@iconify/svelte';

	const dispatch = createEventDispatcher<{ save: undefined, run: undefined }>();
</script>

<header class="px-4 flex items-center justify-between gap-4 bg-white text-black relative shadow">
	<h1>JavaFiddle</h1>

	<ul class="my-4 text-sm flex gap-2 items-center">
		<li>
			<button on:click={() => dispatch("run", undefined)} class="flex items-center rounded bg-stone-100 hover:bg-stone-200 font-semibold px-2 py-1">
				<Icon icon="mi:play" class="w-5 h-5 mr-1" />
				New
			</button>
		</li>
		<li>
			<button on:click={() => dispatch("save", undefined)} class="flex items-center rounded bg-stone-100 hover:bg-stone-200 font-semibold px-2 py-1">
				<Icon icon="mi:cloud-upload" class="w-5 h-5 mr-1" />
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
