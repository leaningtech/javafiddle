<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { autoRun, compileLog, files, isRunning, isSaved, runCode, type File } from './repl/state';
	import { browser } from '$app/environment';
	import { debounceFunction } from './utility';

	export let display: HTMLElement;
	export let consoleOut: HTMLElement;
	let cjOutputObserver: MutationObserver;

	async function startCheerpj() {
		await cheerpjInit({
			status: 'none',
			javaProperties: ['java.library.path=/app/cheerpj-natives/natives']
		});
		cheerpjCreateDisplay(-1, -1, display);
		// remove useless loading screen
		display.querySelector("#cheerpjDisplay")?.classList.remove("cheerpjLoading");
	}

	async function runCheerpj() {
		if (!browser || $isRunning) return;

		console.info('compileAndRun');
		$isRunning = true;
		// clear console: cheerpj writes in append
		consoleOut.innerHTML = '';
		cjOutputObserver.observe((consoleOut), {
			childList: true,
			subtree: true,
		});

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
		// clear display in case Swing has just run
		const cheerpjDisplay = display.querySelector("#cheerpjDisplay");
		if (cheerpjDisplay) cheerpjDisplay.innerHTML = '';
		cjOutputObserver.observe((display), {
			childList: true,
			subtree: true,
		});

		if (code === 0) await cheerpjRunMain(deriveMainClass($files[0]), classPath);

		$compileLog = consoleOut.innerText;
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

	const debounceRunCheerpj = debounceFunction(runCheerpj, 500);

	const unsubSaveFiles = files.subscribe(() => {
		if (!('cheerpjAddStringFile' in globalThis)) {
			return;
		} else if ($isRunning) {
			$isSaved = false;
		} else {
			try {
				const encoder = new TextEncoder();
				for (const file of $files) {
					cheerpjAddStringFile('/str/' + file.path, encoder.encode(file.content));
				}
				$isSaved = true;
				if ($autoRun) $runCode = true;
			} catch (error) {
				console.error('Error writing files to CheerpJ', error);
			}
		}
	});

	const unsubRunCode = runCode.subscribe(() => {
		if ($runCode) {
			$runCode = false;
			($autoRun) ? debounceRunCheerpj() : runCheerpj();
		}
	})

	onMount(async () => {
		// execution (=flag isRunning) is considered over
		// when console or display are updated (by cheerpj)
		cjOutputObserver = new MutationObserver(() => {
			if ($isRunning) {
				$isRunning = false;
				if (!$isSaved) files.update((files) => files);
				cjOutputObserver.disconnect();
			}
		});

		await startCheerpj();
		//cheerpj modules are imported force update
		// of $files so that now they will be stored in the cheerpj fs
		files.update((files) => files);
		await runCheerpj();
	});

	onDestroy(() => {
		unsubSaveFiles();
		unsubRunCode();
	});
</script>
