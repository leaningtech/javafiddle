<script lang="ts">
	import CheerpJ from "./CheerpJ.svelte";
	import Menu from "./repl/Menu.svelte";
	import Sidebar from "./repl/Sidebar.svelte";
	import Output from "./repl/Output.svelte";
	import { browser } from "$app/environment";

	// TODO: use https://www.npmjs.com/package/@rich_harris/svelte-split-pane

	let console: HTMLPreElement;
	let display: HTMLDivElement;

	let value = `class JavaFiddle {
	public static void main(String[] args) {
		System.out.println("Hello, World!"); 
	}
}
`;

	async function ready() {
		await compileAndRun(); // TODO: debounce
	}

	$: if (value && browser) {
		compileAndRun();
	}

	let currentId = 0;
	async function compileAndRun() {
		console.innerHTML = "";

		const packageName = "javafiddle" + (currentId++).toString();

		const newCode = "package " + packageName + ";\n" + value;
		cheerpjAddStringFile("/str/JavaFiddle.java", newCode);

		const code = await cheerpjRunMain("com.sun.tools.javac.Main", "/app/tools.jar:/files/", "/str/JavaFiddle.java","-d","/files/");
		if (code != 0) {
			throw new Error("Compilation failed");
		}

		cheerpjRunMain(packageName+".JavaFiddle", "/app/tools.jar:/files/");
	}
</script>

<div class="w-full h-full min-h-screen bg-white text-black font-sans flex flex-col">
	<Menu />
	<div class="flex items-stretch flex-1">
		<Sidebar />
		<div class="flex-1">
			<div class="h-1/2 flex flex-col">
				<div class="border-b border-stone-200 text-sm">
					<span class="inline-block px-3 py-2 text-stone-600 cursor-pointer">JavaFiddle.java</span>
				</div>

				<!-- TODO: codemirror -->
				<textarea class="font-mono w-full p-3 resize-none flex-1 outline-none" bind:value></textarea>
			</div>
			<div class="h-1/2 flex flex-col overflow-hidden">
				<Output bind:console={console} bind:display={display} />
			</div>
		</div>
	</div>
</div>

<!-- TODO: iframe -->
<CheerpJ on:ready={ready} {display} />
