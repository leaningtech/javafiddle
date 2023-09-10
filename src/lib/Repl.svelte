<script lang="ts">
	import CheerpJ from "./CheerpJ.svelte";
	import Menu from "./repl/Menu.svelte";
	import Sidebar from "./repl/Sidebar.svelte";
	import Output from "./repl/Output.svelte";
	import Editor from "./repl/Editor.svelte";
	import { files } from "./repl/state";
	import { browser } from "$app/environment";
	import FileTabs from "./repl/FileTabs.svelte";
	import { goto } from "$app/navigation";

	// TODO: use https://www.npmjs.com/package/@rich_harris/svelte-split-pane

	let consoleEl: HTMLPreElement;
	let display: HTMLDivElement;
	let isReady = false;

	async function ready() {
		isReady = true;
		files.set($files); // Force file write
	}

	// Compile 400ms after last change
	let timer: number | undefined;
	files.subscribe(() => {
		clearTimeout(timer);
		if (isReady) timer = setTimeout(compileAndRun, 100);
	});

	async function compileAndRun() {
		if (!browser || !isReady) return;

		console.info("compileAndRun");

		consoleEl.innerHTML = "";

		/*
		const packageName = "javafiddle" + (currentId++).toString();

		const newCode = "package " + packageName + ";\n" + value;
		cheerpjAddStringFile("/str/JavaFiddle.java", newCode);
		*/

		const sourceFiles = $files.map(file => "/str/" + file.path);
		const code = await cheerpjRunMain("com.sun.tools.javac.Main", "/app/tools.jar:/files/", ...sourceFiles, "-d", "/files/", "-Xlint");
		if (code != 0) {
			throw new Error("Compilation failed");
		}

		await cheerpjRunMain("fiddle.Main", "/app/tools.jar:/files/");
	}

	async function save() {
		const body = {
			files: $files,
		};
		const response = await fetch("", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});
		if (!response.ok) {
			console.error("save failed", response.status, await response.text());
			return;
		}

		// navigate if needed
		const { fiddleId } = await response.json();
		const url = "/" + fiddleId;
		if (window.location.pathname != url) {
			goto(url, { replaceState: true });
		}
	}
</script>

<div class="w-full h-full min-h-screen bg-white text-black font-sans flex flex-col">
	<Menu on:save={save} />
	<div class="flex items-stretch flex-1">
		<Sidebar />
		<div class="flex-1 overflow-hidden">
			<div class="h-1/2 flex flex-col">
				<div class="border-b border-stone-200 text-sm">
					<FileTabs />
				</div>

				<Editor />
			</div>
			<div class="h-1/2 flex flex-col overflow-hidden">
				<Output bind:console={consoleEl} bind:display={display} />
			</div>
		</div>
	</div>
</div>

<!-- TODO: iframe -->
<CheerpJ on:ready={ready} {display} />
