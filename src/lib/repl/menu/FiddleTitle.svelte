<script lang="ts">
	import Icon from "@iconify/svelte";
	import { fiddleTitle, isFiddleOwner } from "../state";

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
		{#if $isFiddleOwner}
			<button on:click={() => isEditing = true}>
				<Icon icon="mi:edit" class="`sw-5 h-5" />
			</button>
		{/if}
	</h1>
{/if}
