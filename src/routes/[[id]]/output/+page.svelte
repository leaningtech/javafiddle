<script lang="ts">
	import { browser } from "$app/environment";
	import CheerpJ from "$lib/CheerpJ.svelte";
	import Output from "$lib/repl/Output.svelte";
	import { files } from "$lib/repl/state";

	const isTop = typeof window === "object" && window.top === window;
	const isSaved = true; // TODO

	async function ready() {
		if (window.top !== window && window.top) {
			// Tell parent frame we are ready to recieve files
			window.top.postMessage({ action: "ready" }, window.location.origin);
		} else {
			// Load files from server
			files.set($files); // Force file write
			compileAndRun();
		}
	}

	function onMessage(event: MessageEvent) {
		if (event.origin !== window.location.origin) return;

		const { action } = event.data;
		console.log("recv from top", event.data);

		if (action === "reload") {
			window.location.reload();
		} else if (action === "run") {
			files.set(event.data.files);
			compileAndRun();
		}
	}

	let consoleEl: HTMLPreElement;
	let display: HTMLDivElement;

	async function compileAndRun() {
		if (!browser) return;

		console.info("compileAndRun");

		consoleEl.innerHTML = "";

		const sourceFiles = $files.map(file => "/str/" + file.path);
		const code = await cheerpjRunMain("com.sun.tools.javac.Main", "/app/tools.jar:/files/", ...sourceFiles, "-d", "/files/", "-Xlint");
		if (code != 0) {
			window.top?.postMessage({ action: "compile_error", console: consoleEl.innerText }, window.location.origin);
			throw new Error("Compilation failed");
		}

		await cheerpjRunMain("fiddle.Main", "/app/tools.jar:/files/");

		window.top?.postMessage({ action: "running" }, window.location.origin);
	}
</script>

<svelte:window on:message={onMessage} />

<div class="flex flex-col w-screen h-screen overflow-hidden">
	<Output bind:console={consoleEl} bind:display={display} showLink={!isTop && isSaved} />
</div>

<CheerpJ on:ready={ready} {display} />
