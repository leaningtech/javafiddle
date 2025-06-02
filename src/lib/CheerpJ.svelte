<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { autoRun, compileLog, files, isRunning, isSaved, runCode, type File } from './repl/state';
	import { debounceFunction } from './utilities';

	let cjConsole: HTMLElement;
	let cjOutput: HTMLElement;
	let cjOutputObserver: MutationObserver;

	async function startCheerpj() {
		await cheerpjInit({
			status: 'none',
			javaProperties: ['java.library.path=/app/cheerpj-natives/natives']
		});
		const display = document.getElementById("output");
		cheerpjCreateDisplay(-1, -1, display);
	}

	async function runCheerpj() {
		if ($isRunning) return;

		console.info('compileAndRun');
		$isRunning = true;
		cjConsole.innerHTML = '';
		cjOutput.innerHTML = '';

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
		if (code === 0) await cheerpjRunMain(deriveMainClass($files[0]), classPath);

		// in case nothing is written on cjConsole and cjOutput
		// manually unflag $isRunning
		if ($isRunning) $isRunning = false;
		$compileLog = cjConsole.innerText;
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

	let unsubSaveFiles: () => void;
	let unsubRunCode: () => void;

	onMount(async () => {
		await startCheerpj();

		cjConsole = document.getElementById("console");
		cjOutput = document.getElementById("cheerpjDisplay");
		// remove useless loading screen
		cjOutput.classList.remove("cheerpjLoading");

		unsubSaveFiles = files.subscribe(() => {
		if ($isRunning) {
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
		unsubRunCode = runCode.subscribe(() => {
			if ($runCode) {
				$runCode = false;
			($autoRun) ? debounceRunCheerpj() : runCheerpj();
			}
		});

		// code execution (flagged by isRunning) is considered over
		// when cjConsole or cjOutput are updated
		cjOutputObserver = new MutationObserver(() => {
			if ($isRunning && (cjConsole.innerHTML || cjOutput.innerHTML)) {
				$isRunning = false;
				if (!$isSaved) files.update((files) => files);
			}
		});
		cjOutputObserver.observe((cjConsole), {
			childList: true,
			subtree: true,
		});
		cjOutputObserver.observe((cjOutput), {
			childList: true,
			subtree: true,
		});

		await runCheerpj();
	});

	onDestroy(() => {
		if (unsubSaveFiles) unsubSaveFiles();
		if (unsubRunCode) unsubRunCode();
		if (cjOutputObserver) cjOutputObserver.disconnect();
	});
</script>
