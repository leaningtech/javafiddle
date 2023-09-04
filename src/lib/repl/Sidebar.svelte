<script lang="ts">
	let open = true; // TODO: persist to localStorage
</script>

<aside class="w-10 bg-stone-100 flex-shrink-0 transition-[width]" class:!w-80={open}>
	<div class="p-2 text-right">
		<button class="w-6 h-6 hover:bg-stone-200 text-stone-500" on:click={() => open = !open}>
			{#if open}
				X
			{:else}
				&lt;
			{/if}
		</button>
	</div>

	<div class="w-80 p-4 leading-tight text-stone-700">
		<p>
			JavaFiddle is an online tool to test and share snippets of Java code.
		</p>

		<hr class="my-4" />

		<ul class="list-disc space-y-2 ml-4">
			<li>
				Runs entirely <b>in your browser</b>.
			</li>
			<li>
				Works <b>offline</b>.
			</li>
			<li>
				Supports Swing, audio, printing - any Java SE component.
			</li>
		</ul>
	</div>
</aside>
