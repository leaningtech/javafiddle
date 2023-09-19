<script lang="ts">
	import Menu from "./repl/Menu.svelte";
	import Sidebar from "./repl/Sidebar.svelte";
	import Editor from "./repl/Editor.svelte";
	import { fiddleTitle, files } from "./repl/state";
	import FileTabs from "./repl/FileTabs.svelte";
	import { goto } from "$app/navigation";
	import Loading from "./Loading.svelte";
	import { SplitPane } from '@rich_harris/svelte-split-pane';
	import { autoRun, theme } from "./settings/store";

	export let updated: Date | undefined;
	export let outputUrl: string;
	export let userFiddles: { id: string, title: string, updated: Date }[];
	let isSaving = false;
	let isSaved = false;

	let iframe: HTMLIFrameElement;
	let loading = false;
	let compileLog = "";

	files.subscribe(() => {
		isSaved = false;
		if ($autoRun) run();
	});

	function run() {
		if (!loading) {
			loading = true;
			iframe?.contentWindow?.postMessage({
				action: "reload",
			}, window.location.origin);
		}
	}

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
			compileLog = event.data.compileLog;
		} else if (action === "compile_error") {
			compileLog = event.data.compileLog;
		}
	}

	async function save() {
		isSaving = true;

		const body = {
			title: $fiddleTitle,
			files: $files,
		};
		const response = await fetch("", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});
		isSaving = false;
		if (!response.ok) {
			console.error("save failed", response.status, await response.text());
			return;
		}

		updated = new Date();
		isSaved = true;

		// navigate if needed
		const { fiddleId } = await response.json();
		const url = "/" + fiddleId;
		if (window.location.pathname != url) {
			goto(url, { replaceState: true });
		}
	}

	// Notify iframe of theme changes so it can reload its theme from localStorage
	$: {
		$theme;
		iframe?.contentWindow?.postMessage({
			action: "theme_change",
		}, window.location.origin);
	}
</script>

<svelte:window on:message={onMessage} />

<div class="w-full h-screen font-sans flex flex-col overflow-hidden">
	<Menu {updated} {isSaving} {isSaved} on:save={save} on:run={run} />
	<div class="flex items-stretch flex-1 overflow-hidden">
		<Sidebar {userFiddles} />
		<div class="flex-1 overflow-hidden">
			<SplitPane type="vertical" min="64px" max="-64px">
				<section slot="a" class="h-1/2 flex flex-col">
					<div class="border-b border-gray-200 dark:border-gray-700 text-sm">
						<FileTabs />
					</div>

					<Editor {compileLog} />
				</section>
				<section slot="b" class="border-t border-gray-200 dark:border-gray-700 overflow-hidden">
					<div class="w-full h-full" class:hidden={!loading}>
						<Loading />
					</div>
					<iframe bind:this={iframe} src={outputUrl} class="w-full h-full" class:hidden={loading} title="Output" allowtransparency={true} frameborder={0} />
				</section>
			</SplitPane>
		</div>
	</div>
</div>
