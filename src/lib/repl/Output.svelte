<script lang="ts">
	import Icon from '@iconify/svelte';
	import { browser } from '$app/environment';
	import CheerpJ from '$lib/CheerpJ.svelte';
	import { files, type File } from '$lib/repl/state';
	import Loading from '$lib/Loading.svelte';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher<{
		running: {compileLog: string}, 
		compile_error: {compileLog: string}}
	>();

	let loading = false;
	let consoleOut: HTMLPreElement;
	let display: HTMLElement;
	let lwjglCanvas: HTMLCanvasElement;

	$: if (lwjglCanvas) window.lwjglCanvasElement = lwjglCanvas;

	export async function compileAndRun() {
		if (!browser || loading) return;

		console.info('compileAndRun');

		loading = true;
		consoleOut.innerHTML = '';

		const classPath = '/app/tools.jar:/app/lwjgl-2.9.0.jar:/app/lwjgl_util-2.9.0.jar:/files/';

		const sourceFiles = $files.map((file) => '/str/' + file.path);
		const code = await cheerpjRunMain(
			'com.sun.tools.javac.Main',
			classPath,
			...sourceFiles,
			'-d',
			'/files/',
			'-Xlint'
		);
		const compileLog = consoleOut.innerText;
		if (code != 0) {
			loading = false;
			dispatch('compile_error', { compileLog });
			return;
		}

		consoleOut.innerHTML = '';
		await cheerpjRunMain(deriveMainClass($files[0]), classPath);
		loading = false;
		dispatch('running', { compileLog });
	}

	function deriveMainClass(file: File) {
		const className = file.path.split('/').pop()!.replace('.java', '');
		const match = file.content.match(/package\s+(.+);/);
		if (match && match.length > 1) {
			const packageName = match[1];
			return `${packageName}.${className}`;
		} else {
			return className;
		}
	}
</script>

<div class="w-full h-full" class:hidden={!loading}>
	<Loading />
</div>

<div class="w-full h-full grid grid-cols-2 grow">
	<section class="border-r border-stone-200 dark:border-stone-700">
		<div class="p-3 h-full overflow-scroll text-stone-800 dark:text-stone-100">
			<div class="flex text-stone-500 text-sm select-none pb-3">
				Console

				<button
					class="ml-auto text-xs hover:underline text-stone-400 dark:text-stone-600"
					on:click={() => (consoleOut.innerText = '')}
				>
					Clear
				</button>
			</div>

			<!-- CheerpJ implicitly looks for a #console to write to -->
			<pre class="font-mono text-sm h-0" bind:this={consoleOut} id="console" />
		</div>
	</section>
	<section class="flex flex-col">
		<div class="p-3 text-stone-500 text-sm select-none">Result</div>
		<div class="grow relative" bind:this={display}>
			<canvas bind:this={lwjglCanvas} class="absolute inset-0 w-full h-full" />
			<!-- #cheerpjDisplay will be inserted here -->
		</div>
	</section>
</div>

<div class="absolute top-0 right-0 text-stone-500 text-sm flex items-center select-none">
	<!-- svelte-ignore a11y-invalid-attribute -->
	<a href="" target="_blank" rel="noreferrer" class="px-2 py-2" title="Open in new tab">
		<Icon icon="mi:external-link" class="w-5 h-5" />
	</a>
</div>

<style>
	:global(#cheerpjDisplay) {
		box-shadow: none;
	}
</style>

<CheerpJ on:ready={compileAndRun} {display} />