<script lang="ts">
	import Menu from "./repl/Menu.svelte";
	import Sidebar from "./repl/Sidebar.svelte";
	import Editor from "./repl/Editor.svelte";
	import { files } from "./repl/state";
	import FileTabs from "./repl/FileTabs.svelte";
	import { goto } from "$app/navigation";

	// TODO: use https://www.npmjs.com/package/@rich_harris/svelte-split-pane

	export let outputUrl: string;
	
	let iframe: HTMLIFrameElement;
	let loading = false;

	files.subscribe(() => {
		if (!loading) {
			iframe?.contentWindow?.postMessage({
				action: "reload",
			}, window.location.origin);
			loading = true;
		}
	});

	function onMessage(event: MessageEvent) {
		if (event.origin !== window.location.origin) return;

		const { action } = event.data;
		console.log("recv from iframe", event.data);

		if (action === "ready") {
			iframe?.contentWindow?.postMessage({
				action: "run",
				files: $files,
			}, window.location.origin);
			loading = false; // once files are sent, any changes to files will trigger a reload
		} else if (action === "running") {
		} else if (action === "compile_error") {
			console.error("compile error", event.data.console);
		}
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

<svelte:window on:message={onMessage} />

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
			<div class="h-1/2 border-t border-stone-200">
				<iframe bind:this={iframe} src={outputUrl} class="w-full h-full" class:hidden={loading} title="Output" allowtransparency={true} frameborder={0} />
			</div>
		</div>
	</div>
</div>
