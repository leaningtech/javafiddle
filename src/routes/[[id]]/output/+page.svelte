<script lang="ts">
	import { browser } from "$app/environment";
	import CheerpJ from "$lib/CheerpJ.svelte";
	import Output from "$lib/repl/Output.svelte";
	import { files } from "$lib/repl/state";
	import Loading from "$lib/Loading.svelte";

	const isTop = typeof window === "object" && window.top === window;
	const isSaved = true; // TODO

	let loading = true;

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
		const compileLog = consoleEl.innerText;
		if (code != 0) {
			loading = false;
			window.top?.postMessage({ action: "compile_error", compileLog }, window.location.origin);
			throw new Error("Compilation failed");
		}

		consoleEl.innerHTML = "";
		await cheerpjRunMain("fiddle.Main", "/app/tools.jar:/files/");
		loading = false;
		window.top?.postMessage({ action: "running", compileLog }, window.location.origin);
	}
</script>

<svelte:window on:message={onMessage} />

<div class="w-screen h-screen" class:hidden={!loading}>
	<Loading />
</div>

<div class="flex flex-col w-screen h-screen overflow-hidden" class:hidden={loading}>
	<Output bind:console={consoleEl} bind:display={display} showLink={!isTop && isSaved} />
</div>

<CheerpJ on:ready={ready} {display} />
