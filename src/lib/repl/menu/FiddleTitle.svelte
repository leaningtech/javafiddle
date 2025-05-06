<script lang="ts">
	import Icon from '@iconify/svelte';
	import { fiddleTitle, fiddleUpdated, files } from '../state';
	import { goto } from '$app/navigation';
	import { compress } from '$lib/compress-fiddle';

	let isEditing = false;

	let input: HTMLInputElement;
	$: if (input) input.focus();
</script>

{#if isEditing}
	<input
		type="text"
		bind:this={input}
		bind:value={$fiddleTitle}
		on:blur={() => (isEditing = false)}
		on:keydown={(evt) => {
			if (evt.key === 'Enter') {
				isEditing = false;
				// since title changed, update URL
				const fiddleFragmentURL = compress({
					title: $fiddleTitle,
					updated: $fiddleUpdated,
					files: $files
				});
				goto(`/#${fiddleFragmentURL}`, {
					replaceState: true
				});
			};
		}}
		class="text-lg block focus:outline-0 bg-inherit"
		autocomplete="off"
	/>
{:else}
	<h1 class="text-lg flex items-center gap-1.5">
		{$fiddleTitle || 'Untitled'}
		<button on:click={() => (isEditing = true)}>
			<Icon icon="mi:edit" />
			<span class="sr-only">Edit title</span>
		</button>
	</h1>
{/if}
