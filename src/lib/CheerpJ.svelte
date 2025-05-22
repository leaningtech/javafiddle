<script lang="ts">
	import { onDestroy } from 'svelte';
	import { files, isloading, isSaved, type File } from './repl/state';

	export let display: HTMLElement;

	export async function startCheerpj() {
		await cheerpjInit({
			status: 'none',
			javaProperties: ['java.library.path=/app/cheerpj-natives/natives']
		});
		cheerpjCreateDisplay(-1, -1, display);
		// remove useless loading screen
		display.querySelector("#cheerpjDisplay")?.classList.remove("cheerpjLoading");
	}

	export async function runCheerpj() {

		const classPath = '/app/tools.jar:/app/lwjgl-2.9.0.jar:/app/lwjgl_util-2.9.0.jar:/files/';
		const sourceFiles = $files.map((file) => '/str/' + file.path);
		$isloading = true;
		const code = await cheerpjRunMain(
			'com.sun.tools.javac.Main',
			classPath,
			...sourceFiles,
			'-d',
			'/files/',
			'-Xlint'
		);
		$isloading = false;
		if (code === 0) {
			await cheerpjRunMain(deriveMainClass($files[0]), classPath);
		}
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

	const unsubSaveFiles = files.subscribe(() => {
		if (!('cheerpjAddStringFile' in globalThis)) {
			return;
		} else if ($isloading) {
			$isSaved = false;
		} else {
			$isSaved = true;
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

	onDestroy(unsubSaveFiles);
</script>
