<script lang="ts">
	import { browser } from '$app/environment';
	import CheerpJ from '$lib/CheerpJ.svelte';
	import Output from '$lib/repl/Output.svelte';
	import { files, type File } from '$lib/repl/state';
	import Loading from '$lib/Loading.svelte';
	import { theme } from '$lib/settings/store';
	import { onMount } from 'svelte';
	import { tryPlausible } from '$lib/plausible';

	let isTop = false;
	let isShared = false;
	onMount(() => {
		isTop = window.top === window;
		isShared = window.location.pathname !== '/output';
	});

	let loading = true;

	async function ready() {
		if (window.parent !== window && window.parent) {
			// Tell parent frame we are ready to recieve files
			window.parent.postMessage({ action: 'ready' }, window.location.origin);
		} else {
			// Load files from load function
			files.set($files); // Force file write
			compileAndRun();
		}
	}

	function onMessage(event: MessageEvent) {
		if (event.origin !== window.location.origin) return;

		const { action } = event.data;
		console.log('recv from top', event.data);

		if (action === 'reload') {
			window.location.reload();
		} else if (action === 'run') {
			files.set(event.data.files);
			compileAndRun();
		} else if (action === 'theme_change') {
			$theme = JSON.parse(localStorage['theme']);
		}
	}

	let consoleEl: HTMLPreElement;
	let display: HTMLElement;
	let lwjglCanvas: HTMLCanvasElement;

	$: if (lwjglCanvas) window.lwjglCanvasElement = lwjglCanvas;

	async function compileAndRun() {
		if (!browser) return;

		console.info('compileAndRun');

		// custom event tracking for analytics
		tryPlausible('Compile');

		consoleEl.innerHTML = '';

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
		const compileLog = consoleEl.innerText;
		if (code != 0) {
			loading = false;
			window.top?.postMessage({ action: 'compile_error', compileLog }, window.location.origin);
			throw new Error('Compilation failed');
		}

		consoleEl.innerHTML = '';
		cheerpjRunMain(deriveMainClass($files[0]), classPath);
		loading = false;
		window.top?.postMessage({ action: 'running', compileLog }, window.location.origin);
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

<svelte:window on:message={onMessage} />

<div class="w-screen h-screen" class:hidden={!loading}>
	<Loading />
</div>

<div class="flex flex-col w-screen h-screen overflow-hidden" class:hidden={loading}>
	<Output bind:console={consoleEl} bind:display bind:lwjglCanvas showLink={!isTop && isShared} />
</div>

<CheerpJ on:ready={ready} {display} />
