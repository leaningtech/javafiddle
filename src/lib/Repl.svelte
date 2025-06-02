<script lang="ts">
	import Menu from './repl/Menu.svelte';
	import Sidebar from './repl/Sidebar.svelte';
	import Editor from './repl/Editor.svelte';
	import { isSaved, runCode } from './repl/state';
	import FileTabs from './repl/FileTabs.svelte';
	import { SplitPane } from '@rich_harris/svelte-split-pane';
	import { tryPlausible } from './utilities';
	import Output from './repl/Output.svelte';

	export let enableSidebar: boolean = true;
	export let enableMenu: boolean = true;

	async function share() {
		tryPlausible('Share');
		await navigator.clipboard.writeText(window.location.toString());
	}

	// only used when the users presses the button RUN
	async function run() {
		tryPlausible('Compile');
		$runCode = true;
	}

	function onBeforeUnload(evt: BeforeUnloadEvent) {
		if (window.parent === window) {
			evt.preventDefault();
			return (evt.returnValue = '');
		}
	}
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

					<Editor />
				</section>
				<section slot="b" class="border-t border-stone-200 dark:border-stone-700 overflow-hidden">
					<Output />
				</section>
			</SplitPane>
		</div>
	</div>
</div>
