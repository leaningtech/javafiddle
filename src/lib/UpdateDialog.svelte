<script lang="ts">
	import { onMount } from "svelte";

	let dialog: HTMLDialogElement;

	onMount(() => {
		if (!localStorage["closedUpdateDialog"]) {
			dialog.showModal();
		}
	});

	function dontShowAgain() {
		localStorage["closedUpdateDialog"] = "true";
	}
</script>

<dialog bind:this={dialog} class="bg-stone-200 dark:bg-stone-900 w-[420px] max-w-full rounded-md shadow-xkl px-6 py-5">
  <p>
		<b>Welcome back to JavaFiddle!</b> We've made some changes to the website since the last time you visited.
	</p>

	<p class="mt-2">
		If you don't like the new changes, you can always visit the old version of JavaFiddle with the link at the bottom-left of the screen.
	</p>

	<form method="dialog" class="flex gap-2 mt-4">
		<button class="text-sm rounded bg-orange-400 hover:bg-orange-300 dark:bg-orange-600 dark:hover:bg-orange-700 font-semibold px-3 h-8 flex items-center gap-1">OK</button>
		<button class="text-sm rounded bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 font-semibold px-3 h-8 flex items-center gap-1" on:click={dontShowAgain}>Don't show again</button>
	</form>
</dialog>

<style>
	dialog {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		margin: 0;
	}

	dialog::backdrop {
		background: rgba(0, 0, 0, 0.5);
	}
</style>
