<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { browser } from '$app/environment';
	import { tryPlausible } from './plausible';
	import { files, loading, type File } from './repl/state';

	const dispatch = createEventDispatcher<{ ready: undefined }>();

	export let display: HTMLElement;
	export let consoleEl: HTMLPreElement;

	async function onLoad() {

		await cheerpjInit({
			status: 'none',
			javaProperties: ['java.library.path=/app/cheerpj-natives/natives']
		});
		cheerpjCreateDisplay(-1, -1, display);
		dispatch('ready');
	}

	if (browser) {	// so it doesn't run server-side
		onLoad();
	}

	export async function compileAndRun() {
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
			$loading = false;
			window.top?.postMessage({ action: 'compile_error', compileLog }, window.location.origin);
			throw new Error('Compilation failed');
		}

		consoleEl.innerHTML = '';
		cheerpjRunMain(deriveMainClass($files[0]), classPath);
		$loading = false;
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

	// Persist files to CheerpJ filesystem
	files.subscribe(($files) => {
		if ('cheerpjAddStringFile' in globalThis) {
			try {
				const encoder = new TextEncoder();
				for (const file of $files) {
					cheerpjAddStringFile('/str/' + file.path, encoder.encode(file.content));
				}
				console.info('wrote files');
			} catch (error) {
				console.error('Error writing files to CheerpJ', error);
			}
		}
	});
</script>
