<script lang="ts">
	import { goto } from "$app/navigation";
	import Loading from "$lib/Loading.svelte";
	import { compress, type Fiddle } from "$lib/compress-fiddle";
	import { onMount } from "svelte";

	async function fetchExampleFile(path: string) {
		const res = await fetch(`/examples/${path}`);
		return res.text();
	}

	let examples: Fiddle[] = [];
	onMount(async () => {
		examples = [
			{
				title: "Hello world",
				files: [
					{
						path: "Main.java",
						content: await fetchExampleFile("hello-world/Main.java"),
					},
				],
			},
			{
				title: "Hello world with Swing",
				files: [
					{
						path: "Main.java",
						content: await fetchExampleFile("hello-world-swing/Main.java"),
					},
				],
			},
		];
	});
</script>

{#each examples as fiddle}
	<button
		class="w-full text-left flex items-center px-4 py-2 hover:bg-stone-200 dark:hover:bg-stone-900"
		on:click={async () => {
			const id = compress(fiddle);
			await goto(`/${id}`);
		}}
	>
		<div class="grow">{fiddle.title}</div>
	</button>
{:else}
	<div class="flex justify-center grow">
		<Loading />
	</div>
{/each}
