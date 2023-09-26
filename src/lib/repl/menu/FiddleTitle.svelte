<script lang="ts">
	import Icon from "@iconify/svelte";
	import { fiddleTitle } from "../state";

	let isEditing = false;

	let input: HTMLInputElement;
	$: if (input) input.focus();
</script>

{#if isEditing}
	<input
		type="text"
		bind:this={input}
		bind:value={$fiddleTitle}
		on:blur={() => isEditing = false}
		on:keydown={evt => {
			if (evt.key === "Enter") isEditing = false;
		}}
		class="text-lg block focus:outline-0 bg-inherit"
		autocomplete="off"
	/>
{:else}
	<h1 class="text-lg flex items-center gap-1.5">
		{$fiddleTitle || "Untitled"}
		<button on:click={() => isEditing = true}>
			<Icon icon="mi:edit" />
			<span class="sr-only">Edit title</span>
		</button>
	</h1>
{/if}
