<script lang="ts">
	import Icon from '@iconify/svelte';
	import { isSidebarOpen } from './state';
	import { blur } from 'svelte/transition';
	import { effectiveTheme } from '$lib/settings/store';
	import SidebarOptions from './sidebar/SidebarOptions.svelte';

	import cheerpjDark from '$lib/assets/cheerpj/logotype-white.svg';
	import cheerpjLight from '$lib/assets/cheerpj/logotype-grey.svg';
	$: cheerpjLogotypeUrl = $effectiveTheme === 'dark' ? cheerpjDark : cheerpjLight;
</script>

<aside
	class="w-10 bg-stone-100 dark:bg-stone-800 flex-shrink-0 transition-[width] flex flex-col overflow-hidden"
	class:!w-80={$isSidebarOpen}
>
	<div class="text-right shadow-none animate-shadow" class:!shadow={$isSidebarOpen}>
		<button
			class="w-10 h-10 text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 inline-flex items-center justify-center"
			on:click={() => ($isSidebarOpen = !$isSidebarOpen)}
		>
			{#if $isSidebarOpen}
				<Icon icon="mi:close" class="w-4 h-4" />
			{:else}
				<Icon icon="mi:menu" class="w-5 h-5" />
			{/if}
		</button>
	</div>

	<div class="w-80 grow overflow-hidden">
		<div class="h-1/2 overflow-y-auto flex flex-col">
			<SidebarOptions
				forceClose={!$isSidebarOpen}
				on:selectOption={() => ($isSidebarOpen = true)}
			/>
		</div>
		{#if $isSidebarOpen}
			<div class="h-1/2 overflow-y-auto flex flex-col" transition:blur={{ duration: 150 }}>
				<div
					class="grow p-4 leading-tight bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300 text-sm"
				>
					<p>
						JavaFiddle is an online tool to <b>build</b> and <b>share</b> snippets of Java code.
					</p>

					<hr class="my-6 border-stone-300 dark:border-stone-600" />

					<ul class="list-disc space-y-2 ml-3">
						<li>
							Runs entirely <b>in your browser</b>.
						</li>
						<li>Supports all of Java SE 8, including Swing.</li>
					</ul>

					<div class="my-6 flex items-center justify-center gap-2">
						<a
							class="rounded bg-[#5865F2] text-white font-semibold px-3 py-2 inline-flex items-center justify-center gap-2"
							href="https://discord.gg/qBMHpK9Kqve"
						>
							<Icon icon="fa-brands:discord" class="w-4 h-4" />
							Discord server
						</a>

						<a
							class="rounded hover:bg-stone-800 text-stone-950 dark:text-white hover:text-white font-semibold px-3 py-2 inline-flex items-center justify-center gap-2"
							href="https://github.com/leaningtech/javafiddle"
						>
							<Icon icon="fa-brands:github" class="w-4 h-4" />
							View source
						</a>
					</div>

					<p>
						Looking for the <b>old version</b> of JavaFiddle?
						<a href="/old/index.html" class="text-orange-500 underline">It's still available here</a>.
					</p>
				</div>
				<a
					class="p-6 border-t-4 border-orange-500 bg-stone-300 dark:bg-stone-600 text-stone-800 dark:text-stone-100"
					href="https://labs.leaningtech.com/cheerpj"
				>
					<img src={cheerpjLogotypeUrl} alt="CheerpJ" class="h-12 mb-4" />
					<p class="text-sm leading-tight">
						Run Java applications in the browser with CheerpJ. Supports applets, JNLP, Web Start,
						Oracle Forms, and more.
					</p>
				</a>
			</div>
		{/if}
	</div>
</aside>
