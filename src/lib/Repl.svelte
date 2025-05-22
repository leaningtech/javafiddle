<script lang="ts">
	import Menu from './repl/Menu.svelte';
	import Sidebar from './repl/Sidebar.svelte';
	import Editor from './repl/Editor.svelte';
	import Output from './repl/Output.svelte';
	import { autoRun, files, isloading, isSaved } from './repl/state';
	import FileTabs from './repl/FileTabs.svelte';
	import { SplitPane } from '@rich_harris/svelte-split-pane';
	import { debounceFunction, tryPlausible } from './utility'
	import { onDestroy, onMount } from 'svelte';

	export let enableSidebar: boolean = true;
	export let enableMenu: boolean = true;
	
	let cheerpjEngine: Output;
	let compileLog = '';

	async function share() {
		// custom event tracking for analytics
		tryPlausible('Share');

		await navigator.clipboard.writeText(window.location.toString());
	}

	async function run() {
		// custom event tracking for analytics
		tryPlausible('Compile');

		await cheerpjEngine.compileAndRun();
	}

	const delayedRun = debounceFunction(run, 500);

	// autorun mode
	const unsubAutoRun = files.subscribe(() => {
		if ($autoRun && !$isloading)
			delayedRun();
	});

	// run everytime autoRun mode is set
	const unsubSetAutoRun = autoRun.subscribe(() => {
		if ($autoRun) cheerpjEngine?.compileAndRun();
	});

	function onBeforeUnload(evt: BeforeUnloadEvent) {
		evt.preventDefault();
		return (evt.returnValue = '');
	}

	onMount(async () => {
		await cheerpjEngine.startCheerpj();
		if(!$autoRun)
			cheerpjEngine.compileAndRun();
	});

	onDestroy(() => {
		unsubAutoRun();
		unsubSetAutoRun();
	});
</script>

<svelte:window on:beforeunload={$isSaved ? undefined : onBeforeUnload} />

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

					<Editor {compileLog} on:run={run}/>
				</section>
				<section slot="b" class="border-t border-stone-200 dark:border-stone-700 overflow-hidden">
					<Output bind:this={cheerpjEngine}
						on:compileLog={(data) => compileLog = data.detail.compileLog}
					/>
				</section>
			</SplitPane>
		</div>
	</div>
</div>
