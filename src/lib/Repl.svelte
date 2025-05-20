<script lang="ts">
	import Menu from './repl/Menu.svelte';
	import Sidebar from './repl/Sidebar.svelte';
	import Editor from './repl/Editor.svelte';
	import Output from './repl/Output.svelte';
	import { files } from './repl/state';
	import FileTabs from './repl/FileTabs.svelte';
	import { SplitPane } from '@rich_harris/svelte-split-pane';
	import { autoRun } from './settings/store';
	import { onMount } from 'svelte';
	import { tryPlausible } from './plausible';

	export let enableSidebar: boolean = true;
	export let enableMenu: boolean = true;
	
	let isSaved = true;
	let output: Output;
	let compileLog = '';

	files.subscribe(() => {
		isSaved = false;
		if ($autoRun) run();
	});

	// files is set by +layout.svelte on load, but we want to keep isSaved true on load
	// i.e. undo above subscription
	onMount(() => {
		isSaved = true;
	});

	async function run() {
		// custom event tracking for analytics
		tryPlausible('Compile');

		isSaved = true;
		await output.compileAndRun();
	}

	async function share() {
		// custom event tracking for analytics
		tryPlausible('Share');

		isSaved = true;
		await navigator.clipboard.writeText(window.location.toString());
	}

	function onBeforeUnload(evt: BeforeUnloadEvent) {
		evt.preventDefault();
		return (evt.returnValue = '');
	}
</script>

<svelte:window on:beforeunload={isSaved ? undefined : onBeforeUnload} />

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
				<section slot="b" class="border-t border-stone-200 dark:border-stone-700 overflow-hidden">
					<Output bind:this={output}
						on:running={(data) => {compileLog = data.detail.compileLog}} 
						on:compile_error={(data) => {compileLog = data.detail.compileLog}}
					/>
				</section>
			</SplitPane>
		</div>
	</div>
</div>
