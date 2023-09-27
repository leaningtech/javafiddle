<script lang="ts">
	import Menu from "./repl/Menu.svelte";
	import Sidebar from "./repl/Sidebar.svelte";
	import Editor from "./repl/Editor.svelte";
	import { fiddleTitle, fiddleUpdated, files } from "./repl/state";
	import FileTabs from "./repl/FileTabs.svelte";
	import { goto } from "$app/navigation";
	import Loading from "./Loading.svelte";
	import { SplitPane } from '@rich_harris/svelte-split-pane';
	import { autoRun, theme } from "./settings/store";
	import { compress } from "./compress-fiddle";
	import { onMount } from "svelte";

	export let outputUrl: string;
	export let enableSidebar: boolean = true;
	export let enableMenu: boolean = true;

	let isSaved = true;

	let iframe: HTMLIFrameElement;
	let loading = false;
	let compileLog = "";

	files.subscribe(() => {
		isSaved = false;
		if ($autoRun) run();
	});

	// files is set by +layout.svelte on load, but we want to keep isSaved true on load
	// i.e. undo above subscription
	onMount(() => {
		isSaved = true;
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

	async function share() {
		$fiddleUpdated = new Date;
		const id = compress({
			title: $fiddleTitle,
			updated: $fiddleUpdated,
			files: $files,
		});
		isSaved = true;
		await goto(`/${id}`, { replaceState: true });
		await navigator.clipboard.writeText(window.location.toString());
	}

	// Notify iframe of theme changes so it can reload its theme from localStorage
	$: {
		$theme;
		iframe?.contentWindow?.postMessage({
			action: "theme_change",
		}, window.location.origin);
	}

	function onBeforeUnload(evt: BeforeUnloadEvent) {
		if (window.parent === window) {
			evt.preventDefault();
			return (evt.returnValue = "");
		}
	}
</script>

<svelte:window on:message={onMessage} on:beforeunload={isSaved ? undefined : onBeforeUnload} />

<div class="w-full h-screen font-sans flex flex-col overflow-hidden">
	{#if enableMenu}
		<Menu on:share={share} on:run={run} />
	{/if}
	<div class="flex items-stretch flex-1 overflow-hidden">
		{#if enableSidebar}
			<Sidebar />
		{/if}
		<div class="flex-1 overflow-hidden">
			<SplitPane type="vertical" min="64px" max="-64px">
				<section slot="a" class="h-1/2 flex flex-col">
					<div class="text-sm">
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
